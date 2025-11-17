const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your secret key from .env

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    // Map products to Stripe line items
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name || 'Unnamed Product',
        },
        unit_amount: Math.round(product.price * 100), // convert to cents
      },
      quantity: product.quantity || 1,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: process.env.SUCCESS_URL || 'http://localhost:3002/success',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3002/cancel',
    });

    // Return session URL (new Stripe method)
    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error.message);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

module.exports = router;
