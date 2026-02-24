const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasFetched, setHasFetched] = useState(false) // ✅ Tracks if we actually talked to the DB
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const displayKSh = (num) => `KSh ${Number(num || 0).toLocaleString()}`

    const fetchData = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            
            // If no token exists, the user isn't logged in, so cart is definitely 0
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
                // Only keep products that actually exist in the database
                const validData = (responseData.data || []).filter(item => item.productId !== null)
                setData(validData)
            }
        } catch (error) {
            console.error("Cart Error:", error)
        } finally {
            setLoading(false)
            setHasFetched(true) // ✅ Now we know for sure what the DB says
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // ... (increaseQty, decreaseQty, deleteCartProduct functions remain the same)

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-bold my-4'>My Shopping Cart</h2>
            
            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
                <div className='w-full max-w-3xl'>
                    
                    {/* ✅ FIX: Only show "Empty" if loading is finished AND we have zero items */}
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
                                {/* ... Product Item JSX ... */}
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Section */}
                <div className='w-full max-w-sm'>
                    {/* Only show summary if we have items or are still loading */}
                    {(data.length > 0 || loading) && (
                         <div className='bg-white rounded shadow-md overflow-hidden'>
                            {/* ... Summary Content ... */}
                         </div>
                    )}
                </div>
            </div>
        </div>
    )
}


    return (
        <div className='container mx-auto p-4'>
            {/* ... your JSX ... */}
        </div>
    )
}

export default Cart; // <--- Ensure this is exactly like this
