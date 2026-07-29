const Class = require('../models/Class');
const ClassMember = require('../models/ClassMember');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create a Class and its associated Group
exports.createClass = async (req, res, next) => {
  try {
    const { name, departmentId, year, section } = req.body;
    const orgId = req.user.organizationId;
    const creatorId = req.user.userId;

    if (!name || !departmentId || !year || !section) {
      return res.status(400).json({ error: 'Name, departmentId, year, and section are required.' });
    }

    // Create Class
    const classObj = new Class({
      organizationId: orgId,
      name,
      department: departmentId,
      year: parseInt(year, 10),
      section
    });
    await classObj.save();

    // Automatically create the associated class Group
    const group = new Group({
      organizationId: orgId,
      name: classObj.name,
      description: `Official group for ${classObj.name}`,
      owner: creatorId,
      isClassGroup: true,
      classId: classObj._id
    });
    await group.save();

    // Create GroupMember for creator (owner/admin)
    const creatorMember = new GroupMember({
      groupId: group._id,
      userId: creatorId,
      role: 'owner'
    });
    await creatorMember.save();

    // Create Conversation for the group
    const conversation = new Conversation({
      isGroup: true,
      groupId: group._id,
      participants: [creatorId]
    });
    await conversation.save();

    res.status(201).json({
      message: 'Class and official group created successfully.',
      class: classObj,
      group
    });
  } catch (error) {
    next(error);
  }
};

// Get all classes in organization
exports.getClasses = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const classes = await Class.find({ organizationId: orgId })
      .populate('department', 'name code');
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

// Get classes the authenticated user is enrolled in
exports.getMyClasses = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const memberships = await ClassMember.find({ userId });
    const classIds = memberships.map(m => m.classId);

    const classes = await Class.find({ _id: { $in: classIds } })
      .populate('department', 'name code');

    const result = classes.map(c => {
      const membership = memberships.find(m => m.classId.toString() === c._id.toString());
      return {
        ...c.toObject(),
        role: membership ? membership.role : 'student'
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Enroll a user (student/teacher) into a class (Auto-syncs group & conversation)
exports.enrollClassMember = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { userId, role } = req.body; // role: 'student' | 'teacher'

    if (!userId || !role) {
      return res.status(400).json({ error: 'User ID and Role are required.' });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Add to ClassMember
    let classMember = await ClassMember.findOne({ classId, userId });
    if (!classMember) {
      classMember = new ClassMember({
        classId,
        userId,
        role
      });
      await classMember.save();
    }

    // Sync to GroupMember
    const classGroup = await Group.findOne({ classId, isClassGroup: true });
    if (classGroup) {
      let groupMember = await GroupMember.findOne({ groupId: classGroup._id, userId });
      if (!groupMember) {
        groupMember = new GroupMember({
          groupId: classGroup._id,
          userId,
          role: role === 'teacher' ? 'admin' : 'member' // Teachers become admins of class group
        });
        await groupMember.save();
      }

      // Sync to Conversation participants
      const conversation = await Conversation.findOne({ isGroup: true, groupId: classGroup._id });
      if (conversation) {
        if (!conversation.participants.some(p => p.toString() === userId.toString())) {
          conversation.participants.push(userId);
          await conversation.save();
        }
      }
    }

    res.json({ message: `Successfully enrolled user in class and synced group membership.`, classMember });
  } catch (error) {
    next(error);
  }
};

// Remove a user from a class (Auto-syncs group removal)
exports.removeClassMember = async (req, res, next) => {
  try {
    const { classId, userId } = req.params;

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    // Remove from ClassMember
    await ClassMember.deleteOne({ classId, userId });

    // Sync removal from GroupMember and Conversation
    const classGroup = await Group.findOne({ classId, isClassGroup: true });
    if (classGroup) {
      await GroupMember.deleteOne({ groupId: classGroup._id, userId });
      
      const conversation = await Conversation.findOne({ isGroup: true, groupId: classGroup._id });
      if (conversation) {
        conversation.participants = conversation.participants.filter(p => p.toString() !== userId.toString());
        await conversation.save();
      }
    }

    res.json({ message: 'Successfully removed user from class and synced group membership.' });
  } catch (error) {
    next(error);
  }
};

// Get members of a class
exports.getClassMembers = async (req, res, next) => {
  try {
    const { classId } = req.params;

    const members = await ClassMember.find({ classId })
      .populate('userId', 'name role profileImage phoneNumber email');

    res.json(members);
  } catch (error) {
    next(error);
  }
};
