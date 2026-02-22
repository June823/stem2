const getImageUrl = (image) => {
    if(!image) return ""

    // If it's a full URL (Cloudinary), use it
    if(image.startsWith("http")){
        return image
    }

    // 🔥 THE FIX: Point to your ACTUAL Backend Render URL
    const backendUrl = "https://stem2-11.onrender.com"
    
    // Clean the path (remove leading slash if present)
    const cleanPath = image.startsWith("/") ? image.slice(1) : image
    
    return `${backendUrl}/${cleanPath}`
}

export default getImageUrl
