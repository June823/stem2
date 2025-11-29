// src/helpers/getImageUrl.js

const getImageUrl = (url) => {
  if (!url) return "";

  // If full http/https URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Normalize image name (remove leading slash)
  url = url.replace(/^\/+/, "");

  // Render backend base URL
  const BASE = "https://stem2-8.onrender.com";

  // If image comes from uploads folder (backend)
  return `${BASE}/uploads/${url}`;
};

export default getImageUrl;
