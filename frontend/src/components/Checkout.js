import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";

function Checkout({ cartItems }) {
    const { user } = useContext(Context);

    const handleCheckout = async () => {
        // 1. Guard Clause
        if (!user?._id) {
            toast.error("Please login to proceed to checkout");
            return;
        }

        try {
            const response = await fetch('https://stem2-11.onrender.com/api/payment/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include", // ✅ MANDATORY: Tells Render to send your login session
                body: JSON.stringify({ 
                    products: cartItems.map(item => ({
                        productName: item.productId?.productName || item.productName,
                        price: item.productId?.price || item.price,
                        quantity: item.quantity
                    }))
                }),
            });

            // If the server rejected the cookie (CORS issue), this handles it
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Unauthorized");
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
            } else {
                toast.error(data.message || 'Payment session failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            // Displaying the specific error helps debugging
            toast.error(`Checkout failed: ${err.message}`);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition font-medium'
        >
            Pay with Stripe
        </button>
    );
}

export default Checkout;
