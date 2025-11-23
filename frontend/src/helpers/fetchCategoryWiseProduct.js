const fetchCategoryWiseProduct = async (category) => {
  try {
    // Ensure we always call the server's /api prefix regardless of REACT_APP_SERVER_DOMAIN
    const serverDomain = process.env.REACT_APP_SERVER_DOMAIN || "https://stem2-7.onrender.com";
    const response = await fetch(
      `${serverDomain}/api/category-product`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      }
    );

    const data = await response.json();
    
    // Handle both old format (array) and new format ({ success, data })
    if (Array.isArray(data)) {
      return { data: data };
    }
    
    // Return the response with data array (even if empty)
    return {
      data: data?.data || [],
      success: data?.success !== false,
      message: data?.message
    };
  } catch (error) {
    console.error("Error fetching category-wise products:", error);
    return { data: [], success: false };
  }
};

export default fetchCategoryWiseProduct;
