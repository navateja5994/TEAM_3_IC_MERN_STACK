const ScheduledJob = require('../models/ScheduledJob');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const MessageReceipt = require('../models/MessageReceipt');
const Timetable = require('../models/Timetable');
const TimetableException = require('../models/TimetableException');
const ClassMember = require('../models/ClassMember');
const Holiday = require('../models/Holiday');
const User = require('../models/User');
const Notification = require('../models/Notification');

let ioInstance = null;

const initScheduler = (io) => {
  ioInstance = io;
  // Poll scheduled jobs every 15 seconds
  setInterval(processJobs, 15000);
  // Check timetable reminders every 60 seconds
  setInterval(checkTimetableReminders, 60000);
  console.log('Scheduler initialized successfully.');
};

// Process Scheduled Jobs (Messages)
const processJobs = async () => {
  const now = new Date();
  try {
    // Find due jobs
    const jobs = await ScheduledJob.find({
      scheduledAt: { $lte: now },
      $or: [
        { nextAttemptAt: { $exists: false } },
        { nextAttemptAt: { $lte: now } }
      ],
      status: { $in: ['scheduled', 'failed'] },
      retryCount: { $lt: 3 }
    });

    for (let job of jobs) {
      // Atomic Lock Check
      const claimedJob = await ScheduledJob.findOneAndUpdate(
        {
          _id: job._id,
          status: { $in: ['scheduled', 'failed'] }
        },
        { $set: { status: 'processing' } },
        { new: true }
      );

      if (!claimedJob) continue; // Claimed by another tick

      try {
        if (claimedJob.jobType === 'message') {
          await dispatchScheduledMessage(claimedJob);
        }
        
        claimedJob.status = 'completed';
        await claimedJob.save();
      } catch (error) {
        console.error(`Error processing job ${claimedJob._id}:`, error);
        
        claimedJob.retryCount += 1;
        claimedJob.error = error.message || 'Unknown processing error';

        if (claimedJob.retryCount < claimedJob.maxRetries) {
          claimedJob.status = 'failed';
          // Exponential backoff: 30s -> 60s -> 120s
          const backoffDelay = claimedJob.retryCount * 30 * 1000;
          claimedJob.nextAttemptAt = new Date(Date.now() + backoffDelay);
        } else {
          claimedJob.status = 'failed'; // Exceeded retries limit
        }
        await claimedJob.save();
      }
    }
  } catch (err) {
    console.error('Scheduler error in processJobs:', err);
  }
};

// Dispatch individual scheduled messages idempotently
const dispatchScheduledMessage = async (job) => {
  const { conversationId, senderId, messageType, text, mediaUrl, voiceDuration, requireAcknowledgement } = job.data;

  // 1. Idempotency Check (Check unique scheduledJobId)
  const existingMessage = await Message.findOne({ scheduledJobId: job._id });
  if (existingMessage) {
    console.log(`Job ${job._id} was already executed. Skipping duplication.`);
    return;
  }

  // Verify conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation context not found.');
  }

  // Create Message
  const message = new Message({
    conversationId,
    senderId,
    messageType,
    text,
    mediaUrl,
    voiceDuration,
    scheduledJobId: job._id,
    requireAcknowledgement
  });

  await message.save();

  // Update Conversation
  conversation.lastMessage = message._id;
  conversation.updatedAt = new Date();
  await conversation.save();

  // Create MessageReceipts
  const participantsToNotify = conversation.participants.filter(p => p.toString() !== senderId.toString());
  const receipts = participantsToNotify.map(userId => ({
    messageId: message._id,
    userId,
    status: 'delivered',
    deliveredAt: new Date()
  }));

  if (receipts.length > 0) {
    await MessageReceipt.insertMany(receipts);
  }

  // Populate message sender info
  const populatedMessage = await Message.findById(message._id)
    .populate('senderId', 'name role profileImage');

  // Broadcast
  if (ioInstance) {
    if (conversation.isGroup) {
      ioInstance.to(`group_${conversation.groupId}`).emit('new_message', {
        conversationId,
        message: populatedMessage
      });
    } else {
      conversation.participants.forEach(p => {
        ioInstance.to(`user_${p}`).emit('new_message', {
          conversationId,
          message: populatedMessage
        });
      });
    }
  }
};

