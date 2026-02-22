import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";

function Checkout({ cartItems }) {
  const { user } = useContext(Context);

  const handleCheckout = async () => {
    if (!user?._id) {
      toast.error("Please login to proceed to checkout");
      return;
    }

    try {
      // ✅ Use credentials: "include" to send the cookie to the backend
      const response = await fetch('https://stem2-11.onrender.com/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include", 
        body: JSON.stringify({ 
          products: cartItems,
          userId: user._id 
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Checkout session failed.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Checkout failed. Please check your connection.');
    }
  };

  return (
    <button onClick={handleCheckout} className='bg-blue-600 text-white w-full p-2 mt-2 rounded'>
      Pay with Stripe
    </button>
  );
}
export default Checkout;
