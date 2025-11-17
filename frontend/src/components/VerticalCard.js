import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
import getImageUrl from '../helpers/getImageUrl'

const defaultCategoryImages = {
    baskets: '/uploads/products/baskets/basket1.jpeg',
    handbags: '/uploads/products/handbags/handbg1.jpeg',
    hats: '/uploads/products/hats/hat1.jpeg',
    mats: '/uploads/products/mats/mat1.jpeg',
    sandals: '/uploads/products/sandals/sandals1.jpeg',
}

const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
    {

         loading ? (
             loadingList.map((product,index)=>{
                 return(
                     <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow '>
                         <div className='bg-slate-200 h-48 p-0 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                         </div>
                         <div className='p-4 grid gap-3'>
                             {/* title skeleton - single line */}
                             <div className='h-4 bg-slate-200 rounded-sm w-3/5 animate-pulse'></div>
                             {/* subtitle skeleton */}
                             <div className='h-3 bg-slate-200 rounded-sm w-2/5 animate-pulse'></div>
                             <div className='flex gap-3'>
                                 <div className='h-4 bg-slate-200 rounded-sm w-1/3 animate-pulse'></div>
                                 <div className='h-4 bg-slate-200 rounded-sm w-1/4 animate-pulse'></div>
                             </div>
                             {/* button skeleton */}
                             <div className='h-8 bg-slate-200 rounded-md w-24 animate-pulse'></div>
                         </div>
                     </div>
                 )
             })
         ) : (
             data.map((product,index)=>{
                 return(
                     <Link to={"/product/"+product?._id} className='w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow ' onClick={scrollTop}>
                                                 <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                                         {
                                                             (()=>{
                                                                 const img = product?.productImage?.[0] || product?.productImage
                                                                 const cat = product?.category || 'baskets'
                                                                 const src = img ? getImageUrl(img) : getImageUrl(defaultCategoryImages[cat] || defaultCategoryImages.baskets)
                                                                 return <img src={src} alt={product?.productName} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'/>
                                                             })()
                                                         }
                                                 </div>
                         <div className='p-4 grid gap-3'>
                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                             <p className='capitalize text-slate-500'>{product?.category}</p>
                             <div className='flex gap-3'>
                                 <p className='text-red-600 font-medium'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                 <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price)  }</p>
                             </div>
                             <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                         </div>
                     </Link>
                 )
             })
         )
         
     }
    </div>
  )
}

export default VerticalCard