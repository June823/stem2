import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import getImageUrl from "../helpers/getImageUrl";
import SummaryApi from '../common'
import { Link } from 'react-router-dom'
import displayINRCurrency from '../helpers/displayCurrency'

// Small recommendation card used inline — shows similarity badge when same/close price
const RecCard = ({p}) => {
  const img = p?.productImage?.[0] || p?.productImage
  const isSamePrice = p?._recScore === 0
  const isClose = !isSamePrice && (p?._recPct <= 5) // within 5%
  return (
    <Link to={'/product/'+p._id} className='w-56 bg-white rounded shadow p-2'>
      <div className='w-full h-40 flex items-center justify-center bg-slate-100 overflow-hidden relative'>
        {img ? <img src={getImageUrl(img)} className='w-full h-full object-scale-down'/> : <div className='text-sm text-slate-400'>No image</div>}
        {(isSamePrice || isClose) && (
          <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${isSamePrice ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}>
            {isSamePrice ? 'Same price' : 'Close price'}
          </div>
        )}
      </div>
      <div className='p-2'>
        <div className='font-medium text-sm'>{p.productName}</div>
        <div className='text-red-600 font-semibold'>{displayINRCurrency(p.sellingPrice || p.price)}</div>
        {p?._recScore !== undefined && (
          <div className='text-xs text-slate-500 mt-1'>Diff: {p._recScore} ({p._recPct}%)</div>
        )}
      </div>
    </Link>
  )
}

const ProductDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [activeImage, setActiveImage] = useState(null);
  const [recs, setRecs] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://stem2-7.onrender.com/api/product-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }), // pass product ID to backend
        });
        const dataResponse = await response.json();

        if (dataResponse.success) {
          const product = dataResponse.data;
          setData(product);

          // Set first image as active main image
          if (product?.productImage?.length > 0) {
            setActiveImage(product.productImage[0]);
          }
        } else {
          console.error("Error:", dataResponse.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
    // fetch recommendations (best-effort)
    const fetchRecs = async () => {
      try {
        const res = await fetch(`${SummaryApi.recommendations.url}?productId=${id}`)
        const json = await res.json()
        if (json.success) setRecs(json.data || [])
      } catch (err) {
        console.error('Failed to fetch recommendations', err)
      }
    }
    fetchRecs()
  }, [id]);

  const handleMouseEnterProduct = (imgURL) => {
    setActiveImage(imgURL);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Product Image */}
        <div className="w-full flex justify-center items-center bg-white rounded shadow">
          {activeImage ? (
            <img
              src={getImageUrl(activeImage)}
              alt={data?.productName || "Product image"}
              className="max-h-[500px] w-auto object-scale-down mix-blend-multiply transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No image available
            </p>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{data?.productName}</h2>
          <p className="text-gray-600 capitalize">{data?.category}</p>
          <p className="mt-4 text-gray-700">{data?.description}</p>
          <p className="mt-4 font-semibold text-xl text-green-700">
            KES {data?.price}
          </p>
          {data?.sellingPrice && (
            <p className="text-red-600 line-through">
              KES {data?.sellingPrice}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail Images */}
      {data?.productImage?.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {data.productImage.map((imgURL, index) => (
            <div
              key={index}
              className={`w-20 h-20 border-2 rounded-md overflow-hidden cursor-pointer ${
                imgURL === activeImage ? "border-red-500" : "border-gray-300"
              }`}
              onMouseEnter={() => handleMouseEnterProduct(imgURL)}
              onClick={() => handleMouseEnterProduct(imgURL)}
            >
              <img
                src={getImageUrl(imgURL)}
                alt={data?.productName || "Product thumbnail"}
                className="w-full h-full object-scale-down mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      )}

      {/* Related Products */}
      <div className="mt-10">
        {data?.category && (
          <CategoryWiseProductDisplay category={data.category} />
        )}

        {recs.length > 0 && (
          <div className='mt-8'>
            <h3 className='text-xl mb-4'>Recommended for you</h3>
            <div className='flex gap-4 overflow-x-auto scrollbar-none'>
              {recs.map(r => <RecCard key={r._id} p={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
