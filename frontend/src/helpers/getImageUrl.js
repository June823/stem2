const getImageUrl = (image) => {
    // 1. Handle empty or null images
    if (!image) return "";

    // 2. Handle arrays (take the first image if it's an array)
    const targetImage = Array.isArray(image) ? image[0] : image;

    // 3. Final safety check: ensure the result is a string
    if (typeof targetImage !== 'string') return "";

    // 4. If it's a full URL (like Cloudinary), return it as is
    if (targetImage.startsWith("http")) {
        return targetImage;
    }

    // 5. Point to your Backend Render URL
    const backendUrl = "https://stem2-11.onrender.com";
    
    // Clean the path (remove leading slash if it exists)
    const cleanPath = targetImage.startsWith("/") ? targetImage.slice(1) : targetImage;
    
    return `${backendUrl}/${cleanPath}`;
}

export default getImageUrl;
