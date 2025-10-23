const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Note = require('../models/Note');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/notes
// @desc    Get all notes with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('subject').optional().isIn(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce', 'tarih', 'cografya', 'felsefe', 'edebiyat', 'diger']),
  query('grade').optional().isIn(['9', '10', '11', '12', 'mezun']),
  query('sort').optional().isIn(['newest', 'oldest', 'rating', 'downloads'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtreleme
    const filter = { isActive: true, isApproved: true };
    
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }
    
    if (req.query.grade) {
      filter.grade = req.query.grade;
    }

    // Sıralama
    let sort = { createdAt: -1 }; // Default: newest first
    
    switch (req.query.sort) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'rating':
        sort = { rating: -1, ratingCount: -1 };
        break;
      case 'downloads':
        sort = { downloads: -1 };
        break;
    }

    // Notları getir
    const notes = await Note.find(filter)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Toplam sayı
    const total = await Note.countDocuments(filter);

    res.json({
      success: true,
      data: {
        notes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'name avatar');

    if (!note || !note.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('subject').isIn(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce', 'tarih', 'cografya', 'felsefe', 'edebiyat', 'diger']).withMessage('Invalid subject'),
  body('grade').isIn(['9', '10', '11', '12', 'mezun']).withMessage('Invalid grade'),
  body('fileUrl').notEmpty().withMessage('File URL is required'),
  body('fileName').notEmpty().withMessage('File name is required'),
  body('fileSize').isInt({ min: 1 }).withMessage('File size must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, subject, grade, tags, fileUrl, fileName, fileSize } = req.body;

    const note = new Note({
      title,
      description,
      subject,
      grade,
      tags: tags || [],
      fileUrl,
      fileName,
      fileSize,
      author: req.user.userId
    });

    await note.save();
    await note.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('subject').optional().isIn(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce', 'tarih', 'cografya', 'felsefe', 'edebiyat', 'diger']).withMessage('Invalid subject'),
  body('grade').optional().isIn(['9', '10', '11', '12', 'mezun']).withMessage('Invalid grade')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    // Sadece not sahibi veya admin güncelleyebilir
    if (note.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this note'
      });
    }

    const updateData = { ...req.body };
    delete updateData.author; // Author değiştirilemez

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      success: true,
      data: { note: updatedNote }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    // Sadece not sahibi veya admin silebilir
    if (note.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this note'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/notes/:id/download
// @desc    Increment download count
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: { downloads: note.downloads }
    });
  } catch (error) {
    console.error('Download increment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
