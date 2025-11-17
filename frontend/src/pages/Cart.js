import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import getImageUrl from '../helpers/getImageUrl';
import Checkout from '../components/Checkout' // ✅ use Checkout.js

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            headers: (() => {
                const token = localStorage.getItem('token')
                const h = { "content-type": 'application/json' }
                if (token) h.Authorization = `Bearer ${token}`
                return h
            })(),
            credentials: localStorage.getItem('token') ? undefined : 'include',
        })

        const responseData = await response.json()
        if (responseData.success) setData(responseData.data)
    }

    useEffect(() => {
        setLoading(true)
        fetchData().finally(() => setLoading(false))
    }, [])

    const increaseQty = async (id, qty) => {
        const token = localStorage.getItem('token')
        const headers = { "content-type": 'application/json' }
        const options = { method: SummaryApi.updateCartProduct.method, headers }
        if (!token) options.credentials = 'include'
        else headers.Authorization = `Bearer ${token}`
        options.body = JSON.stringify({ _id: id, quantity: qty + 1 })

        const response = await fetch(SummaryApi.updateCartProduct.url, options)
        const responseData = await response.json()
        if (responseData.success) fetchData()
    }

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const token = localStorage.getItem('token')
            const headers = { "content-type": 'application/json' }
            const options = { method: SummaryApi.updateCartProduct.method, headers }
            if (!token) options.credentials = 'include'
            else headers.Authorization = `Bearer ${token}`
            options.body = JSON.stringify({ _id: id, quantity: qty - 1 })

            const response = await fetch(SummaryApi.updateCartProduct.url, options)
            const responseData = await response.json()
            if (responseData.success) fetchData()
        }
    }

    const deleteCartProduct = async (id) => {
        const token = localStorage.getItem('token')
        const headers = { "content-type": 'application/json' }
        const options = { method: SummaryApi.deleteCartProduct.method, headers }
        if (!token) options.credentials = 'include'
        else headers.Authorization = `Bearer ${token}`
        options.body = JSON.stringify({ _id: id })

        const response = await fetch(SummaryApi.deleteCartProduct.url, options)
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
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && <p className='bg-white py-5'>No Data</p>}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart.map((el, index) => (
                            <div key={index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
                        ))
                    ) : (
                        data.map((product) => {
                            if (!product?.productId) {
                                return (
                                    <div key={product?._id + "-removed"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] items-center'>
                                        <div className='w-32 h-32 flex items-center justify-center bg-slate-100 text-sm text-slate-500'>Removed</div>
                                        <div className='px-4 py-2 relative'>
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete />
                                            </div>
                                            <h2 className='text-lg lg:text-xl'>Product removed</h2>
                                            <p className='capitalize text-slate-500'>This product is no longer available.</p>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={() => deleteCartProduct(product?._id)}>Remove from cart</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div key={product?._id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                    <div className='w-32 h-32 bg-slate-200'>
                                        <img src={getImageUrl(product?.productId?.productImage?.[0])} alt={product?.productId?.productName} className='w-full h-full object-scale-down mix-blend-multiply' />
                                    </div>
                                    <div className='px-4 py-2 relative'>
                                        <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                            <MdDelete />
                                        </div>

                                        <h2 className='text-lg lg:text-xl'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-slate-500'>{product?.productId?.category}</p>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice || product?.productId?.price)}</p>
                                            <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency((product?.productId?.sellingPrice || product?.productId?.price || 0) * (product?.quantity || 0))}</p>
                                        </div>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                            <span>{product?.quantity}</span>
                                            <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {loading ? (
                        <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
                    ) : (
                        <div className='h-36 bg-white'>
                            <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>

                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Total Price</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>

                            {/* ✅ Stripe Checkout */}
                            <Checkout
                                cartItems={data.map(item => ({
                                    name: item?.productId?.productName,
                                    price: item?.productId?.sellingPrice || item?.productId?.price || 0,
                                    quantity: item?.quantity || 1
                                }))}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart
