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
    
    console.log('Creating note with data:', { title, description, category, subject, semester, year });
    
    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Başlık, açıklama ve kategori gereklidir'
      });
    }
    
    // Validate download URL
    if (!downloadUrl && !googleDriveLink) {
      return res.status(400).json({
        success: false,
        error: 'İndirme linki gereklidir'
      });
    }
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.error('Category not found:', category);
      return res.status(400).json({
        success: false,
        error: 'Geçersiz kategori ID'
      });
    }
    
    // Handle tags - could be string or array
    let tagsArray = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagsArray = tags.map(tag => typeof tag === 'string' ? tag.trim() : String(tag).trim()).filter(tag => tag);
      } else if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    const note = new Note({
      title,
      description,
      category,
      googleDriveLink: downloadUrl || googleDriveLink,
      downloadUrl: downloadUrl || googleDriveLink,
      subject: subject || '',
      semester: semester || '',
      year: year || '',
      tags: tagsArray,
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
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

// @route   POST /api/notes/:id/rate
// @desc    Rate a note
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Check if user already rated
    const existingRating = note.ratings.find(r => r.user.toString() === req.userId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      note.ratings.push({
        user: req.userId,
        rating: rating
      });
    }
    
    // Calculate average rating
    const totalRating = note.ratings.reduce((sum, r) => sum + r.rating, 0);
    note.rating = totalRating / note.ratings.length;
    note.ratingCount = note.ratings.length;
    
    await note.save();
    
    res.json({
      success: true,
      data: {
        rating: note.rating,
        ratingCount: note.ratingCount
      }
    });
  } catch (error) {
    console.error('Rate note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/notes/:id/comment
// @desc    Add comment to note
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const comment = {
      user: req.userId,
      content: content.trim()
    };
    
    note.comments.push(comment);
    await note.save();
    
    // Populate the comment with user info
    await note.populate('comments.user', 'name avatar');
    
    const newComment = note.comments[note.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/notes/:id/favorite
// @desc    Toggle favorite status
// @access  Private
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const favoriteIndex = note.favorites.indexOf(req.userId);
    let isFavorited = false;
    
    if (favoriteIndex > -1) {
      note.favorites.splice(favoriteIndex, 1);
    } else {
      note.favorites.push(req.userId);
      isFavorited = true;
    }
    
    await note.save();
    
    res.json({
      success: true,
      data: { isFavorited }
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;