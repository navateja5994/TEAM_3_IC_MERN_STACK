const Timetable = require('../models/Timetable');
const TimetableException = require('../models/TimetableException');
const ClassMember = require('../models/ClassMember');
const Holiday = require('../models/Holiday');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { normalizePhoneNumber } = require('../utils/helpers');

// Helper to check if a date is within a holiday
const getHolidayForDate = async (dateStr, orgId) => {
  const date = new Date(dateStr);
  // Set time boundaries for accurate day comparison
  const startOfDay = new Date(date.setHours(0,0,0,0));
  const endOfDay = new Date(date.setHours(23,59,59,999));
  
  return await Holiday.findOne({
    organizationId: orgId,
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay }
  });
};

// Create a recurring timetable entry
exports.createTimetableEntry = async (req, res, next) => {
  try {
    const { teacherId, subject, room, dayOfWeek, startTime, endTime, classId, semesterStart, semesterEnd } = req.body;

    if (!teacherId || !subject || !room || dayOfWeek === undefined || !startTime || !endTime || !classId || !semesterStart || !semesterEnd) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const timetable = new Timetable({
      teacherId,
      subject,
      room,
      dayOfWeek: parseInt(dayOfWeek, 10),
      startTime,
      endTime,
      classId,
      semesterStart: new Date(semesterStart),
      semesterEnd: new Date(semesterEnd)
    });

    await timetable.save();
    res.status(201).json({ message: 'Timetable entry added successfully.', timetable });
  } catch (error) {
    next(error);
  }
};

// Edit timetable entry
exports.updateTimetableEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const timetable = await Timetable.findByIdAndUpdate(id, updateFields, { new: true });
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    res.json({ message: 'Timetable template updated successfully.', timetable });
  } catch (error) {
    next(error);
  }
};

