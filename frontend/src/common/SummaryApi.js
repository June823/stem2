const SummaryApi = {
  signIn: {
    url: `${import.meta.env.VITE_API_URL}/api/signin`,
    method: "POST",
  },
  filterProduct: {
    url: `${import.meta.env.VITE_API_URL}/api/filter-product`,
    method: "POST",
  },
  categoryProduct: {
    url: `${import.meta.env.VITE_API_URL}/api/get-categoryProduct`,
    method: "GET",
  },
  addToCartProductCount: {
    url: `${import.meta.env.VITE_API_URL}/api/countAddToCartProduct`,
    method: "GET",
  },
  userDetails: {
    url: `${import.meta.env.VITE_API_URL}/api/user-details`,
    method: "GET",
  },
};
export default SummaryApi;
