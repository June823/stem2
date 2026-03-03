import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";
import SummaryApi from '../common';

function Checkout({ cartItems }) {
    const { user } = useContext(Context);

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');

        // Check both Context and LocalStorage to be safe
        if (!user?._id && !token) {
            toast.error("Please login to proceed to checkout");
            return;
        }

        try {
            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 🔑 Added this!
                },
                // credentials: "include", // Only keep this if using Cookies
                body: JSON.stringify({ 
                    products: cartItems.map(item => ({
                        productName: item.productId?.productName || "Product",
                        // 🔑 Ensure this matches your DB field (sellingPrice vs price)
                        price: Number(item.productId?.sellingPrice || item.productId?.price || 0),
                        quantity: item.quantity || 1,
                        image: item.productId?.productImage?.[0]
                    }))
                }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text(); // Get raw error if not JSON
                console.error("Server Response:", text);
                throw new Error("Server sent a non-JSON response. Check your Backend Route.");
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
        <button onClick={handleCheckout} className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition font-bold'>
            Pay with Stripe
        </button>
    );
}

export default Checkout;
