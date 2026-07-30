const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'cinebook_super_secret_key_12345';

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Please provide name, email, phoneNumber, and password.' });
    }

    // Check if user already exists (by email or phone)
    let userExists = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.trim().toLowerCase() },
          { phoneNumber: phoneNumber.trim() }
        ]
      }
    });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email or phone number already exists.' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const userRole = role === 'admin' ? 'admin' : 'customer';
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      passwordHash,
      role: userRole
    });

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Please provide email or phone number, and password.' });
    }

    // Find User by email or phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrPhone.trim().toLowerCase() },
          { phoneNumber: emailOrPhone.trim() }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid login credentials.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify uniqueness of new email or phone if changing
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ error: 'Email already in use.' });
      user.email = email;
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneExists = await User.findOne({ where: { phoneNumber } });
      if (phoneExists) return res.status(400).json({ error: 'Phone number already in use.' });
      user.phoneNumber = phoneNumber;
    }

    if (name) user.name = name;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};
