const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/notes
// @desc    Get all notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, subject, semester, year, search, sortBy, page = 1, limit = 10 } = req.query;
    
    let query = { isApproved: true };
    
    if (category) {
      query.category = category;
    }
    
    if (subject) {
      query.subject = subject;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (year) {
      query.year = year;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'popular') {
      sortOptions = { downloadCount: -1, viewCount: -1 };
    } else if (sortBy === 'top') {
      sortOptions = { rating: -1 };
    }
    
    const notes = await Note.find(query)
      .populate('category', 'name description color icon')
      .populate('author', 'name avatar')
      .sort(sortOptions)
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
      .populate('category', 'name subject grade')
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
// @desc    Create new note (Admin only)
// @access  Private/Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { title, description, category, googleDriveLink, downloadUrl, tags, subject, semester, year } = req.body;
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz kategori'
      });
    }
    
    const note = new Note({
      title,
      description,
      category,
      googleDriveLink: downloadUrl || googleDriveLink,
      downloadUrl: downloadUrl || googleDriveLink,
      subject,
      semester,
      year,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.userId,
      isApproved: true // Admin notes are auto-approved
    });
    
    await note.save();
    
    // Populate the response
    await note.populate('category', 'name description color icon');
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

// @route   PUT /api/notes/:id
// @desc    Update note (Admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { title, description, category, googleDriveUrl, tags, isApproved } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not bulunamadı'
      });
    }
    
    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz kategori'
        });
      }
    }
    
    // Validate Google Drive URL if provided
    if (googleDriveUrl) {
      const driveUrlRegex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view/;
      if (!driveUrlRegex.test(googleDriveUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz Google Drive URL'
        });
      }
    }
    
    note.title = title || note.title;
    note.description = description || note.description;
    note.category = category || note.category;
    note.googleDriveUrl = googleDriveUrl || note.googleDriveUrl;
    note.tags = tags || note.tags;
    note.isApproved = isApproved !== undefined ? isApproved : note.isApproved;
    
    await note.save();
    
    // Populate the response
    await note.populate('category', 'name description color icon');
    await note.populate('author', 'name avatar');
    
    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not bulunamadı'
      });
    }
    
    await Note.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Not başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete note error:', error);
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
      data: { 
        downloadCount: note.downloadCount,
        googleDriveUrl: note.googleDriveUrl
      }
    });
  } catch (error) {
    console.error('Download count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;