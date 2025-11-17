import React, { useEffect, useState, useRef } from 'react'
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

  const bannerImages = [fibers1, fibers2, fibers3, fibers4, fibers5, fibers6, fibers7]

  const nextImage = () => setCurrentImage(prev => (prev + 1) % bannerImages.length)
  const prevImage = () => setCurrentImage(prev => (prev - 1 + bannerImages.length) % bannerImages.length)

  const intervalRef = useRef(null)

  // Preload images to avoid visible delay on transition
  useEffect(() => {
    bannerImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    // autoplay every 3s
    intervalRef.current = setInterval(nextImage, 3000)
    return () => clearInterval(intervalRef.current)
  }, [])

  // reset autoplay when user navigates manually to keep flow smooth
  const handleNext = () => {
    clearInterval(intervalRef.current)
    nextImage()
    intervalRef.current = setInterval(nextImage, 3000)
  }

  const handlePrev = () => {
    clearInterval(intervalRef.current)
    prevImage()
    intervalRef.current = setInterval(nextImage, 3000)
  }

  return (
    <div className="container mx-auto px-4 rounded">
      {/* Controls moved above the banner */}
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={handlePrev} className="bg-white shadow rounded-full p-2"><FaAngleLeft /></button>
        <button onClick={handleNext} className="bg-white shadow rounded-full p-2"><FaAngleRight /></button>
      </div>

      <div className="h-56 md:h-72 w-full bg-slate-200 relative overflow-hidden rounded">
        {/* Image Carousel */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentImage * 100}%)`, willChange: 'transform' }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img src={image} alt={`banner-${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerProduct
