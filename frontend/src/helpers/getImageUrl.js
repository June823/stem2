const getImageUrl = (url) => {
  if (!url) {
    // Return a placeholder if no image exists
    return "https://via.placeholder.com/200";
  }

  // 1. If it's a full Cloudinary URL, return it as is
  if (url.startsWith("http")) {
    return url;
  }

  // 2. If it's a local upload, point it to your Backend URL
  // Replace the URL below with your actual Render Backend link
  const backendURL = "https://your-backend-api.onrender.com"; 
  return `${backendURL}/${url}`;
};

export default getImageUrl;
