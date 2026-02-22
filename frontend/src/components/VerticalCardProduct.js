import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { MdModeEditOutline } from "react-icons/md" // ✅ Added
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import getImageUrl from '../helpers/getImageUrl'
import AdminEditProduct from './AdminEditProduct' // ✅ Added

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(false) // ✅ Added
  const [selectedProduct, setSelectedProduct] = useState(null) // ✅ Added
  const loadingList = new Array(13).fill(null)
  const scrollElement = useRef()

  const { fetchUserAddToCart, user } = useContext(Context) // ✅ Added user

  // ✅ Updated Currency Logic to KSh
  const displayKSh = (num) => `KSh ${Number(num).toLocaleString()}`

  const handleAddToCart = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const fetchData = async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    setData(categoryProduct?.data || [])
  }

  useEffect(() => { fetchData() }, [category])

  const scrollRight = () => { scrollElement.current.scrollLeft += 300 }
  const scrollLeft = () => { scrollElement.current.scrollLeft -= 300 }

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>
        <button className='z-10 bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}><FaAngleLeft /></button>
        <button className='z-10 bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}><FaAngleRight /></button>

        {!loading && data.map((product) => (
            <div key={product?._id} className='relative group'> 
              {/* ✅ ADMIN EDIT BUTTON */}
              {(user?.role === "ADMIN" || user?.role === "ADMINISTRATOR") && (
                <div 
                  className='absolute top-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 shadow-md z-20 hidden group-hover:block'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedProduct(product);
                    setEditProduct(true);
                  }}
                >
                  <MdModeEditOutline />
                </div>
              )}

              <Link to={"/product/" + product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow block'>
                <div className='bg-slate-200 h-48 p-4 flex justify-center items-center'>
                    <img src={getImageUrl(product?.productImage?.[0])} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' alt="" />
                </div>
                <div className='p-4 grid gap-3'>
                  <h2 className='font-medium text-base md:text-lg text-black'>{product?.productName}</h2>
                  <p className='capitalize text-slate-500'>{product?.category}</p>
                  <div className='flex gap-3'>
                    <p className='text-red-600 font-medium'>{displayKSh(product?.sellingPrice || product?.price)}</p>
                    {product?.sellingPrice && <p className='text-slate-500 line-through'>{displayKSh(product?.price)}</p>}
                  </div>
                  <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                </div>
              </Link>
            </div>
          ))
        }
      </div>

      {/* ✅ RENDER EDIT MODAL */}
      {editProduct && (
        <AdminEditProduct 
          productData={selectedProduct} 
          onClose={() => setEditProduct(false)} 
          fetchData={fetchData} 
        />
      )}
    </div>
  )
}
export default VerticalCardProduct
