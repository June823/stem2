import React from 'react'

const AdminProductCard = ({ data, fetchData }) => {
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(`Delete ${data.productName}?`)
      if (!confirmDelete) return

      const response = await fetch(`https://your-backend-url.onrender.com/api/products/${data._id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        alert('Product deleted successfully')
        fetchData()
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting product')
    }
  }

  return (
    <div className='border p-3 rounded-md shadow-md w-52 flex flex-col items-center'>
      <img
        src={data.image || '/placeholder.png'}
        alt={data.productName}
        className='w-40 h-40 object-cover mb-2 rounded'
      />
      <h3 className='font-semibold text-center'>{data.productName}</h3>
      <p className='text-red-600 font-bold'>KES {data.price}</p>
      <button
        onClick={handleDelete}
        className='mt-2 px-2 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded'
      >
        Delete
      </button>
    </div>
  )
}

export default AdminProductCard
