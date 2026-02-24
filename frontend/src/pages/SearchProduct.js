import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Using useCallback or a standard function is fine here
    const fetchProduct = async () => {
        try {
            setLoading(true)
            // query.search contains the "?q=item" string
            const response = await fetch(SummaryApi.searchProduct.url + query.search)
            const dataResponse = await response.json()
            
            if (dataResponse.success) {
                // ✅ FILTER: Only show products that are not marked as deleted
                const activeProducts = (dataResponse.data || []).filter(p => !p.deleted)
                setData(activeProducts)
            } else {
                setData([])
            }
        } catch (error) {
            console.error("Search Error:", error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    // Trigger search whenever the URL query changes
    useEffect(() => {
        fetchProduct()
    }, [query])

    return (
        <div className='container mx-auto p-4'>
            {/* Loading State */}
            {
                loading && (
                    <div className='flex justify-center items-center min-h-[200px]'>
                         <p className='text-lg text-slate-500 animate-pulse'>Searching for products...</p>
                    </div>
                )
            }

            {/* Results Count */}
            {!loading && (
                <p className='text-lg font-semibold my-3'>
                    {data.length === 0 ? "No results found" : `Search Results : ${data.length}`}
                </p>
            )}

            {/* Empty State */}
            {
                data.length === 0 && !loading && (
                    <div className='bg-white shadow-md rounded-lg p-10 flex flex-col items-center justify-center border border-slate-100'>
                        <div className='text-5xl mb-4'>🔍</div>
                        <p className='text-xl font-medium text-slate-600'>We couldn't find matches for "{new URLSearchParams(query.search).get('q')}"</p>
                        <p className='text-slate-400 mt-2 text-center'>Check your spelling or try searching for a more general term like "Fiber" or "Cable".</p>
                    </div>
                )
            }

            {/* Grid Display */}
            {
                data.length !== 0 && !loading && (
                    <VerticalCard loading={loading} data={data}/>
                )
            }

        </div>
    )
}

export default SearchProduct
