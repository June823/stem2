import React from 'react'

const Contact = () => {
  return (
    <div className='container mx-auto p-4 pt-24 mb-10'>
      <div className='max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-white p-6 md:p-10 shadow-lg rounded-xl'>
        <div>
          <h2 className='text-3xl font-bold text-red-600 mb-4'>Get In Touch</h2>
          <p className='text-slate-600 mb-6'>Have questions about our baskets or your order? Send us a message and we will respond within 24 hours.</p>
          <div className='space-y-4 text-slate-700'>
            <p><strong>Email:</strong> idahjunecherotich@gmail.com</p>
            <p><strong>Phone:</strong> +254 740117880</p>
            <p><strong>Address:</strong> Kabarak University, Nakuru-Eldama Ravine Rd.</p>
          </div>
        </div>
        <form className='grid gap-4' onSubmit={(e) => e.preventDefault()}>
          <input type='text' placeholder='Your Name' className='w-full p-3 border rounded bg-slate-50 outline-none focus:border-red-600'/>
          <input type='email' placeholder='Email Address' className='w-full p-3 border rounded bg-slate-50 outline-none focus:border-red-600'/>
          <textarea rows='5' placeholder='Your Message' className='w-full p-3 border rounded bg-slate-50 outline-none focus:border-red-600'></textarea>
          <button className='bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition-all'>Send Message</button>
        </form>
      </div>
    </div>
  )
}
export default Contact
