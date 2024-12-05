const express = require('express');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const emailService = require('../services/email');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { templates } = req.body;
    
    // Verify templates and calculate total
    const templateDetails = await Promise.all(
      templates.map(async ({ templateId }) => {
        const template = await Template.findById(templateId);
        if (!template) {
          throw new Error(`Template ${templateId} not found`);
        }
        return {
          template: template._id,
          price: template.price,
          name: template.name
        };
      })
    );

    const totalAmount = templateDetails.reduce((sum, item) => sum + item.price, 0);

    // Create Stripe payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        templates: JSON.stringify(templateDetails.map(t => t.template.toString()))
      }
    });

    // Create order
    const order = new Order({
      user: req.user._id,
      templates: templateDetails,
      totalAmount,
      stripePaymentIntentId: paymentIntent.id
    });

    await order.save();

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      const order = await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { 
          paymentStatus: 'completed',
          paidAt: new Date()
        },
        { new: true }
      ).populate('user');

      if (order) {
        // Send confirmation email
        await emailService.sendOrderConfirmation(order.user, order);
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
    }
  }

  res.json({ received: true });
});

module.exports = router;