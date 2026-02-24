import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id, fetchUserAddToCart) => {
    e?.stopPropagation();
    e?.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
        toast.error("Please login to add items to cart");
        return;
    }

    const response = await fetch(SummaryApi.addToCartProduct.url, {
        method: SummaryApi.addToCartProduct.method,
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ productId: id })
    });

    const responseData = await response.json();

    if (responseData.success) {
        toast.success(responseData.message);
        if(fetchUserAddToCart) fetchUserAddToCart();
    } else {
        toast.error(responseData.message);
    }
    return responseData;
};

export default addToCart;
