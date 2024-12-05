const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const { validateReview } = require('../validators/reviewValidator');
const router = express.Router();

router.post('/:templateId', auth, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const templateId = req.params.templateId;

    const existingReview = await Review.findOne({
      user: req.user._id,
      template: templateId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this template' });
    }

    const review = new Review({
      user: req.user._id,
      template: templateId,
      rating,
      comment
    });

    await review.save();
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/template/:templateId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ template: req.params.templateId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ template: req.params.templateId });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:reviewId', auth, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    await review.populate('user', 'name');

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;