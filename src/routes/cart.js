const express = require('express');
const Cart = require('../models/Cart');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const { validateCart } = require('../validators/cartValidator');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.template');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', auth, validateCart, async (req, res) => {
  try {
    const { templateId, quantity } = req.body;
    const template = await Template.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.template.toString() === templateId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ template: templateId, quantity });
    }

    await cart.updateTotalAmount();
    await cart.populate('items.template');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/remove/:templateId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.template.toString() !== req.params.templateId
    );

    await cart.updateTotalAmount();
    await cart.populate('items.template');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:templateId', auth, validateCart, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.template.toString() === req.params.templateId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.updateTotalAmount();
    await cart.populate('items.template');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;