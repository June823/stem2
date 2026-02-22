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
      const response = await fetch("https://stem2-11.onrender.com/api/payment/create-checkout-session", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: "include", // 👈 Must be here
        body: JSON.stringify({ 
          products: cartItems,
          userId: user._id 
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // This will tell you if the backend said "unauthorized"
        toast.error(data.message || 'Session failed');
      }
    } catch (err) {
      toast.error('Checkout failed. Open console to see why.');
    }
  };
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
