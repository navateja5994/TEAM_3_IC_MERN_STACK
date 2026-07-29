const User = require('../models/User');
const ClassMember = require('../models/ClassMember');
const Class = require('../models/Class');
const Conversation = require('../models/Conversation');
const BlockedUser = require('../models/BlockedUser');
const { normalizePhoneNumber } = require('../utils/helpers');
const { onlineUsers } = require('../sockets/socketHandler');

// Helper to mask phone numbers (e.g. +919876543210 -> +91******10)
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const len = phone.length;
  if (len < 5) return '***';
  return phone.slice(0, 3) + '*'.repeat(len - 5) + phone.slice(len - 2);
};

// Search user by E.164 phone number
exports.searchByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number parameter is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const user = await User.findOne({
      organizationId: req.user.organizationId,
      phoneNumber: normalizedPhone,
      isActive: true
    }).populate('department');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mask phone number and filter sensitive fields
    const responseData = {
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      role: user.role,
      department: user.department ? user.department.name : '',
      phoneNumberMasked: maskPhoneNumber(user.phoneNumber)
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

// Get directory list divided by groups/teachers/students/recent
exports.getContacts = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const orgId = req.user.organizationId;

    // Fetch teachers in same organization
    const teachers = await User.find({
      organizationId: orgId,
      role: 'teacher',
      isActive: true,
      _id: { $ne: currentUserId }
    }).select('name role profileImage department').populate('department');

    // Fetch students in same organization
    const students = await User.find({
      organizationId: orgId,
      role: 'student',
      isActive: true,
      _id: { $ne: currentUserId }
    }).select('name role profileImage department year section').populate('department');

    // Fetch recent conversations for this user
    const recentConversations = await Conversation.find({
      participants: currentUserId
    })
    .populate('participants', 'name role profileImage phoneNumber')
    .populate('lastMessage')
    .sort({ updatedAt: -1 })
    .limit(30);

    // Filter recent users
    const recentUsers = [];
    const seen = new Set();
    recentConversations.forEach(c => {
      c.participants.forEach(p => {
        if (p._id.toString() !== currentUserId.toString() && !seen.has(p._id.toString())) {
          seen.add(p._id.toString());
          recentUsers.push({
            _id: p._id,
            name: p.name,
            role: p.role,
            profileImage: p.profileImage,
            phoneNumberMasked: maskPhoneNumber(p.phoneNumber)
          });
        }
      });
    });

    res.json({
      recent: recentUsers,
      teachers,
      students
    });
  } catch (error) {
    next(error);
  }
};

// Block a user
exports.blockUser = async (req, res, next) => {
  try {
    const { blockedUserId } = req.body;
    const userId = req.user.userId;

    if (!blockedUserId) {
      return res.status(400).json({ error: 'Blocked User ID is required.' });
    }

    if (userId.toString() === blockedUserId.toString()) {
      return res.status(400).json({ error: 'You cannot block yourself.' });
    }

    const existingBlock = await BlockedUser.findOne({ userId, blockedUserId });
    if (existingBlock) {
      return res.status(400).json({ error: 'User is already blocked.' });
    }

    const block = new BlockedUser({ userId, blockedUserId });
    await block.save();

    res.json({ message: 'User blocked successfully.', block });
  } catch (error) {
    next(error);
  }
};

// Unblock a user
exports.unblockUser = async (req, res, next) => {
  try {
    const { blockedUserId } = req.body;
    const userId = req.user.userId;

    if (!blockedUserId) {
      return res.status(400).json({ error: 'Blocked User ID is required.' });
    }

    const result = await BlockedUser.deleteOne({ userId, blockedUserId });
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: 'User is not blocked.' });
    }

    res.json({ message: 'User unblocked successfully.' });
  } catch (error) {
    next(error);
  }
};

// Report a user (Mock implementation log)
exports.reportUser = async (req, res, next) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reporterId = req.user.userId;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ error: 'Reported User ID and Reason are required.' });
    }

    console.log(`\n--- [USER REPORT LOG] ---`);
    console.log(`Reporter ID: ${reporterId}`);
    console.log(`Reported ID: ${reportedUserId}`);
    console.log(`Reason:      ${reason}`);
    console.log(`-------------------------\n`);

    res.json({ message: 'User reported successfully. Administrators will review the logs.' });
  } catch (error) {
    next(error);
  }
};

// Fetch list of online user IDs
exports.getOnlineUsers = (req, res, next) => {
  try {
    // onlineUsers is a Map of String -> Set
    const ids = Array.from(onlineUsers.keys());
    res.json(ids);
  } catch (error) {
    next(error);
  }
};
