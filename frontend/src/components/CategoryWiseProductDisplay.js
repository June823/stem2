import React, { useContext, useEffect, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import getImageUrl from '../helpers/getImageUrl'

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingList = new Array(13).fill(null)
  const { fetchUserAddToCart } = useContext(Context)

  const handleAddToCart = async (e, id) => {
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

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all'>
        {loading ? (
          loadingList.map((_, index) => (
            <div key={"loading" + index} className='w-full min-w-[280px] md:min-w-[320px] bg-white rounded-sm shadow'>
              <div className='bg-slate-200 h-48 flex justify-center items-center animate-pulse'></div>
              <div className='p-4 grid gap-3'>
                <h2 className='h-6 bg-slate-200 rounded-full animate-pulse'></h2>
                <p className='h-4 bg-slate-200 rounded-full animate-pulse'></p>
                <div className='flex gap-3'>
                  <p className='h-4 w-full bg-slate-200 rounded-full animate-pulse'></p>
                  <p className='h-4 w-full bg-slate-200 rounded-full animate-pulse'></p>
                </div>
                <button className='h-8 bg-slate-200 rounded-full animate-pulse w-full'></button>
              </div>
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((product) => {
            const imageUrl = product?.productImage?.[0] || product?.productImage || "";
            return (
              <Link key={product?._id} to={"/product/" + product?._id} className='w-full min-w-[280px] md:min-w-[320px] bg-white rounded-sm shadow'>
                <div className='bg-slate-200 h-48 flex justify-center items-center'>
                  {imageUrl ? (
                    <img 
                      src={getImageUrl(imageUrl)} 
                      className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' 
                      alt={product?.productName || "Product"} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div style={{display: imageUrl ? 'none' : 'block'}} className='text-slate-400 text-sm'>No image</div>
                </div>
                <div className='p-4 grid gap-3'>
                  <h2 className='font-medium text-base md:text-lg text-black'>{product?.productName}</h2>
                  <p className='capitalize text-slate-500'>{product?.category}</p>
                  <div className='flex gap-3'>
                    <p className='text-red-600 font-medium'>{displayINRCurrency(product?.sellingPrice || product?.price)}</p>
                    {product?.sellingPrice && product?.price && (
                      <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                    )}
                  </div>
                  <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                </div>
              </Link>
            );
          })
        ) : (
          <div className='w-full text-center py-8'>
            <p className='text-slate-500 text-lg'>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
