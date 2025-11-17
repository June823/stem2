import SummaryApi from "../common";

const fetchUserAddToCart = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = {
      "Content-Type": "application/json"
    }

    const fetchOptions = {
      method: SummaryApi.addToCartProductCount.method,
      headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    } else {
      // fall back to cookie-based auth
      fetchOptions.credentials = 'include'
    }

    const response = await fetch(SummaryApi.addToCartProductCount.url, fetchOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { data: { count: 0 } };
  }
};

export default fetchUserAddToCart;
