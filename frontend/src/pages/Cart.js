import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import { MdDelete } from "react-icons/md";
import getImageUrl from '../helpers/getImageUrl';
import Checkout from '../components/Checkout' 

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasFetched, setHasFetched] = useState(false) 
    const { fetchUserAddToCart } = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const displayKSh = (num) => `KSh ${Number(num || 0).toLocaleString()}`

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token'); 
            if (!token) {
                setData([]);
                setHasFetched(true);
                return;
            }

            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }
            });

            const responseData = await response.json();
            if (responseData.success) {
                const validData = (responseData.data || []).filter(item => item.productId !== null);
                setData(validData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    };

    useEffect(() => { fetchData() }, [])

    const deleteCartProduct = async (id) => {
        const token = localStorage.getItem('token')
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            headers: { 
                "content-type": 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ _id: id })
        })
        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
            fetchUserAddToCart()
        }
    }

    const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * (curr?.productId?.sellingPrice || 0)), 0)

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold my-4'>My Shopping Cart</h2>
            <div className='flex flex-col lg:flex-row gap-10'>
                <div className='w-full max-w-3xl'>
                    {hasFetched && data.length === 0 && !loading && (
                        <div className='bg-white p-10 text-center border rounded'>
                            <p className='text-xl text-slate-500'>Your cart is empty</p>
                        </div>
                    )}
                    {loading ? (
                        loadingCart.map((el, i) => <div key={i} className='w-full bg-slate-200 h-32 my-2 animate-pulse'></div>)
                    ) : (
                        data.map((product) => (
                            <div key={product?._id} className='w-full bg-white h-32 my-2 border rounded grid grid-cols-[128px,1fr]'>
                                <img src={getImageUrl(product?.productId?.productImage?.[0])} className='w-32 h-32 object-scale-down p-2' alt="product"/>
                                <div className='px-4 py-2 relative'>
                                    <div className='absolute right-2 top-2 text-red-500 cursor-pointer' onClick={() => deleteCartProduct(product?._id)}><MdDelete size={22}/></div>
                                    <h2 className='text-lg font-semibold'>{product?.productId?.productName}</h2>
                                    <p className='text-red-600 font-bold'>{displayKSh(product?.productId?.sellingPrice)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {data.length > 0 && (
                    <div className='w-full max-w-sm bg-white p-4 shadow-md h-fit'>
                        <h2 className='bg-slate-800 text-white p-2 -mx-4 -mt-4 mb-4'>Order Summary</h2>
                        <div className='flex justify-between text-xl font-bold border-t pt-4'>
                            <span>Total</span><span>{displayKSh(totalPrice)}</span>
                        </div>
                        <Checkout cartItems={data} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;
