const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = async (req, res) => {
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
      const name = item.productId?.productName || item.productName || 'Product';
      const price = Number(item.productId?.price || item.price);

      return {
        price_data: {
          currency: 'kes', 
          product_data: {
            name: name,
            // Fallback for image display in Stripe
            images: item.productId?.productImage ? [item.productId.productImage[0]] : []
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      client_reference_id: req.userId,
      success_url: `${process.env.FRONTEND_URL || 'https://stem2-12.onrender.com'}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://stem2-12.onrender.com'}/cart`,
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
};

module.exports = paymentController;
