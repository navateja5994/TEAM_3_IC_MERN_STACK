const Conversation = require('../models/Conversation');
const User = require('../models/User');
const BlockedUser = require('../models/BlockedUser');
const GroupMember = require('../models/GroupMember');

// Helper to mask phone numbers (e.g. +919876543210 -> +91******10)
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const len = phone.length;
  if (len < 5) return '***';
  return phone.slice(0, 3) + '*'.repeat(len - 5) + phone.slice(len - 2);
};

// Helper to mask emails (e.g. ravi@smartnotify.edu -> r***i@smartnotify.edu)
const maskEmail = (email) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return `*@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

// Mask contact information of participants based on consent
const maskConversationDetails = (conv, currentUserId) => {
  const obj = conv.toObject ? conv.toObject() : conv;
  
  if (obj.isGroup) {
    return obj;
  }
  
  // Find other participant and me
  const otherParticipant = obj.participants.find(p => p._id.toString() !== currentUserId.toString());
  
  // Check if other participant has shared their details
  const hasSharedWithMe = obj.sharedDetails && obj.sharedDetails.some(id => id.toString() === otherParticipant?._id.toString());
  
  obj.participants = obj.participants.map(p => {
    if (p._id.toString() === currentUserId.toString()) {
      return p; // Do not mask my own info
    }
    
    return {
      ...p,
      email: hasSharedWithMe ? p.email : maskEmail(p.email),
      phoneNumber: hasSharedWithMe ? p.phoneNumber : maskPhoneNumber(p.phoneNumber),
      detailsShared: hasSharedWithMe
    };
  });
  
  // Inject status flags for direct UI queries
  obj.iHaveShared = obj.sharedDetails && obj.sharedDetails.some(id => id.toString() === currentUserId.toString());
  obj.partnerHasShared = hasSharedWithMe;
  
  return obj;
};

// Get all conversations for the authenticated user
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name role profileImage phoneNumber email')
    .populate({
      path: 'groupId',
      populate: {
        path: 'classId',
        select: 'name'
      }
    })
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    const masked = conversations.map(c => maskConversationDetails(c, userId));
    res.json(masked);
  } catch (error) {
    next(error);
  }
};

// Get a single conversation details
exports.getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    })
    .populate('participants', 'name role profileImage phoneNumber email timezone')
    .populate({
      path: 'groupId',
      populate: {
        path: 'classId',
        select: 'name'
      }
    })
    .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found or access denied.' });
    }

    const masked = maskConversationDetails(conversation, userId);
    res.json(masked);
  } catch (error) {
    next(error);
  }
};

// Start or get direct conversation with another user
exports.startDirectConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.userId;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required.' });
    }

    if (senderId.toString() === recipientId.toString()) {
      return res.status(400).json({ error: 'Cannot start conversation with yourself.' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Check blocks
    const block = await BlockedUser.findOne({
      $or: [
        { userId: senderId, blockedUserId: recipientId },
        { userId: recipientId, blockedUserId: senderId }
      ]
    });

    if (block) {
      return res.status(403).json({ error: 'Cannot message this user. Conversation blocked.' });
    }

    // Look for existing direct conversation
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, recipientId], $size: 2 }
    });

    if (!conversation) {
      conversation = new Conversation({
        isGroup: false,
        participants: [senderId, recipientId]
      });
      await conversation.save();
    }

    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'name role profileImage phoneNumber email');

    const masked = maskConversationDetails(populated, senderId);
    res.status(200).json(masked);
  } catch (error) {
    next(error);
  }
};

// Consent to sharing contact details in conversation
exports.shareDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (conversation.sharedDetails.some(uid => uid.toString() === userId.toString())) {
      return res.status(400).json({ error: 'Contact details already shared.' });
    }

    conversation.sharedDetails.push(userId);
    await conversation.save();

    // Create system message
    const Message = require('../models/Message');
    const systemMsg = new Message({
      conversationId: conversation._id,
      senderId: null,
      messageType: 'system',
      text: `${req.user.name || 'User'} has shared their contact details.`
    });
    await systemMsg.save();

    conversation.lastMessage = systemMsg._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Socket.io updates
    const io = req.app.get('io');
    if (io) {
      conversation.participants.forEach(p => {
        io.to(`user_${p}`).emit('details_shared', {
          conversationId: conversation._id,
          userId,
          message: systemMsg
        });
      });
    }

    res.json({ message: 'Contact details shared successfully.', conversation });
  } catch (error) {
    next(error);
  }
};
