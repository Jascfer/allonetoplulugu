const mongoose = require('mongoose');

const dailyQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot be more than 500 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty is required']
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [10, 'Points must be at least 10'],
    max: [100, 'Points cannot be more than 100']
  },
  answers: [{
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Answer cannot be more than 1000 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isAccepted: {
      type: Boolean,
      default: false
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
dailyQuestionSchema.index({ date: -1 });
dailyQuestionSchema.index({ category: 1 });
dailyQuestionSchema.index({ difficulty: 1 });
dailyQuestionSchema.index({ isActive: 1 });

module.exports = mongoose.model('DailyQuestion', dailyQuestionSchema);
