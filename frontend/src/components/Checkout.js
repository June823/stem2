import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";

function Checkout({ cartItems }) {
  const { user } = useContext(Context);

  // ✅ Added 'async' here to fix the "Unexpected reserved word 'await'" error
  const handleCheckout = async () => {
    
    // 1. Safety Check: Ensure user is logged in
    if (!user?._id) {
      toast.error("Please login to proceed to checkout");
      return;
    }

    try {
      // 2. Call your backend (stem2-11)
      const response = await fetch('https://stem2-11.onrender.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: "include", 
        body: JSON.stringify({ 
          products: cartItems, // This passes the array to your controller
          userId: user._id 
        }),
      });

      const data = await response.json();

      if (data.url) {
        // 3. Redirect to Stripe's secure payment page
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to start checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Checkout failed. Please check your connection.');
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
