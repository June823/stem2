const getImageUrl = (url) => {
  if (!url) return "";

  // Cloudinary already returns full URL
  if (url.startsWith("http")) {
    return url;
  }

  return url;
};

export default getImageUrl;
