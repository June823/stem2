import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";
import SummaryApi from '../common';

function Checkout({ cartItems }) {
    const { user } = useContext(Context);

    const handleCheckout = async () => {
        if (!user?._id) {
            toast.error("Please login to proceed to checkout");
            return;
        }

        try {
            // ✅ We call the URL from SummaryApi
            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: "include", 
                body: JSON.stringify({ 
                    products: cartItems.map(item => ({
                        productName: item.productId?.productName || item.productName || "Product",
                        price: Number(item.productId?.price || item.price) || 0,
                        quantity: item.quantity || 1
                    }))
                }),
            });

            // ✅ Check if response is actually JSON before parsing
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server sent a non-JSON response. Check your Backend Route URL.");
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; 
            } else {
                toast.error(data.message || 'Payment session failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            toast.error(`Checkout failed: ${err.message}`);
        }
    };

    return (
        <button onClick={handleCheckout} className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition'>
            Pay with Stripe
        </button>
    );
}

export default Checkout;
