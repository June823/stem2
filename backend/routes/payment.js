const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const authToken = require('../../middleware/authToken'); // ✅ Add your middleware

// ✅ Add 'authToken' to protect this route
router.post('/create-checkout-session', authToken, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        message: 'Your cart is empty', 
        success: false 
      });
    }

    // Map products to Stripe line items
    const lineItems = products.map(item => {
        // 🔥 FIX: Match the actual database field 'productName' from your data
        const name = item.productId?.productName || item.productName || 'Product';
        
        // 🔥 FIX: Ensure price is a valid number
        const price = Number(item.productId?.price || item.price);

        return {
            price_data: {
                currency: 'kes', // Changed to KES to match your 'KES' display
                product_data: {
                    name: name,
                    // Optional: Add images to Stripe checkout page
                    images: item.productId?.productImage ? [item.productId.productImage[0]] : []
                },
                unit_amount: Math.round(price * 100), 
            },
            quantity: item.quantity || 1,
        };
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      // Pass the user ID to help you track orders in the dashboard
      client_reference_id: req.userId, 
      success_url: `https://stem2-12.onrender.com/success`,
      cancel_url: `https://stem2-12.onrender.com/cart`,
    });

    res.json({ 
        url: session.url,
        success: true 
    });

  } catch (error) {
    console.error('❌ Stripe Error:', error.message);
    res.status(500).json({ 
        message: error.message, 
        success: false, 
        error: true 
    });
  }
});

module.exports = router;
