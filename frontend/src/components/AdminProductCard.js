import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import getImageUrl from '../helpers/getImageUrl';
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)

    const handleDelete = async () => {
      // avoid using the restricted global `confirm` directly (ESLint no-restricted-globals)
      if (!window.confirm('Delete this product? This is permanent')) return;
      try{
        const token = localStorage.getItem('token')
        const headers = { 'Content-Type': 'application/json' }
        const options = { method: SummaryApi.deleteProduct.method, headers }
        if (token) headers.Authorization = `Bearer ${token}`
        else options.credentials = 'include'

        options.body = JSON.stringify({ productId: data._id })

        const res = await fetch(SummaryApi.deleteProduct.url, options)
        const json = await res.json()
        if(json.success){
          toast.success('Product deleted')
          fetchdata()
        } else {
          toast.error(json.message || 'Failed to delete product')
        }
      }catch(err){
        console.error(err)
        toast.error('Failed to delete product')
      }
    }

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={getImageUrl(data?.productImage?.[0])}  className='mx-auto object-fill h-full' alt={data?.productName}/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

            <div>

                <p className='font-semibold'>
                  {
                    displayINRCurrency(data.price)
                  }
        
                </p>

        <div className='flex gap-2 items-center'>
        <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={handleDelete} title='Delete product'>
          🗑
        </div>
        <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
          <MdModeEditOutline/>
        </div>
        </div>

            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminProductCard