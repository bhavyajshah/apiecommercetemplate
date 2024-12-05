const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const cache = require('../middleware/cache');
const { validateTemplate } = require('../validators/templateValidator');
const { apiLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Get template details with reviews and author info
router.get('/:id', cache(3600), async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      })
      .lean();
      
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Increment view count (don't await to avoid delay)
    Template.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download template (requires authentication and purchase verification)
router.get('/:id/download', auth, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Check if template is free or user has purchased it
    if (template.type === 'paid') {
      const hasPurchased = await Order.findOne({
        user: req.user._id,
        'templates.template': template._id,
        paymentStatus: 'completed'
      });

      if (!hasPurchased) {
        return res.status(403).json({ error: 'Purchase required to download this template' });
      }
    }

    // Increment download count
    await Template.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    res.json({ downloadUrl: template.downloadUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Other existing routes remain the same...

module.exports = router;