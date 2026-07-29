const Notification = require('../models/Notification');

// Get all notifications for user
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read for user
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};
