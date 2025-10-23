const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notes
// @desc    Get all notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, grade, page = 1, limit = 10 } = req.query;
    
    const query = { isApproved: true };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;

    const notes = await Note.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      data: {
        notes,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'name avatar');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Increment view count
    note.viewCount += 1;
    await note.save();

    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      author: req.userId
    });

    await note.save();
    await note.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/notes/:id/download
// @desc    Increment download count
// @access  Public
router.put('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.downloadCount += 1;
    await note.save();

    res.json({
      success: true,
      data: { downloadCount: note.downloadCount }
    });
  } catch (error) {
    console.error('Download count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
