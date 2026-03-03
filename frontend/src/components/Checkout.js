import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";
import SummaryApi from '../common';

function Checkout({ cartItems }) {
    const { user } = useContext(Context);

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');

        // FIX: Check both context AND localStorage token
        if (!user?._id && !token) {
            toast.error("Please login to proceed to checkout");
            return;
        }

        try {
            toast.info("Preparing checkout...");

            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                headers: { 
                    'Content-Type': 'application/json',
                    // This tells the backend WHO you are
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    products: cartItems.map(item => ({
                        productName: item.productId?.productName,
                        // Using the price logic that fixed your Cart display
                        price: Number(item.productId?.sellingPrice || item.productId?.price || 0),
                        quantity: item.quantity || 1,
                        image: item.productId?.productImage?.[0]
                    }))
                }),
            });

            // Handle potential backend errors (like 401 Unauthorized)
            if (response.status === 401 || response.status === 403) {
                toast.error("Session expired. Please login again.");
                return;
            }

            const data = await response.json();

            if (data.success && data.url) {
                window.location.href = data.url; 
            } else {
                toast.error(data.message || 'Payment session failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            toast.error("Checkout failed. Please check your internet connection.");
        }
    };

    return (
        <button 
            onClick={handleCheckout} 
            className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition font-bold'
        >
            Pay with Stripe
        </button>
    );
}

export default Checkout;
