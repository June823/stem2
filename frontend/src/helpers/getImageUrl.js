const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";

  // If it's already a full URL (Cloudinary), use it
  if (url.startsWith("http")) {
    return url;
  }

  // 🔥 THE FIX: Use your actual Backend URL
  const backendUrl = "https://stem2-11.onrender.com"; 

  // Clean the path: remove leading slash so we don't get //
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;

  return `${backendUrl}/${cleanPath}`;
};

export default getImageUrl;
