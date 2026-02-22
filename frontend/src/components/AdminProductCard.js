import React from 'react';
import getImageUrl from "../helpers/getImageUrl";
import { toast } from 'react-toastify';

const AdminProductCard = ({ data, fetchData }) => {
  
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(`Delete ${data.productName}?`);
      if (!confirmDelete) return;

      // ✅ FIX: Added credentials: "include" and specific backend URL
      const response = await fetch(`https://stem2-11.onrender.com/api/delete-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include", 
        body: JSON.stringify({ productId: data._id })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Product deleted");
        fetchData(); 
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product');
    }
  };

  return (
    <div className='border p-3 rounded-md shadow-md w-52 flex flex-col items-center bg-white'>
      <div className='w-40 h-40 flex justify-center items-center overflow-hidden mb-2 bg-slate-100 rounded'>
        <img
          src={getImageUrl(data?.productImage?.[0])} 
          alt={data.productName}
          className='w-full h-full object-scale-down hover:scale-110 transition-all'
        />
      </div>
      
      <h3 className='font-semibold text-center line-clamp-1'>{data.productName}</h3>
      <p className='text-red-600 font-bold'>KES {data.price}</p>
      
      <div className='flex gap-2 mt-2'>
        <button
          onClick={handleDelete}
          className='px-4 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all'
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
