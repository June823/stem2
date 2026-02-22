import React from 'react';
import getImageUrl from "../helpers/getImageUrl"; // ✅ Must import your helper

const backendURL = process.env.REACT_APP_API_URL;

const AdminProductCard = ({ data, fetchData }) => {
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(`Delete ${data.productName}?`);
      if (!confirmDelete) return;

      const response = await fetch(`${backendURL}/api/products/${data._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        alert('Product deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  return (
    <div className='border p-3 rounded-md shadow-md w-52 flex flex-col items-center bg-white'>
      <div className='w-40 h-40 flex justify-center items-center overflow-hidden mb-2 bg-slate-100 rounded'>
        <img
          /* ✅ FIX 1: Access the first element of the productImage array */
          /* ✅ FIX 2: Wrap it in getImageUrl to point to stem2-11 */
          src={getImageUrl(data?.productImage?.[0])} 
          alt={data.productName}
          className='w-full h-full object-scale-down hover:scale-110 transition-all'
        />
      </div>
      
      <h3 className='font-semibold text-center line-clamp-1'>{data.productName}</h3>
      <p className='text-red-600 font-bold'>KES {data.price}</p>
      
      <button
        onClick={handleDelete}
        className='mt-2 px-4 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all'
      >
        Delete
      </button>
    </div>
  );
};

export default AdminProductCard;
