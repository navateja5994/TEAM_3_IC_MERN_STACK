const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create Group
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, groupImage, members } = req.body;
    const ownerId = req.user.userId;
    const orgId = req.user.organizationId;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required.' });
    }

    const group = new Group({
      organizationId: orgId,
      name,
      description: description || '',
      groupImage: groupImage || '',
      owner: ownerId
    });

    await group.save();

    // Create GroupMember for owner
    const ownerMember = new GroupMember({
      groupId: group._id,
      userId: ownerId,
      role: 'owner'
    });
    await ownerMember.save();

    // Collect all unique participant IDs
    const participants = [ownerId];

    // Add additional members
    if (members && Array.isArray(members)) {
      const uniqueMembers = [...new Set(members)].filter(m => m !== ownerId);
      
      const memberRecords = uniqueMembers.map(userId => ({
        groupId: group._id,
        userId,
        role: 'member'
      }));

      if (memberRecords.length > 0) {
        await GroupMember.insertMany(memberRecords);
        participants.push(...uniqueMembers);
      }
    }

    // Create Conversation context for this group
    const conversation = new Conversation({
      isGroup: true,
      groupId: group._id,
      participants
    });
    await conversation.save();

    res.status(201).json({
      group,
      conversationId: conversation._id
    });
  } catch (error) {
    next(error);
  }
};

// Get all groups for the authenticated user
exports.getGroups = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Find memberships
    const memberships = await GroupMember.find({ userId });
    const groupIds = memberships.map(m => m.groupId);

    const groups = await Group.find({ _id: { $in: groupIds } })
      .populate('owner', 'name profileImage')
      .populate('classId', 'name');

    // Attach membership role to groups
    const result = groups.map(group => {
      const membership = memberships.find(m => m.groupId.toString() === group._id.toString());
      return {
        ...group.toObject(),
        role: membership ? membership.role : 'member'
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get group detail, including members list
exports.getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate user is a member
    const membership = await GroupMember.findOne({ groupId: id, userId });
    if (!membership) {
      return res.status(403).json({ error: 'Access denied. You are not a member of this group.' });
    }

    const group = await Group.findById(id)
      .populate('owner', 'name profileImage')
      .populate('classId', 'name');

    const members = await GroupMember.find({ groupId: id })
      .populate('userId', 'name role profileImage phoneNumber');

    res.json({
      group,
      myRole: membership.role,
      members
    });
  } catch (error) {
    next(error);
  }
};

// Add members to group
exports.addMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;
    const senderId = req.user.userId;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required.' });
    }

    // Check sender authorization
    const senderMembership = await GroupMember.findOne({ groupId: id, userId: senderId });
    if (!senderMembership || !['owner', 'admin'].includes(senderMembership.role)) {
      return res.status(403).json({ error: 'Access denied. Only group owners or administrators can add members.' });
    }

    // Fetch existing memberships to avoid duplicates
    const existing = await GroupMember.find({ groupId: id, userId: { $in: userIds } });
    const existingUserIds = existing.map(e => e.userId.toString());
    const newMembers = userIds.filter(uid => !existingUserIds.includes(uid.toString()));

    if (newMembers.length > 0) {
      const records = newMembers.map(userId => ({
        groupId: id,
        userId,
        role: 'member'
      }));

      await GroupMember.insertMany(records);

      // Update Conversation participants
      const conversation = await Conversation.findOne({ isGroup: true, groupId: id });
      if (conversation) {
        newMembers.forEach(uid => {
          if (!conversation.participants.some(p => p.toString() === uid.toString())) {
            conversation.participants.push(uid);
          }
        });
        await conversation.save();
      }
    }

    res.json({ message: `${newMembers.length} member(s) added successfully.` });
  } catch (error) {
    next(error);
  }
};

// Remove member from group
exports.removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const senderId = req.user.userId;

    // Check sender authorization
    const senderMembership = await GroupMember.findOne({ groupId: id, userId: senderId });
    if (!senderMembership || !['owner', 'admin'].includes(senderMembership.role)) {
      return res.status(403).json({ error: 'Access denied. Only owners/admins can remove members.' });
    }

    // Cannot remove owner
    const targetMembership = await GroupMember.findOne({ groupId: id, userId });
    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found in group.' });
    }
    
    if (targetMembership.role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove the group owner.' });
    }

    await GroupMember.deleteOne({ _id: targetMembership._id });

    // Update Conversation participants
    const conversation = await Conversation.findOne({ isGroup: true, groupId: id });
    if (conversation) {
      conversation.participants = conversation.participants.filter(p => p.toString() !== userId.toString());
      await conversation.save();
    }

    res.json({ message: 'Member removed successfully.' });
  } catch (error) {
    next(error);
  }
};
