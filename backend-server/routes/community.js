const express = require('express');
const { body, validationResult } = require('express-validator');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get all community posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { type, category, page = 1, limit = 10 } = req.query;
    
    let query = { isApproved: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    const posts = await CommunityPost.find(query)
      .populate('author', 'name avatar role points')
      .populate('likes', 'name')
      .populate('comments.author', 'name avatar')
      .populate('comments.likes', 'name')
      .populate('comments.replies.author', 'name avatar')
      .populate('comments.replies.likes', 'name')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CommunityPost.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts
// @desc    Create a new community post
// @access  Private
router.post('/posts', auth, [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 2000 }).withMessage('Content cannot be more than 2000 characters'),
  body('type').isIn(['discussion', 'question', 'achievement', 'resource']).withMessage('Invalid post type'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, content, type, category, tags } = req.body;
    
    const post = new CommunityPost({
      title,
      content,
      type,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      author: req.userId
    });
    
    await post.save();
    await post.populate('author', 'name avatar role');
    
    res.status(201).json({
      success: true,
      data: { post }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const likeIndex = post.likes.indexOf(req.userId);
    let isLiked = false;
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.userId);
      isLiked = true;
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: { 
        isLiked,
        likesCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/posts/:id/comment', auth, [
  body('content').notEmpty().withMessage('Comment content is required').isLength({ max: 500 }).withMessage('Comment cannot be more than 500 characters')
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
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = {
      author: req.userId,
      content: content.trim()
    };
    
    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'name avatar');
    
    const newComment = post.comments[post.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/comments/:commentId/like
// @desc    Like/unlike a comment
// @access  Private
router.post('/posts/:id/comments/:commentId/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const likeIndex = comment.likes.indexOf(req.userId);
    let isLiked = false;
    
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.userId);
      isLiked = true;
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: { 
        isLiked,
        likesCount: comment.likes.length
      }
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/comments/:commentId/reply
// @desc    Add reply to a comment
// @access  Private
router.post('/posts/:id/comments/:commentId/reply', auth, [
  body('content').notEmpty().withMessage('Reply content is required').isLength({ max: 500 }).withMessage('Reply cannot be more than 500 characters')
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
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const reply = {
      author: req.userId,
      content: content.trim()
    };
    
    comment.replies.push(reply);
    await post.save();
    await post.populate('comments.replies.author', 'name avatar');
    
    const newReply = comment.replies[comment.replies.length - 1];
    
    res.status(201).json({
      success: true,
      data: { reply: newReply }
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/poll
// @desc    Create or update poll on a post
// @access  Private
router.post('/posts/:id/poll', auth, [
  body('question').notEmpty().withMessage('Poll question is required').isLength({ max: 200 }).withMessage('Poll question cannot be more than 200 characters'),
  body('options').isArray({ min: 2, max: 10 }).withMessage('Poll must have between 2 and 10 options'),
  body('options.*.text').notEmpty().withMessage('Poll option text is required').isLength({ max: 100 }).withMessage('Poll option cannot be more than 100 characters'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiration date'),
  body('multipleChoice').optional().isBoolean().withMessage('Multiple choice must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { question, options, expiresAt, multipleChoice } = req.body;
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is post author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only post author can create polls' });
    }

    // Check if poll already exists
    if (post.poll && post.poll.question) {
      return res.status(400).json({ error: 'Poll already exists on this post' });
    }

    post.poll = {
      question: question.trim(),
      options: options.map((opt) => ({
        text: opt.text.trim(),
        votes: []
      })),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      multipleChoice: multipleChoice || false
    };

    await post.save();
    
    res.status(201).json({
      success: true,
      data: { poll: post.poll }
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/poll/vote
// @desc    Vote on a poll
// @access  Private
router.post('/posts/:id/poll/vote', auth, [
  body('optionIndex').isInt({ min: 0 }).withMessage('Valid option index is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { optionIndex } = req.body;
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.poll || !post.poll.question) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if poll has expired
    if (post.poll.expiresAt && new Date(post.poll.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Poll has expired' });
    }

    if (optionIndex < 0 || optionIndex >= post.poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }

    const option = post.poll.options[optionIndex];

    // Check if user already voted (if not multiple choice)
    if (!post.poll.multipleChoice) {
      const hasVoted = post.poll.options.some((opt) => opt.votes.includes(req.userId));
      if (hasVoted) {
        // Remove vote from all options
        post.poll.options.forEach((opt) => {
          const voteIndex = opt.votes.indexOf(req.userId);
          if (voteIndex > -1) {
            opt.votes.splice(voteIndex, 1);
          }
        });
      }
    }

    // Add vote to selected option (if not already voted)
    if (!option.votes.includes(req.userId)) {
      option.votes.push(req.userId);
    } else if (post.poll.multipleChoice) {
      // Remove vote if multiple choice and already voted
      const voteIndex = option.votes.indexOf(req.userId);
      if (voteIndex > -1) {
        option.votes.splice(voteIndex, 1);
      }
    }

    await post.save();
    
    res.json({
      success: true,
      data: { poll: post.poll }
    });
  } catch (error) {
    console.error('Vote poll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/community/posts/:id
// @desc    Update a post (Author only)
// @access  Private
router.put('/posts/:id', auth, [
  body('title').optional().isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('content').optional().isLength({ max: 2000 }).withMessage('Content cannot be more than 2000 characters'),
  body('type').optional().isIn(['discussion', 'question', 'achievement', 'resource']).withMessage('Invalid post type'),
  body('tags').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author or admin
    const user = await User.findById(req.userId);
    if (post.author.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { title, content, type, category, tags } = req.body;
    
    if (title) post.title = title;
    if (content) post.content = content;
    if (type) post.type = type;
    if (category) post.category = category;
    if (tags !== undefined) {
      post.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : [];
    }

    await post.save();
    await post.populate('author', 'name avatar role');

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete a post (Author or Admin only)
// @access  Private
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author or admin
    const user = await User.findById(req.userId);
    if (post.author.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/pin
// @desc    Pin/unpin a post (Admin only)
// @access  Private (Admin)
router.post('/posts/:id/pin', auth, adminAuth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      success: true,
      data: { 
        isPinned: post.isPinned
      }
    });
  } catch (error) {
    console.error('Pin post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/community/posts/:id/report
// @desc    Report a post
// @access  Private
router.post('/posts/:id/report', auth, [
  body('reason').notEmpty().withMessage('Report reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // In a real app, you'd save this to a reports collection
    // For now, we'll just log it
    console.log(`Post ${req.params.id} reported by user ${req.userId}. Reason: ${req.body.reason}`);

    res.json({
      success: true,
      message: 'Post reported successfully. Our team will review it.'
    });
  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
