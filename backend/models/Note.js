const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  subject: {
    type: String,
    required: true,
    enum: ['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce', 'tarih', 'cografya', 'felsefe', 'edebiyat', 'diger']
  },
  grade: {
    type: String,
    required: true,
    enum: ['9', '10', '11', '12', 'mezun']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
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
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// İndeksler
noteSchema.index({ subject: 1, grade: 1 });
noteSchema.index({ author: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ rating: -1 });
noteSchema.index({ downloads: -1 });

// Sanal alanlar
noteSchema.virtual('averageRating').get(function() {
  return this.ratingCount > 0 ? (this.rating / this.ratingCount).toFixed(1) : 0;
});

// JSON'a dönüştürürken sanal alanları dahil et
noteSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Note', noteSchema);
