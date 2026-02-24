import React from 'react'
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa'

const Services = () => {
  const services = [
    { icon: <FaTruck/>, title: "Nationwide Delivery", desc: "Fast and reliable shipping to all 47 counties in Kenya." },
    { icon: <FaShieldAlt/>, title: "Secure Payments", desc: "Safe transactions via M-Pesa and encrypted card processing." },
    { icon: <FaHeadset/>, title: "24/7 Support", desc: "Our customer care team is always available to assist you." },
    { icon: <FaUndo/>, title: "Easy Returns", desc: "Not satisfied? Return your product within 7 days for a full refund." }
  ]

  return (
    <div className='container mx-auto p-4 pt-24'>
      <h1 className='text-3xl font-bold text-center text-slate-800 mb-10'>Our Services</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {services.map((s, idx) => (
          <div key={idx} className='bg-white p-8 shadow-sm rounded-lg text-center hover:shadow-md transition-all border-t-4 border-red-600'>
            <div className='text-4xl text-red-600 flex justify-center mb-4'>{s.icon}</div>
            <h3 className='font-bold text-xl mb-2'>{s.title}</h3>
            <p className='text-slate-500'>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Services
