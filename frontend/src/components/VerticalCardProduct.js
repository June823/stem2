import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { MdModeEditOutline, MdDelete } from "react-icons/md" 
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import getImageUrl from '../helpers/getImageUrl'
import AdminEditProduct from './AdminEditProduct'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const scrollElement = useRef()

  const { fetchUserAddToCart, user } = useContext(Context)
  const displayKSh = (num) => `KSh ${Number(num || 0).toLocaleString()}`

  const fetchData = async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    
    // ✅ FIX: Only show products that are NOT deleted
    const activeProducts = (categoryProduct?.data || []).filter(p => !p.deleted)
    setData(activeProducts)
  }

  useEffect(() => { fetchData() }, [category])

  const handleDeleteProduct = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm("Move this product to trash?")) {
      const response = await fetch(SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        headers: { "content-type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ productId: id }) 
      })
      const dataResponse = await response.json()

      if (dataResponse.success) {
        toast.success(dataResponse.message)
        // ✅ INSTANT UI UPDATE: Remove from screen immediately
        setData((prev) => prev.filter(item => item._id !== id))
      } else {
        toast.error(dataResponse.message)
      }
    }
  }

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
            {(user?.role === "ADMIN" || user?.role === "ADMINISTRATOR") && (
              <div className='absolute top-2 right-2 flex gap-2 z-20 hidden group-hover:flex'>
                <div className='bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md' onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setSelectedProduct(product); setEditProduct(true);
                }}><MdModeEditOutline /></div>
                <div className='bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-md' onClick={(e) => handleDeleteProduct(e, product?._id)}><MdDelete /></div>
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
                <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e) => { e.preventDefault(); addToCart(e, product?._id); fetchUserAddToCart(); }}>Add to Cart</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {editProduct && <AdminEditProduct productData={selectedProduct} onClose={() => setEditProduct(false)} fetchData={fetchData} />}
    </div>
  )
}
export default VerticalCardProduct
