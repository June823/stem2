import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import AdminProductCard from '../components/AdminProductCard';

const backendURL = import.meta.env.VITE_API_URL;

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(`${backendURL}/api/products`);
      const dataResponse = await response.json();

      console.log('Product data', dataResponse);

      setAllProduct(dataResponse?.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Products</h2>
        <button
          className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/** Display all products */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {allProduct.map((product, index) => (
          <AdminProductCard
            key={index + 'allProduct'}
            data={{
              ...product,
              // pick the first image in the array or null
              image:
                product.productImage && product.productImage.length > 0
                  ? `${backendURL}${product.productImage[0]}`
                  : null,
            }}
            fetchData={fetchAllProduct}
          />
        ))}
      </div>

      {/** Upload product modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
