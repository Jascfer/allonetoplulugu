const express = require('express');
const { body, validationResult } = require('express-validator');
const DailyQuestion = require('../models/DailyQuestion');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/daily-questions
// @desc    Get daily questions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    const questions = await DailyQuestion.find(query)
      .populate('answers.author', 'name avatar')
      .populate('answers.likes', 'name')
      .populate('likes', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await DailyQuestion.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        questions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get daily questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/daily-questions/today
// @desc    Get today's question
// @access  Public
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const question = await DailyQuestion.findOne({
      isActive: true,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('answers.author', 'name avatar')
    .populate('answers.likes', 'name')
    .populate('likes', 'name');
    
    if (!question) {
      return res.status(404).json({ error: 'No question available for today' });
    }
    
    res.json({
      success: true,
      data: { question }
    });
  } catch (error) {
    console.error('Get today question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/daily-questions
// @desc    Create a new daily question (Admin only)
// @access  Private (Admin)
router.post('/', auth, [
  body('question').notEmpty().withMessage('Question is required').isLength({ max: 500 }).withMessage('Question cannot be more than 500 characters'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 1000 }).withMessage('Description cannot be more than 1000 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('points').isInt({ min: 10, max: 100 }).withMessage('Points must be between 10 and 100')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin required.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { question, description, category, difficulty, points } = req.body;
    
    const dailyQuestion = new DailyQuestion({
      question,
      description,
      category,
      difficulty,
      points
    });
    
    await dailyQuestion.save();
    
    res.status(201).json({
      success: true,
      data: { question: dailyQuestion }
    });
  } catch (error) {
    console.error('Create daily question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/daily-questions/:id/answer
// @desc    Submit an answer to a daily question
// @access  Private
router.post('/:id/answer', auth, [
  body('content').notEmpty().withMessage('Answer content is required').isLength({ max: 1000 }).withMessage('Answer cannot be more than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { content } = req.body;
    
    const question = await DailyQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const answer = {
      content: content.trim(),
      author: req.userId
    };
    
    question.answers.push(answer);
    await question.save();
    await question.populate('answers.author', 'name avatar');
    
    const newAnswer = question.answers[question.answers.length - 1];
    
    res.status(201).json({
      success: true,
      data: { answer: newAnswer }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/daily-questions/:id/like
// @desc    Like/unlike a daily question
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const question = await DailyQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const likeIndex = question.likes.indexOf(req.userId);
    let isLiked = false;
    
    if (likeIndex > -1) {
      question.likes.splice(likeIndex, 1);
    } else {
      question.likes.push(req.userId);
      isLiked = true;
    }
    
    await question.save();
    
    res.json({
      success: true,
      data: { 
        isLiked,
        likesCount: question.likes.length
      }
    });
  } catch (error) {
    console.error('Like question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/daily-questions/:id/answers/:answerId/like
// @desc    Like/unlike an answer
// @access  Private
router.post('/:id/answers/:answerId/like', auth, async (req, res) => {
  try {
    const question = await DailyQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    const likeIndex = answer.likes.indexOf(req.userId);
    let isLiked = false;
    
    if (likeIndex > -1) {
      answer.likes.splice(likeIndex, 1);
    } else {
      answer.likes.push(req.userId);
      isLiked = true;
    }
    
    await question.save();
    
    res.json({
      success: true,
      data: { 
        isLiked,
        likesCount: answer.likes.length
      }
    });
  } catch (error) {
    console.error('Like answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/daily-questions/:id/answers/:answerId/accept
// @desc    Accept an answer (Admin only)
// @access  Private (Admin)
router.put('/:id/answers/:answerId/accept', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin required.' });
    }

    const question = await DailyQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    // Unaccept all other answers first
    question.answers.forEach(ans => {
      ans.isAccepted = false;
    });
    
    // Accept the selected answer
    answer.isAccepted = true;
    
    await question.save();
    
    res.json({
      success: true,
      data: { answer }
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
