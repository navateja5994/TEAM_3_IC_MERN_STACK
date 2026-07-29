const jwt = require('jsonwebtoken');
const GroupMember = require('../models/GroupMember');

const JWT_SECRET = process.env.JWT_SECRET || 'smartnotify_super_secret_key_12345';

const onlineUsers = new Map(); // userId string -> Set of socket.id

const socketHandler = (io) => {
  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication error: Token is required.'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded; // { userId, role, organizationId }
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid or expired token.'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.userId;
    const userIdStr = userId.toString();
    console.log(`Socket client connected: ${userId} (Socket ID: ${socket.id})`);

    // Add to online users
    if (!onlineUsers.has(userIdStr)) {
      onlineUsers.set(userIdStr, new Set());
      // Broadcast online status to all
      io.emit('user_status', { userId: userIdStr, status: 'online' });
    }
    onlineUsers.get(userIdStr).add(socket.id);

    // 1. Join user individual room
    socket.join(`user_${userId}`);

    // 2. Query and join all active group/class chat rooms
    try {
      const groupMemberships = await GroupMember.find({ userId });
      groupMemberships.forEach(membership => {
        socket.join(`group_${membership.groupId}`);
        console.log(`Socket user ${userId} joined room: group_${membership.groupId}`);
      });
    } catch (error) {
      console.error(`Socket error fetching group memberships for ${userId}:`, error);
    }

    // Join a newly created group channel
    socket.on('join_group_room', (data) => {
      const { groupId } = data;
      if (groupId) {
        socket.join(`group_${groupId}`);
        console.log(`Socket user ${userId} manually joined room: group_${groupId}`);
      }
    });

    // Handle typing status indicators
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data;
      if (conversationId) {
        // Broadcast typing event to other users in individual channels or group rooms
        socket.broadcast.to(conversationId).emit('typing', {
          conversationId,
          userId,
          isTyping
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${userId} (Socket ID: ${socket.id})`);
      const sockets = onlineUsers.get(userIdStr);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userIdStr);
          // Broadcast offline status to all
          io.emit('user_status', { userId: userIdStr, status: 'offline' });
        }
      }
    });
  });
};

module.exports = {
  socketHandler,
  onlineUsers
};
