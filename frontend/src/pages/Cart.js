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
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const displayKSh = (num) => `KSh ${Number(num || 0).toLocaleString()}`

    const fetchData = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            
            if (!token) {
                setData([])
                setHasFetched(true)
                return
            }

            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                headers: {
                    "content-type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })

            const responseData = await response.json()
            if (responseData.success) {
                const validData = (responseData.data || []).filter(item => item.productId !== null)
                setData(validData)
            }
        } catch (error) {
            console.error("Cart Error:", error)
        } finally {
            setLoading(false)
            setHasFetched(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const increaseQty = async (id, qty) => {
        const token = localStorage.getItem('token')
        const headers = { "content-type": 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`
        
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            headers,
            body: JSON.stringify({ _id: id, quantity: qty + 1 })
        })
        const responseData = await response.json()
        if (responseData.success) fetchData()
    }

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const token = localStorage.getItem('token')
            const headers = { "content-type": 'application/json' }
            if (token) headers.Authorization = `Bearer ${token}`

            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                headers,
                body: JSON.stringify({ _id: id, quantity: qty - 1 })
            })
            const responseData = await response.json()
            if (responseData.success) fetchData()
        }
    }

    const deleteCartProduct = async (id) => {
        const token = localStorage.getItem('token')
        const headers = { "content-type": 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            headers,
            body: JSON.stringify({ _id: id })
        })
        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((prev, curr) => prev + (curr.quantity || 0), 0)
    const totalPrice = data.reduce((prev, curr) => {
        const unit = curr?.productId?.sellingPrice || curr?.productId?.price || 0
        return prev + ((curr.quantity || 0) * unit)
    }, 0)

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold my-4'>My Shopping Cart</h2>
            
            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
                <div className='w-full max-w-3xl'>
                    {hasFetched && data.length === 0 && !loading && (
                        <div className='bg-white p-10 text-center rounded shadow border border-slate-100'>
                            <div className='text-5xl mb-4'>🛒</div>
                            <p className='text-xl text-slate-500'>Your cart is empty</p>
                            <p className='text-slate-400 mt-2'>Add some items to your cart to see them here!</p>
                        </div>
                    )}

                    {loading ? (
                        loadingCart.map((el, index) => (
                            <div key={index} className='w-full bg-slate-200 h-32 my-2 animate-pulse rounded'></div>
                        ))
                    ) : (
                        data.map((product) => (
                            <div key={product?._id} className='w-full bg-white h-auto md:h-32 my-2 border border-slate-200 rounded grid grid-cols-[128px,1fr] shadow-sm'>
                                <div className='w-32 h-32 bg-slate-100 p-2'>
                                    <img src={getImageUrl(product?.productId?.productImage?.[0])} alt={product?.productId?.productName} className='w-full h-full object-scale-down mix-blend-multiply' />
                                </div>
                                <div className='px-4 py-2 relative flex flex-col justify-between'>
                                    <div className='absolute right-2 top-2 text-red-500 cursor-pointer hover:scale-110 transition-all' onClick={() => deleteCartProduct(product?._id)}>
                                        <MdDelete size={22} />
                                    </div>

                                    <div>
                                        <h2 className='text-lg font-semibold text-slate-800 line-clamp-1'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-slate-400 text-sm'>{product?.productId?.category}</p>
                                    </div>

                                    <div className='flex items-center justify-between mt-2'>
                                        <div className='flex items-center gap-3 border w-fit rounded'>
                                            <button className='px-3 py-1 hover:bg-red-600 hover:text-white transition-all' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                            <span className='font-semibold'>{product?.quantity}</span>
                                            <button className='px-3 py-1 hover:bg-red-600 hover:text-white transition-all' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-red-600 font-bold text-lg'>{displayKSh(product?.productId?.sellingPrice || product?.productId?.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className='w-full max-w-sm'>
                    {(data.length > 0 || loading) && (
                         <div className='bg-white rounded shadow-md overflow-hidden'>
                            <h2 className='text-white bg-slate-800 px-4 py-2 font-semibold'>Order Summary</h2>
                            <div className='p-4 space-y-3'>
                                <div className='flex items-center justify-between text-slate-600'>
                                    <p>Items Total ({totalQty})</p>
                                    <p>{displayKSh(totalPrice)}</p>
                                </div>
                                <hr />
                                <div className='flex items-center justify-between font-bold text-xl text-slate-800 pb-4'>
                                    <p>Total</p>
                                    <p>{displayKSh(totalPrice)}</p>
                                </div>

                                {data.length > 0 && (
                                    <Checkout 
                                        cartItems={data.map(item => ({
                                            productId: item?.productId?._id,
                                            name: item?.productId?.productName,
                                            price: item?.productId?.sellingPrice || item?.productId?.price || 0,
                                            quantity: item?.quantity,
                                            image: item?.productId?.productImage?.[0]
                                        }))} 
                                    />
                                )}
                            </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart;
