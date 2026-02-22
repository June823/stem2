import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Context from "../context";
import SummaryApi from '../common'; // ✅ Import your API map

function Checkout({ cartItems }) {
    const { user } = useContext(Context);

    const handleCheckout = async () => {
        if (!user?._id) {
            toast.error("Please login to proceed to checkout");
            return;
        }

        try {
            // ✅ Use SummaryApi instead of hardcoded string
            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: "include", 
                body: JSON.stringify({ 
                    products: cartItems.map(item => ({
                        productName: item.productId?.productName || item.productName || "Product",
                        // ✅ Force price to be a number and default to 0 to prevent NaN errors
                        price: Number(item.productId?.price || item.price) || 0,
                        quantity: item.quantity || 1
                    }))
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Unauthorized or Server Error");
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
        <button
            onClick={handleCheckout}
            className='bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700 transition font-medium'
        >
            Pay with Stripe
        </button>
    );
}

export default Checkout;
