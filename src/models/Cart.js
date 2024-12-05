const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

cartSchema.methods.updateTotalAmount = async function() {
  const populatedCart = await this.populate('items.template');
  this.totalAmount = populatedCart.items.reduce((total, item) => {
    return total + (item.template.price * item.quantity);
  }, 0);
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);