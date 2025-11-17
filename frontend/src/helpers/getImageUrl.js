// src/helpers/getImageUrl.js
const getImageUrl = (url) => {
  if (!url) return ""; // No image
  // Handle Cloudinary URLs (https://) or any full URL (http:// or https://)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Handle local backend uploads
  if (url.startsWith("/uploads/")) {
    return `http://localhost:8080${url}`;
  }
  // Handle relative paths
  return `http://localhost:8080/${url.replace(/^\/?/, "")}`;
};

export default getImageUrl;