// Delete timetable entry
exports.deleteTimetableEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findByIdAndDelete(id);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    // Clean up exceptions associated with this timetable
    await TimetableException.deleteMany({ timetableId: id });

    res.json({ message: 'Timetable entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Cancel a specific class occurrence
exports.cancelClass = async (req, res, next) => {
  try {
    const { timetableId, date, reason } = req.body; // date format: "YYYY-MM-DD"
    const teacherId = req.user.userId;

    if (!timetableId || !date) {
      return res.status(400).json({ error: 'Timetable ID and Date are required.' });
    }

    const timetable = await Timetable.findById(timetableId).populate('classId');
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    // Create Exception
    const exception = new TimetableException({
      timetableId,
      date,
      type: 'cancel',
      reason: reason || 'Faculty unavailable'
    });
    await exception.save();

    // Notify affected students in the class
    const members = await ClassMember.find({ classId: timetable.classId }).select('userId');
    const studentIds = members.map(m => m.userId);

    const notifications = studentIds.map(userId => ({
      userId,
      title: 'Class Cancelled ⚠️',
      body: `${timetable.subject} class scheduled for ${date} at ${timetable.startTime} has been cancelled. Reason: ${exception.reason}`,
      type: 'timetable',
      priority: 'urgent',
      referenceId: timetable._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Socket.io alerts
    const io = req.app.get('io');
    if (io) {
      studentIds.forEach(uid => {
        io.to(`user_${uid}`).emit('new_notification', {
          title: 'Class Cancelled ⚠️',
          body: `${timetable.subject} class scheduled for ${date} at ${timetable.startTime} has been cancelled.`
        });
      });
    }

    res.json({ message: 'Class cancelled successfully. Students notified.', exception });
  } catch (error) {
    next(error);
  }
};

// Reschedule a class occurrence
exports.rescheduleClass = async (req, res, next) => {
  try {
    const { timetableId, date, newStartTime, newEndTime, newRoom, reason } = req.body;
    
    if (!timetableId || !date || !newStartTime || !newEndTime || !newRoom) {
      return res.status(400).json({ error: 'Timetable ID, Date, New Time, and Room are required.' });
    }

    const timetable = await Timetable.findById(timetableId).populate('classId');
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    const exception = new TimetableException({
      timetableId,
      date,
      type: 'reschedule',
      originalStartTime: timetable.startTime,
      originalEndTime: timetable.endTime,
      newStartTime,
      newEndTime,
      newRoom,
      reason: reason || 'Rescheduled by faculty'
    });
    await exception.save();

    // Get Teacher Details
    const teacher = await User.findById(timetable.teacherId).select('name');

    // Notify students
    const members = await ClassMember.find({ classId: timetable.classId }).select('userId');
    const studentIds = members.map(m => m.userId);

    const notifications = studentIds.map(userId => ({
      userId,
      title: 'Class Rescheduled 🗓️',
      body: `${timetable.subject} class on ${date} has been rescheduled. Previous: ${timetable.startTime}. New Time: ${newStartTime}-${newEndTime} in Room: ${newRoom}. Teacher: ${teacher ? teacher.name : 'Faculty'}.`,
      type: 'timetable',
      priority: 'urgent',
      referenceId: timetable._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    const io = req.app.get('io');
    if (io) {
      studentIds.forEach(uid => {
        io.to(`user_${uid}`).emit('new_notification', {
          title: 'Class Rescheduled 🗓️',
          body: `${timetable.subject} class has been rescheduled to ${newStartTime} on ${date}.`
        });
      });
    }

    res.json({ message: 'Class rescheduled successfully. Students notified.', exception });
  } catch (error) {
    next(error);
  }
};

// Assign a Substitute Teacher
exports.assignSubstitute = async (req, res, next) => {
  try {
    const { timetableId, date, substituteTeacherId, reason } = req.body;

    if (!timetableId || !date || !substituteTeacherId) {
      return res.status(400).json({ error: 'Timetable ID, Date, and Substitute Teacher ID are required.' });
    }

    const timetable = await Timetable.findById(timetableId).populate('classId');
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    const substitute = await User.findById(substituteTeacherId);
    if (!substitute || substitute.role !== 'teacher') {
      return res.status(400).json({ error: 'Invalid substitute teacher.' });
    }

    const exception = new TimetableException({
      timetableId,
      date,
      type: 'substitute',
      substituteTeacherId,
      reason: reason || 'Regular faculty unavailable'
    });
    await exception.save();

    // Notify substitute teacher
    await Notification.create({
      userId: substituteTeacherId,
      title: 'Substitute Class Assigned 🧑‍🏫',
      body: `You have been assigned as a substitute teacher for ${timetable.subject} class (${timetable.classId.name}) on ${date} at ${timetable.startTime} in Room ${timetable.room}.`,
      type: 'timetable',
      priority: 'important',
      referenceId: timetable._id
    });

    // Notify students
    const members = await ClassMember.find({ classId: timetable.classId }).select('userId');
    const studentIds = members.map(m => m.userId);

    const notifications = studentIds.map(userId => ({
      userId,
      title: 'Substitute Teacher Assigned 🧑‍🏫',
      body: `${timetable.subject} class on ${date} at ${timetable.startTime} will be handled by substitute teacher ${substitute.name}.`,
      type: 'timetable',
      priority: 'important',
      referenceId: timetable._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Socket.IO updates
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${substituteTeacherId}`).emit('new_notification', {
        title: 'Substitute Class Assigned 🧑‍🏫',
        body: `Substitute assignment for ${timetable.subject} class on ${date}.`
      });
      studentIds.forEach(uid => {
        io.to(`user_${uid}`).emit('new_notification', {
          title: 'Substitute Teacher Assigned 🧑‍🏫',
          body: `${timetable.subject} starts at ${timetable.startTime} with substitute ${substitute.name}.`
        });
      });
    }

    res.json({ message: 'Substitute teacher assigned. Teacher and students notified.', exception });
  } catch (error) {
    next(error);
  }
};

// Retrieve active timetable for a specific user on a specific date (resolving holidays & exceptions)
exports.getTimetableForDate = async (req, res, next) => {
  try {
    const { date } = req.query; // Format: "YYYY-MM-DD"
    const userId = req.user.userId;
    const orgId = req.user.organizationId;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required.' });
    }

    const queryDate = new Date(date);
    const dayOfWeek = queryDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // 1. Fetch Holiday check
    const holiday = await getHolidayForDate(date, orgId);

    // 2. Fetch User Classes
    const classMemberships = await ClassMember.find({ userId });
    const classIds = classMemberships.map(m => m.classId);

    // 3. Query Timetable entries matching Day of Week and Semester Date range
    let query = {};
    if (req.user.role === 'teacher') {
      // Teachers retrieve classes they teach
      query = {
        teacherId: userId,
        dayOfWeek,
        semesterStart: { $lte: queryDate },
        semesterEnd: { $gte: queryDate },
        isPaused: false
      };
    } else {
      // Students retrieve classes they are enrolled in
      query = {
        classId: { $in: classIds },
        dayOfWeek,
        semesterStart: { $lte: queryDate },
        semesterEnd: { $gte: queryDate },
        isPaused: false
      };
    }

    const templates = await Timetable.find(query)
      .populate('teacherId', 'name profileImage')
      .populate('classId', 'name');

    // 4. Fetch Exceptions for these timetables on this date
    const timetableIds = templates.map(t => t._id);
    const exceptions = await TimetableException.find({
      timetableId: { $in: timetableIds },
      date: date
    }).populate('substituteTeacherId', 'name profileImage');

    // 5. Build Resolved schedule
    const schedule = [];

    for (let template of templates) {
      let item = {
        _id: template._id,
        subject: template.subject,
        startTime: template.startTime,
        endTime: template.endTime,
        room: template.room,
        teacher: template.teacherId,
        class: template.classId,
        status: 'Upcoming' // default state
      };

      // Apply holiday overrides
      if (holiday) {
        item.status = 'Cancelled';
        item.reason = `Holiday: ${holiday.name}`;
      } else {
        // Apply individual exceptions
        const exception = exceptions.find(e => e.timetableId.toString() === template._id.toString());
        if (exception) {
          if (exception.type === 'cancel') {
            item.status = 'Cancelled';
            item.reason = exception.reason;
          } else if (exception.type === 'reschedule') {
            item.status = 'Rescheduled';
            item.startTime = exception.newStartTime;
            item.endTime = exception.newEndTime;
            item.room = exception.newRoom;
            item.reason = exception.reason;
          } else if (exception.type === 'substitute') {
            item.status = 'Substitute Assigned';
            item.teacher = exception.substituteTeacherId;
            item.reason = exception.reason;
          }
        }
      }

      schedule.push(item);
    }

    // Sort by startTime
    schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
      date,
      holiday: holiday ? holiday.name : null,
      schedule
    });
  } catch (error) {
    next(error);
  }
};
