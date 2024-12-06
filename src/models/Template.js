const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['nextjs', 'reactjs', 'vuejs', 'angular', 'other'],
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  downloadUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  features: [String],
  tags: {
    type: [String],
    index: true
  },
  type: {
    type: String,
    enum: ['free', 'paid'],
    required: true,
    default: 'paid',
    index: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  compatibility: {
    frameworks: [String],
    browsers: [String],
    nodeVersion: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  downloads: {
    type: Number,
    default: 0,
    index: true
  },
  averageRating: {
    type: Number,
    default: 0,
    index: true
  },
  numberOfReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
templateSchema.index({ category: 1, price: 1 });
templateSchema.index({ type: 1, price: 1 });
templateSchema.index({ isActive: 1, lastUpdated: -1 });
templateSchema.index({ 
  name: 'text', 
  description: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    tags: 5,
    description: 1
  }
});

templateSchema.plugin(mongoosePaginate);

templateSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'template'
});

// Add query helpers
templateSchema.query.byCategory = function(category) {
  return this.where({ category });
};

templateSchema.query.byPriceRange = function(min, max) {
  return this.where('price').gte(min).lte(max);
};

templateSchema.query.active = function() {
  return this.where({ isActive: true });
};

templateSchema.query.withBasicInfo = function() {
  return this.select('name category price thumbnailUrl type averageRating');
};

module.exports = mongoose.model('Template', templateSchema);