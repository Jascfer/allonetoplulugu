const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  googleDriveUrl: {
    type: String,
    required: [true, 'Google Drive URL is required'],
    validate: {
      validator: function(v) {
        return /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view/.test(v);
      },
      message: 'Please provide a valid Google Drive URL'
    }
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better search performance
noteSchema.index({ category: 1 });
noteSchema.index({ title: 'text', description: 'text' });
noteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
