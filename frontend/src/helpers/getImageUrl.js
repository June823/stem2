// src/helpers/getImageUrl.js

const getImageUrl = (url) => {
  if (!url) return "";

  // If already full URL, return it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Remove leading slash if it exists
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  // Your backend URL (CHANGE ONLY IF YOUR BACKEND CHANGES)
  const BASE_URL = "https://stem2-11.onrender.com";

  // Return full image URL
  return `${BASE_URL}${cleanUrl}`;
};

export default getImageUrl;