// Polling routine for recurring class reminders
const checkTimetableReminders = async () => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday

    // Target check time: e.g. 10 minutes in the future
    // In typical local context, teachers can customize offset. We check standard default 10 minutes.
    const targetOffset = 10; 
    const targetTime = new Date(now.getTime() + targetOffset * 60 * 1000);
    const targetHours = String(targetTime.getHours()).padStart(2, '0');
    const targetMinutes = String(targetTime.getMinutes()).padStart(2, '0');
    const timeMatch = `${targetHours}:${targetMinutes}`; // E.g. "09:00"

    // 1. Find all active templates starting at target time on this day of week
    const templates = await Timetable.find({
      dayOfWeek,
      startTime: timeMatch,
      semesterStart: { $lte: now },
      semesterEnd: { $gte: now },
      isPaused: false
    }).populate('classId');

    for (let template of templates) {
      const orgId = template.classId.organizationId;

      // 2. Check College Holiday
      const holiday = await Holiday.findOne({
        organizationId: orgId,
        startDate: { $lte: now },
        endDate: { $gte: now }
      });
      if (holiday) continue; // Skip reminders on holiday!

      // 3. Check Timetable Exceptions (Cancellations/Reschedules)
      const exception = await TimetableException.findOne({
        timetableId: template._id,
        date: todayStr
      });

      if (exception) {
        if (exception.type === 'cancel') continue; // Class is cancelled
        if (exception.type === 'reschedule') {
          // If rescheduled, its notification should match the new start time, not the old template time
          continue; 
        }
      }

      // Check if we've already generated reminders for this class on this date to prevent duplicates
      const uniqueReminderKey = `reminder_${template._id}_${todayStr}`;
      const duplicateCheck = await Notification.findOne({
        userId: template.teacherId, // Check teacher's reminder log
        referenceId: template._id,
        body: new RegExp(todayStr)
      });

      if (duplicateCheck) continue; // Already processed

      // 4. Resolve Active Teacher (Regular or Substitute)
      let activeTeacherId = template.teacherId;
      if (exception && exception.type === 'substitute') {
        activeTeacherId = exception.substituteTeacherId;
      }

      const activeTeacher = await User.findById(activeTeacherId).select('name');
      const teacherName = activeTeacher ? activeTeacher.name : 'Faculty';

      // 5. Query affected students
      const classMembers = await ClassMember.find({ classId: template.classId._id, role: 'student' });
      const studentIds = classMembers.map(c => c.userId);

      // Create student reminders
      const studentNotifications = studentIds.map(userId => ({
        userId,
        title: 'Upcoming Class 🔔',
        body: `[${todayStr}] ${template.subject} starts in 10 minutes at ${template.startTime} in Room ${template.room}. Teacher: ${teacherName}.`,
        type: 'timetable',
        priority: 'normal',
        referenceId: template._id
      }));

      // Create teacher reminder
      const teacherNotification = {
        userId: activeTeacherId,
        title: 'Class Starting Soon 🧑‍🏫',
        body: `[${todayStr}] Your class ${template.subject} (${template.classId.name}) starts in 10 minutes at ${template.startTime} in Room ${template.room}.`,
        type: 'timetable',
        priority: 'normal',
        referenceId: template._id
      };

      // Bulk write notifications
      if (studentNotifications.length > 0) {
        await Notification.insertMany(studentNotifications);
      }
      await Notification.create(teacherNotification);

      // Socket live notifications
      if (ioInstance) {
        // Teacher
        ioInstance.to(`user_${activeTeacherId}`).emit('new_notification', {
          title: 'Class Starting Soon 🧑‍🏫',
          body: `Your class ${template.subject} starts in 10 minutes.`
        });
        // Students
        studentIds.forEach(uid => {
          ioInstance.to(`user_${uid}`).emit('new_notification', {
            title: 'Upcoming Class 🔔',
            body: `${template.subject} starts in 10 minutes in Room ${template.room}.`
          });
        });
      }
    }

    // 6. Check Rescheduled class exceptions starting in 10 minutes
    const rescheduleExceptions = await TimetableException.find({
      date: todayStr,
      type: 'reschedule',
      newStartTime: timeMatch
    }).populate({
      path: 'timetableId',
      populate: { path: 'classId' }
    });

    for (let exception of rescheduleExceptions) {
      const template = exception.timetableId;
      if (!template) continue;
      
      const duplicateCheck = await Notification.findOne({
        userId: template.teacherId,
        referenceId: template._id,
        body: new RegExp(`[Rescheduled] ${todayStr}`)
      });

      if (duplicateCheck) continue;

      const classMembers = await ClassMember.find({ classId: template.classId._id, role: 'student' });
      const studentIds = classMembers.map(c => c.userId);

      const activeTeacher = await User.findById(template.teacherId).select('name');
      const teacherName = activeTeacher ? activeTeacher.name : 'Faculty';

      // Create student reminders
      const studentNotifications = studentIds.map(userId => ({
        userId,
        title: 'Upcoming Class (Rescheduled) 🗓️',
        body: `[Rescheduled] [${todayStr}] ${template.subject} starts in 10 minutes at ${exception.newStartTime} in Room ${exception.newRoom}. Teacher: ${teacherName}.`,
        type: 'timetable',
        priority: 'normal',
        referenceId: template._id
      }));

      // Create teacher reminder
      const teacherNotification = {
        userId: template.teacherId,
        title: 'Class Starting Soon (Rescheduled) 🧑‍🏫',
        body: `[Rescheduled] [${todayStr}] Your class ${template.subject} starts in 10 minutes at ${exception.newStartTime} in Room ${exception.newRoom}.`,
        type: 'timetable',
        priority: 'normal',
        referenceId: template._id
      };

      if (studentNotifications.length > 0) {
        await Notification.insertMany(studentNotifications);
      }
      await Notification.create(teacherNotification);

      if (ioInstance) {
        ioInstance.to(`user_${template.teacherId}`).emit('new_notification', {
          title: 'Upcoming Rescheduled Class 🧑‍🏫',
          body: `Your rescheduled class ${template.subject} starts in 10 minutes.`
        });
        studentIds.forEach(uid => {
          ioInstance.to(`user_${uid}`).emit('new_notification', {
            title: 'Upcoming Rescheduled Class 🗓️',
            body: `${template.subject} starts in 10 minutes in Room ${exception.newRoom}.`
          });
        });
      }
    }
  } catch (err) {
    console.error('Error in checkTimetableReminders:', err);
  }
};

module.exports = {
  initScheduler
};
