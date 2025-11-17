import SummaryApi from '../common'

const addToCart = async (e, productId) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    // Use centralized API definition to avoid path mistakes
    const addToCartUrl = (SummaryApi && SummaryApi.addToCartProduct && SummaryApi.addToCartProduct.url) || (process.env.REACT_APP_SERVER_DOMAIN ? `${process.env.REACT_APP_SERVER_DOMAIN}/api/addtocart` : 'http://localhost:8080/api/addtocart')

    let response;

    if (token) {
      // If token exists in localStorage, use Authorization header
      response = await fetch(addToCartUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
    } else {
      // Otherwise attempt cookie-based auth (credentials include)
      response = await fetch(addToCartUrl, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      });
    }

    const data = await response.json();

    if (data.success) {
      console.log("Added to cart:", data);
      alert("Product added to cart!");
    } else {
      alert(data.message || "Error adding product to cart");
    }

  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add product to cart");
  }
};

export default addToCart;
