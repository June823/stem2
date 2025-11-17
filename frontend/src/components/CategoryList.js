import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'
import getImageUrl from '../helpers/getImageUrl'

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const categoryLoading = new Array(13).fill(null)

  const fetchCategoryProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(SummaryApi.categoryProduct.url, {
        method: SummaryApi.categoryProduct.method || "GET",
        headers: { "Content-Type": "application/json" }
      })
      const dataResponse = await response.json()
      setCategoryProduct(Array.isArray(dataResponse?.data) ? dataResponse.data : [])
    } catch (err) {
      console.error("Error fetching category products:", err)
      setCategoryProduct([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategoryProduct() }, [])

  const defaultCategoryImages = {
    baskets: '/uploads/products/baskets/basket1.jpeg',
    handbags: '/uploads/products/handbags/handbg1.jpeg',
    hats: '/uploads/products/hats/hat1.jpeg',
    mats: '/uploads/products/mats/mat1.jpeg',
    sandals: '/uploads/products/sandals/sandals1.jpeg',
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
        {loading ? (
          categoryLoading.map((_, index) => (
            <div
              className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'
              key={"categoryLoading" + index}
            ></div>
          ))
        ) : categoryProduct.length > 0 ? (
          categoryProduct.map((product) => {
            const cat = product?.category || "baskets"
            const imageFromProduct = Array.isArray(product?.productImage) ? product.productImage[0] : product?.productImage
            const src = imageFromProduct ? getImageUrl(imageFromProduct) : getImageUrl(defaultCategoryImages[cat] || defaultCategoryImages.baskets)

            return (
              <Link
                key={product?._id}
                to={"/product-category?category=" + product?.category}
                className='cursor-pointer'
              >
                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                  <img
                    src={src}
                    alt={product?.category}
                    className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                  />
                </div>
                <p className='text-center text-sm md:text-base capitalize'>
                  {product?.category || "Unknown"}
                </p>
              </Link>
            )
          })
        ) : (
          <p className='text-center w-full text-slate-500'>No categories found.</p>
        )}
      </div>
    </div>
  )
}

export default CategoryList
