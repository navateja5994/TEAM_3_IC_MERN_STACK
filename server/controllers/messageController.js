const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const MessageReceipt = require('../models/MessageReceipt');
const MessageAcknowledgement = require('../models/MessageAcknowledgement');
const BlockedUser = require('../models/BlockedUser');
const GroupMember = require('../models/GroupMember');

// Send message NOW
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text, messageType, mediaUrl, voiceDuration, requireAcknowledgement } = req.body;
    const senderId = req.user.userId;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required.' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    // Verify participant
    if (!conversation.participants.some(p => p.toString() === senderId.toString())) {
      return res.status(403).json({ error: 'Not a member of this conversation.' });
    }

    // If direct message, verify block list
    if (!conversation.isGroup) {
      const recipientId = conversation.participants.find(p => p.toString() !== senderId.toString());
      if (recipientId) {
        const block = await BlockedUser.findOne({
          $or: [
            { userId: senderId, blockedUserId: recipientId },
            { userId: recipientId, blockedUserId: senderId }
          ]
        });
        if (block) {
          return res.status(403).json({ error: 'Cannot send message. Messaging is blocked.' });
        }
      }
    }

    // Create Message
    const message = new Message({
      conversationId,
      senderId,
      messageType: messageType || 'text',
      text: text || '',
      mediaUrl: mediaUrl || '',
      voiceDuration: voiceDuration || 0,
      requireAcknowledgement: requireAcknowledgement || false
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Create MessageReceipts for all participants except sender
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

    // Retrieve full sender details for real-time dispatch
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name role profileImage');

    // Socket.io Real-time dispatch
    const io = req.app.get('io');
    if (io) {
      if (conversation.isGroup) {
        // Emit to the group room
        io.to(`group_${conversation.groupId}`).emit('new_message', {
          conversationId,
          message: populatedMessage
        });
      } else {
        // Emit to participant individual rooms
        conversation.participants.forEach(p => {
          io.to(`user_${p}`).emit('new_message', {
            conversationId,
            message: populatedMessage
          });
        });
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

// Retrieve message history for conversation (and mark messages as read)
exports.getMessagesByConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found or access denied.' });
    }

    // Get messages (limit to 100 recent)
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name role profileImage')
      .sort({ createdAt: 1 })
      .limit(100);

    // Retrieve existing acknowledgements for these messages
    const messageIds = messages.map(m => m._id);
    const acknowledgements = await MessageAcknowledgement.find({
      messageId: { $in: messageIds }
    });

    // Retrieve receipts for these messages
    const receipts = await MessageReceipt.find({
      messageId: { $in: messageIds }
    });

    // Mark other's messages in this conversation as READ for this user
    const otherMessages = messages.filter(m => m.senderId && m.senderId._id.toString() !== userId.toString());
    const unreadMessageIds = [];

    for (let msg of otherMessages) {
      const userReceipt = receipts.find(r => r.messageId.toString() === msg._id.toString() && r.userId.toString() === userId.toString());
      if (!userReceipt || userReceipt.status !== 'read') {
        unreadMessageIds.push(msg._id);
      }
    }

    if (unreadMessageIds.length > 0) {
      // Perform atomic bulk write or update
      await MessageReceipt.updateMany(
        { messageId: { $in: unreadMessageIds }, userId },
        { $set: { status: 'read', readAt: new Date() } },
        { upsert: true }
      );

      // Trigger read receipt update events via socket
      const io = req.app.get('io');
      if (io) {
        if (conversation.isGroup) {
          io.to(`group_${conversation.groupId}`).emit('messages_read', {
            conversationId,
            userId,
            messageIds: unreadMessageIds
          });
        } else {
          conversation.participants.forEach(p => {
            io.to(`user_${p}`).emit('messages_read', {
              conversationId,
              userId,
              messageIds: unreadMessageIds
            });
          });
        }
      }
    }

    res.json({
      messages,
      receipts,
      acknowledgements: acknowledgements.map(a => ({
        messageId: a.messageId,
        userId: a.userId,
        acknowledgedAt: a.acknowledgedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Acknowledge an important message
exports.acknowledgeMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    if (!message.requireAcknowledgement) {
      return res.status(400).json({ error: 'This message does not require acknowledgement.' });
    }

    // Verify user is in conversation
    const conversation = await Conversation.findOne({
      _id: message.conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Access denied. You are not a participant.' });
    }

    // Record acknowledgement
    let ack = await MessageAcknowledgement.findOne({ messageId, userId });
    if (!ack) {
      ack = new MessageAcknowledgement({ messageId, userId });
      await ack.save();

      // Notify other participants in real-time
      const io = req.app.get('io');
      if (io) {
        if (conversation.isGroup) {
          io.to(`group_${conversation.groupId}`).emit('message_acknowledged', {
            messageId,
            userId,
            acknowledgedAt: ack.acknowledgedAt
          });
        } else {
          conversation.participants.forEach(p => {
            io.to(`user_${p}`).emit('message_acknowledged', {
              messageId,
              userId,
              acknowledgedAt: ack.acknowledgedAt
            });
          });
        }
      }
    }

    res.json({ message: 'Acknowledgement recorded successfully.', acknowledgement: ack });
  } catch (error) {
    next(error);
  }
};

// Get acknowledgment status stats for a message
exports.getAcknowledgementStats = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // Ensure sender is requesting it
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the sender can request acknowledgement statistics.' });
    }

    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation context not found.' });
    }

    // Get count of acknowledgments
    const acks = await MessageAcknowledgement.find({ messageId }).populate('userId', 'name profileImage');
    
    // Total eligible recipients (excluding sender)
    const recipientCount = conversation.participants.filter(p => p.toString() !== userId.toString()).length;

    res.json({
      messageId,
      totalRecipients: recipientCount,
      acknowledgedCount: acks.length,
      acknowledgedUsers: acks.map(a => ({
        userId: a.userId._id,
        name: a.userId.name,
        profileImage: a.userId.profileImage,
        acknowledgedAt: a.acknowledgedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};
