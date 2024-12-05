const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['nextjs', 'reactjs', 'vuejs', 'angular', 'other']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  downloadUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  features: [String],
  tags: [String],
  type: {
    type: String,
    enum: ['free', 'paid'],
    required: true,
    default: 'paid'
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
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numberOfReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

templateSchema.plugin(mongoosePaginate);

templateSchema.index({ 
  name: 'text', 
  description: 'text',
  tags: 'text'
});

templateSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'template'
});

module.exports = mongoose.model('Template', templateSchema);