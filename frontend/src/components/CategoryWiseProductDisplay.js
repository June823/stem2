import React, { useContext, useEffect, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import { MdModeEditOutline, MdDelete } from "react-icons/md" 
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import getImageUrl from '../helpers/getImageUrl'
import AdminEditProduct from './AdminEditProduct'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const { fetchUserAddToCart, user } = useContext(Context)
  const displayKSh = (num) => `KSh ${Number(num || 0).toLocaleString()}`

  const fetchData = async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    setData(categoryProduct?.data || [])
  }

  useEffect(() => { fetchData() }, [category])

  const handleDeleteProduct = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm("Delete this product permanently?")) {
      const response = await fetch(SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        headers: { "content-type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ _id: id })
      })
      const resData = await response.json()
      if (resData.success) { toast.success(resData.message); fetchData(); }
      else { toast.error(resData.message); }
    }
  }

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-center md:justify-between gap-4 md:gap-6'>
        {!loading && data.map((product) => (
          <div key={product?._id} className='relative group bg-white rounded-sm shadow'>
            {(user?.role === "ADMIN" || user?.role === "ADMINISTRATOR") && (
              <div className='absolute top-2 right-2 flex gap-2 z-20 hidden group-hover:flex'>
                <div className='bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-md' onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setSelectedProduct(product); setEditProduct(true);
                }}><MdModeEditOutline /></div>
                <div className='bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-md' onClick={(e) => handleDeleteProduct(e, product?._id)}><MdDelete /></div>
              </div>
            )}
            <Link to={"/product/" + product?._id} className='block'>
              <div className='bg-slate-200 h-48 flex justify-center items-center'>
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
export default CategoryWiseProductDisplay
