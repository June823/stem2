import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import getImageUrl from '../helpers/getImageUrl'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(SummaryApi.adminSummary.url, {
          method: SummaryApi.adminSummary.method,
          headers,
          // always include credentials so cookie-based auth works even when a token exists in localStorage
          credentials: 'include',
        })
        if (res.status === 401) {
          setSummary({ error: true, status: 401, message: 'Unauthorized — please sign in as admin.' })
          return
        }
        if (res.status === 403) {
          setSummary({ error: true, status: 403, message: 'Forbidden — admin access required.' })
          return
        }
        const data = await res.json()
        if (data && data.success) setSummary(data)
      } catch (err) {
        console.error('failed to fetch admin summary', err)
      }
    }

    fetchSummary()
  }, [])

  if (!summary) return <div>Loading admin summary...</div>

  if (summary?.error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-700">{summary.message}</p>
          <div className="mt-3">
            <a href="/login" className="text-blue-600 underline">Sign in</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-3xl font-bold">{summary.products}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-3xl font-bold">{summary.users}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Pending Orders</div>
          <div className="text-3xl font-bold">{summary.pendingOrders}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Recent Products</h3>
        <div className="space-y-2">
          {summary.recentProducts && summary.recentProducts.length > 0 ? (
            summary.recentProducts.map((p) => (
              <div key={p._id} className="p-3 bg-white rounded shadow flex items-center">
                <img
                  src={getImageUrl((p.productImage && p.productImage[0]) || '/placeholder.png')}
                  alt={p.productName}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div>
                  <div className="font-semibold">{p.productName}</div>
                  <div className="text-sm text-gray-500">{p.category} • ${p.price}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No recent products</div>
          )}
        </div>
      </div>
    </div>
  )
}
