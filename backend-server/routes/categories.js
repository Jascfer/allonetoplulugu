const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, grade } = req.query;
    
    let query = { isActive: true };
    
    if (subject) {
      query.subject = subject;
    }
    
    if (grade) {
      query.grade = grade;
    }
    
    const categories = await Category.find(query)
      .populate('createdBy', 'name')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category (Admin only)
// @access  Private/Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, subject, grade } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      subject,
      grade
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Bu kategori zaten mevcut'
      });
    }
    
    const category = new Category({
      name,
      description,
      subject,
      grade,
      createdBy: req.userId
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (Admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, subject, grade, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Kategori bulunamadı'
      });
    }
    
    category.name = name || category.name;
    category.description = description || category.description;
    category.subject = subject || category.subject;
    category.grade = grade || category.grade;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    
    await category.save();
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Kategori bulunamadı'
      });
    }
    
    // Soft delete - just deactivate
    category.isActive = false;
    await category.save();
    
    res.json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

