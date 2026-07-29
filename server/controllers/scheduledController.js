const ScheduledJob = require('../models/ScheduledJob');
const Conversation = require('../models/Conversation');
const { normalizePhoneNumber } = require('../utils/helpers');

// Create Scheduled Message Job
exports.createScheduledMessage = async (req, res, next) => {
  try {
    const { conversationId, text, messageType, mediaUrl, voiceDuration, scheduledAt, requireAcknowledgement } = req.body;
    const senderId = req.user.userId;

    if (!conversationId || !scheduledAt) {
      return res.status(400).json({ error: 'Conversation ID and scheduled execution date are required.' });
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future.' });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found or access denied.' });
    }

    // Create ScheduledJob
    const job = new ScheduledJob({
      jobType: 'message',
      scheduledAt: scheduledDate,
      status: 'scheduled',
      data: {
        conversationId,
        senderId,
        messageType: messageType || 'text',
        text: text || '',
        mediaUrl: mediaUrl || '',
        voiceDuration: voiceDuration || 0,
        requireAcknowledgement: requireAcknowledgement || false
      }
    });

    await job.save();
    res.status(201).json({ message: 'Message scheduled successfully.', job });
  } catch (error) {
    next(error);
  }
};

// Get scheduled messages list for user
exports.getScheduledMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const jobs = await ScheduledJob.find({
      jobType: 'message',
      'data.senderId': userId
    }).sort({ scheduledAt: 1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// Edit pending scheduled message
exports.updateScheduledMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, mediaUrl, voiceDuration, requireAcknowledgement } = req.body;
    const userId = req.user.userId;

    const job = await ScheduledJob.findOne({ _id: id, 'data.senderId': userId });
    if (!job) {
      return res.status(404).json({ error: 'Scheduled message not found.' });
    }

    if (job.status !== 'scheduled') {
      return res.status(400).json({ error: `Cannot edit message with status: ${job.status}` });
    }

    // Edit payload data
    if (text !== undefined) job.data.text = text;
    if (mediaUrl !== undefined) job.data.mediaUrl = mediaUrl;
    if (voiceDuration !== undefined) job.data.voiceDuration = voiceDuration;
    if (requireAcknowledgement !== undefined) job.data.requireAcknowledgement = requireAcknowledgement;

    // Force Mongoose to notice changes on Mixed field
    job.markModified('data');

    await job.save();
    res.json({ message: 'Scheduled message updated successfully.', job });
  } catch (error) {
    next(error);
  }
};

// Cancel scheduled message
exports.cancelScheduledMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const job = await ScheduledJob.findOne({ _id: id, 'data.senderId': userId });
    if (!job) {
      return res.status(404).json({ error: 'Scheduled message not found.' });
    }

    if (job.status !== 'scheduled') {
      return res.status(400).json({ error: `Cannot cancel message with status: ${job.status}` });
    }

    job.status = 'cancelled';
    await job.save();

    res.json({ message: 'Scheduled message cancelled successfully.', job });
  } catch (error) {
    next(error);
  }
};

// Reschedule scheduled message
exports.rescheduleMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newScheduledAt } = req.body;
    const userId = req.user.userId;

    if (!newScheduledAt) {
      return res.status(400).json({ error: 'New scheduled date/time is required.' });
    }

    const scheduledDate = new Date(newScheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ error: 'New scheduled time must be in the future.' });
    }

    const job = await ScheduledJob.findOne({ _id: id, 'data.senderId': userId });
    if (!job) {
      return res.status(404).json({ error: 'Scheduled message not found.' });
    }

    job.status = 'scheduled';
    job.scheduledAt = scheduledDate;
    job.retryCount = 0;
    job.nextAttemptAt = undefined;
    job.error = '';
    
    await job.save();

    res.json({ message: 'Message rescheduled successfully.', job });
  } catch (error) {
    next(error);
  }
};
