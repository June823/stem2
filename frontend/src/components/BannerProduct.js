import React, { useEffect, useState, useCallback } from 'react'
import fibers1 from '../assets/banner/fibers1.jpeg'
import fibers2 from '../assets/banner/fibers2.jpeg'
import fibers3 from '../assets/banner/fibers3.jpeg'
import fibers4 from '../assets/banner/fibers4.jpeg'
import fibers5 from '../assets/banner/fibers5.jpeg'
import fibers6 from '../assets/banner/fibers6.jpeg'
import fibers7 from '../assets/banner/fibers7.jpeg'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const bannerImages = [fibers1, fibers2, fibers3, fibers4, fibers5, fibers6, fibers7]

  // Memoized navigation to prevent unnecessary re-renders
  const nextImage = useCallback(() => {
    setCurrentImage(prev => (prev + 1) % bannerImages.length)
  }, [bannerImages.length])

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  // Preload images for instant transitions
  useEffect(() => {
    bannerImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [bannerImages])

  // Autoplay Logic
  useEffect(() => {
    if (isPaused) return; // Stop timer if user is hovering

    const interval = setInterval(nextImage, 4000)
    return () => clearInterval(interval)
  }, [nextImage, isPaused])

  return (
    <div className="container mx-auto px-4 rounded my-4">
      {/* Controls positioned for better UX */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Featured Collections</h3>
        <div className="flex gap-2">
          <button 
            onClick={prevImage} 
            className="bg-white hover:bg-slate-100 text-slate-700 shadow-md rounded-full p-2 transition-colors"
            aria-label="Previous Image"
          >
            <FaAngleLeft />
          </button>
          <button 
            onClick={nextImage} 
            className="bg-white hover:bg-slate-100 text-slate-700 shadow-md rounded-full p-2 transition-colors"
            aria-label="Next Image"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* Main Banner Container */}
      <div 
        className="h-60 md:h-80 w-full bg-slate-200 relative overflow-hidden rounded-xl shadow-inner"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) h-full"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img 
                src={image} 
                alt={`Collection Banner ${index + 1}`} 
                className="w-full h-full object-cover" 
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Visual Progress Indicators (Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerImages.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${currentImage === index ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerProduct
