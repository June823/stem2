const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";

  // If it's a full Cloudinary URL, use it
  if (url.startsWith("http")) {
    return url;
  }

  // 🔥 THE FIX: Point relative paths to your Backend
  // Replace this with your ACTUAL Render Backend URL
  const backendUrl = "https://your-backend-api.onrender.com"; 

  // Remove leading slash if it exists to avoid double slashes //
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;

  return `${backendUrl}/${cleanPath}`;
};

export default getImageUrl;
