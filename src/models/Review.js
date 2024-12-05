const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

reviewSchema.index({ user: 1, template: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function(templateId) {
  const result = await this.aggregate([
    { $match: { template: templateId } },
    {
      $group: {
        _id: '$template',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await mongoose.model('Template').findByIdAndUpdate(templateId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      numberOfReviews: result[0].numberOfReviews
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.template);
});

module.exports = mongoose.model('Review', reviewSchema);