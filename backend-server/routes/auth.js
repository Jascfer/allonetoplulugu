const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          department: user.department,
          year: user.year,
          studentNumber: user.studentNumber,
          graduationYear: user.graduationYear,
          biography: user.biography,
          interests: user.interests,
          privacy: user.privacy,
          badges: user.badges,
          level: user.level,
          points: user.points
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('biography').optional().isLength({ max: 500 }).withMessage('Biography cannot be more than 500 characters'),
  body('department').optional().isLength({ max: 100 }).withMessage('Department cannot be more than 100 characters'),
  body('year').optional().isIn(['1', '2', '3', '4', '5', '6', 'Yüksek Lisans', 'Doktora', 'Mezun']).withMessage('Invalid year'),
  body('studentNumber').optional().isLength({ max: 50 }).withMessage('Student number cannot be more than 50 characters'),
  body('graduationYear').optional().trim(),
  body('interests').optional().isArray().withMessage('Interests must be an array'),
  body('privacy.profileVisibility').optional().isIn(['public', 'friends', 'private']).withMessage('Invalid profile visibility'),
  body('privacy.emailVisibility').optional().isBoolean().withMessage('Email visibility must be a boolean'),
  body('privacy.showActivity').optional().isBoolean().withMessage('Show activity must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { 
      name, 
      email, 
      avatar, 
      department, 
      year, 
      studentNumber, 
      graduationYear, 
      biography, 
      interests,
      privacy 
    } = req.body;
    
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    if (studentNumber !== undefined) user.studentNumber = studentNumber;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (biography !== undefined) user.biography = biography;
    if (interests !== undefined) user.interests = Array.isArray(interests) ? interests : [];
    
    // Update privacy settings
    if (privacy) {
      if (privacy.profileVisibility) user.privacy.profileVisibility = privacy.profileVisibility;
      if (privacy.emailVisibility !== undefined) user.privacy.emailVisibility = privacy.emailVisibility;
      if (privacy.showActivity !== undefined) user.privacy.showActivity = privacy.showActivity;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          department: user.department,
          year: user.year,
          studentNumber: user.studentNumber,
          graduationYear: user.graduationYear,
          biography: user.biography,
          interests: user.interests,
          privacy: user.privacy,
          badges: user.badges,
          level: user.level,
          points: user.points
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user avatar with file path or URL
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const Note = require('../models/Note');
    const CommunityPost = require('../models/CommunityPost');
    const DailyQuestion = require('../models/DailyQuestion');
    
    const userId = req.userId;
    
    // Get user's notes count
    const notesCount = await Note.countDocuments({ author: userId });
    
    // Get total downloads from user's notes
    const userNotes = await Note.find({ author: userId }).select('downloadCount');
    const totalDownloads = userNotes.reduce((sum, note) => sum + note.downloadCount, 0);
    
    // Get user's community posts count
    const postsCount = await CommunityPost.countDocuments({ author: userId });
    
    // Get user's answers count
    const answersCount = await DailyQuestion.countDocuments({ 
      'answers.author': userId 
    });
    
    // Get user's total likes received
    const userNotesWithLikes = await Note.find({ author: userId }).select('ratingCount');
    const totalLikes = userNotesWithLikes.reduce((sum, note) => sum + note.ratingCount, 0);
    
    // Get user's community posts likes
    const userPosts = await CommunityPost.find({ author: userId }).select('likes');
    const communityLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
    
    // Get user's answers likes
    const userAnswers = await DailyQuestion.find({ 
      'answers.author': userId 
    }).select('answers');
    
    let answerLikes = 0;
    userAnswers.forEach(question => {
      question.answers.forEach(answer => {
        if (answer.author.toString() === userId) {
          answerLikes += answer.likes.length;
        }
      });
    });
    
    const totalLikesReceived = totalLikes + communityLikes + answerLikes;
    
    res.json({
      success: true,
      data: {
        notesCount,
        totalDownloads,
        postsCount,
        answersCount,
        totalLikesReceived,
        communityLikes,
        answerLikes,
        noteLikes: totalLikes
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Security: Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // In production, send email here
    // For now, return the token (remove in production!)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;
    
    console.log('Password reset URL:', resetUrl); // Remove in production!

    res.json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token, email, password } = req.body;

    // Get hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/auth/sessions
// @desc    Get user active sessions
// @access  Private
router.get('/sessions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user.activeSessions || []
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/auth/sessions/:sessionId
// @desc    Delete a session
// @access  Private
router.delete('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.activeSessions = user.activeSessions.filter(
      session => session._id.toString() !== req.params.sessionId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.activeSessions = [];
    await user.save();

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

