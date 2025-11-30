const SummaryApi = {
  // User authentication
  signIn: {
    url: "https://stem2-7.onrender.com/api/signin",
    method: "POST",
  },
  signUp: {
    url: "https://stem2-7.onrender.com/api/signup",
    method: "POST",
  },
  userDetails: {
    url: "https://stem2-7.onrender.com/api/user-details",
    method: "GET",
  },
  logoutUser: {
    url: "https://stem2-7.onrender.com/api/userLogout",
    method: "GET",
  },

  // Products
  getProduct: {
    url: "https://stem2-7.onrender.com/api/get-product",
    method: "GET",
  },
  filterProduct: {
    url: "https://stem2-7.onrender.com/api/filter-product",
    method: "POST",
  },
  categoryProduct: {
    url: "https://stem2-7.onrender.com/api/get-categoryProduct",
    method: "GET",
  },
  categoryWiseProduct: {
    url: "https://stem2-7.onrender.com/api/category-product",
    method: "POST",
  },
  productDetails: {
    url: "https://stem2-7.onrender.com/api/product-details",
    method: "POST",
  },
  searchProduct: {
    url: "https://stem2-7.onrender.com/api/search",
    method: "GET",
  },
  recommendations: {
    url: "https://stem2-7.onrender.com/api/recommendations",
    method: "GET",
  },

  // Admin product actions
  uploadProduct: {
    url: "https://stem2-7.onrender.com/api/upload-product",
    method: "POST",
  },
  updateProduct: {
    url: "https://stem2-7.onrender.com/api/update-product",
    method: "POST",
  },
  deleteProduct: {
    url: "https://stem2-7.onrender.com/api/delete-product",
    method: "POST",
  },
  undeleteProduct: {
    url: "https://stem2-7.onrender.com/api/undelete-product",
    method: "POST",
  },

  // Cart / user actions
  addToCartProductCount: {
    url: "https://stem2-7.onrender.com/api/countAddToCartProduct",
    method: "GET",
  },
  addToCart: {
    url: "https://stem2-7.onrender.com/api/addToCart",
    method: "POST",
  },
  viewCartProduct: {
    url: "https://stem2-7.onrender.com/api/view-card-product",
    method: "GET",
  },
  updateCartProduct: {
    url: "https://stem2-7.onrender.com/api/update-cart-product",
    method: "POST",
  },
  deleteCartProduct: {
    url: "https://stem2-7.onrender.com/api/delete-cart-product",
    method: "POST",
  },

  // Admin dashboard / summary
  adminSummary: {
    url: "https://stem2-7.onrender.com/api/admin/summary",
    method: "GET",
  },
};

export default SummaryApi;
