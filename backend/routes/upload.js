const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// @route   POST /api/upload
// @desc    Upload file
// @access  Private
router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Dosya URL'sini oluştur
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileUrl: fileUrl,
        fileSize: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed'
    });
  }
});

// @route   GET /api/upload/:filename
// @desc    Serve uploaded files
// @access  Public
router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', filename);

    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Dosyayı gönder
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      error: 'File serve failed'
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', filename);

    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Dosyayı sil
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      error: 'File delete failed'
    });
  }
});

module.exports = router;

