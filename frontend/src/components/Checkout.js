import React from 'react';

function Checkout({ cartItems }) {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cartItems }),
      });

      const data = await response.json();

      if (data.url) {
        // New Stripe method: redirect directly to session URL
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed. See console for details.');
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
