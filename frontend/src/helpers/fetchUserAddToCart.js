import SummaryApi from "../common";

const fetchUserAddToCart = async () => {
  try {
    const response = await fetch(
      SummaryApi.addToCartProductCount.url,
      {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include", // IMPORTANT (sends cookie)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // If not authorized (401), return default count
    if (!response.ok) {
      return { data: { count: 0 } };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { data: { count: 0 } };
  }
};

export default fetchUserAddToCart;
