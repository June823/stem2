import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";

function Checkout({ cartItems }) {
  const { user } = useContext(Context);

  const handleCheckout = async () => {
    // 1. Guard Clause: Don't even try if the user isn't logged in
    if (!user?._id) {
      toast.error("Please login to proceed to checkout");
      return;
    }

    try {
      // 2. Add credentials: "include" so the backend gets the token/cookie
      const response = await fetch('https://stem2-11.onrender.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: "include", // 🔥 CRITICAL for Render cookies
        body: JSON.stringify({ 
          products: cartItems,
          userId: user._id // Pass user ID explicitly if your backend needs it
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to start checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Checkout failed. Make sure you are logged in.');
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition'
    >
      Pay with Stripe
    </button>
  );
}

export default Checkout;
