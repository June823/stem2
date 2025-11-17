import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'

const UploadProduct = ({
    onClose,
    fetchData
  }) => {

  const [data,setData] = useState({
    productName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return;
    
    // Add files to preview
    const newFiles = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }))
    
    setData((preve)=>{
      return{
        ...preve,
        productImage : [ ...preve.productImage, ...newFiles]
      }
    })
  }

  const handleDeleteProductImage = (index)=>{
    const newProductImage = [...data.productImage]
    // Revoke object URL if it's a preview
    if (newProductImage[index].preview) {
      URL.revokeObjectURL(newProductImage[index].preview)
    }
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image")
      return;
    }
    
    if (!data.category) {
      toast.error("Please select a category")
      return;
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("productName", data.productName)
      formData.append("category", data.category)
      formData.append("description", data.description)
      formData.append("price", data.price)
      
      // Append all image files
      data.productImage.forEach(item => {
        if (item.file) {
          formData.append("productImage", item.file)
        }
      })
      
      const response = await fetch(SummaryApi.uploadProduct.url,{
        method : SummaryApi.uploadProduct.method,
        credentials : 'include',
        body : formData
      })

      const responseData = await response.json()

      if(responseData.success){
          toast.success(responseData?.message || "Product uploaded successfully")
          // Clean up object URLs
          data.productImage.forEach(item => {
            if (item.preview) {
              URL.revokeObjectURL(item.preview)
            }
          })
          setData({
            productName : "",
            category : "",
            productImage : [],
            description : "",
            price : "",
          })
          onClose()
          fetchData()
      } else {
        toast.error(responseData?.message || "Failed to upload product")
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("Failed to upload product")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
    <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

         <div className='flex justify-between items-center pb-3'>
             <h2 className='font-bold text-lg'>Upload Product</h2>
             <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                 <CgClose/>
             </div>
         </div>

       <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
         <label htmlFor='productName'>Product Name :</label>
         <input 
           type='text' 
           id='productName' 
           placeholder='enter product name' 
           name='productName'
           value={data.productName} 
           onChange={handleOnChange}
           className='p-2 bg-slate-100 border rounded'
           required
         />

           <label htmlFor='category' className='mt-3'>Category :</label>
           <select 
             required 
             value={data.category} 
             name='category' 
             onChange={handleOnChange} 
             className='p-2 bg-slate-100 border rounded'
           >
               <option value={""}>Select Category</option>
               {
                 productCategory.map((el,index)=>{
                   return(
                     <option value={el.value} key={el.value+index}>{el.label}</option>
                   )
                 })
               }
           </select>

           <label htmlFor='productImage' className='mt-3'>Product Image :</label>
           <label htmlFor='uploadImageInput'>
           <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-200 transition-colors'>
                     <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                       <span className='text-4xl'><FaCloudUploadAlt/></span>
                       <p className='text-sm'>Upload Product Images (Multiple allowed)</p>
                       <input type='file' id='uploadImageInput' accept='image/*' multiple className='hidden' onChange={handleUploadProduct}/>
                     </div>
           </div>
           </label> 
           <div>
               {
                 data?.productImage.length > 0 ? (
                     <div className='flex items-center gap-2 flex-wrap'>
                         {
                           data.productImage.map((el,index)=>{
                             const imageUrl = el.preview || el
                             return(
                               <div key={index} className='relative group'>
                                   <img 
                                     src={imageUrl} 
                                     alt={`Product ${index + 1}`} 
                                     width={80} 
                                     height={80}  
                                     className='bg-slate-100 border cursor-pointer object-cover'  
                                     onClick={()=>{
                                       setOpenFullScreenImage(true)
                                       setFullScreenImage(imageUrl)
                                     }}/>

                                     <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={()=>handleDeleteProductImage(index)}>
                                       <MdDelete/>  
                                     </div>
                               </div>
                               
                             )
                           })
                         }
                     </div>
                 ) : (
                   <p className='text-red-600 text-xs'>*Please upload at least one product image</p>
                 )
               }
               
           </div>

           <label htmlFor='price' className='mt-3'>Price :</label>
           <input 
             type='number' 
             id='price' 
             placeholder='enter price' 
             value={data.price} 
             name='price'
             onChange={handleOnChange}
             className='p-2 bg-slate-100 border rounded'
             required
             min="0"
             step="0.01"
           />

           <label htmlFor='description' className='mt-3'>Description :</label>
           <textarea 
             className='h-28 bg-slate-100 border resize-none p-1' 
             placeholder='enter product description' 
             rows={3} 
             onChange={handleOnChange} 
             name='description'
             value={data.description}
           >
           </textarea>

           <button type='submit' disabled={uploading} className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
             {uploading ? 'Uploading...' : 'Upload Product'}
           </button>
       </form> 

    </div>

    {/***display image full screen */}
    {
     openFullScreenImage && (
       <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
     )
    }
     

 </div>
  )
}

export default UploadProduct
