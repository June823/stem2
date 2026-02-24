import React from 'react'

const AboutUs = () => {
  return (
    <div className='container mx-auto p-4 pt-24 min-h-[80vh]'>
      <div className='bg-white p-6 md:p-10 shadow-md rounded-md max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-red-600 mb-6'>About Our Store</h1>
        <p className='text-slate-600 leading-relaxed mb-4 text-lg'>
          Welcome to **Stem2**, your premier destination for high-quality baskets and apparel. 
          Founded by IT students at Kabarak University, this platform was built to bridge the gap between 
          traditional Kenyan craftsmanship and modern e-commerce technology.
        </p>
        <div className='grid md:grid-cols-2 gap-6 mt-8'>
            <div className='border-l-4 border-red-600 pl-4'>
                <h3 className='font-bold text-xl'>Our Mission</h3>
                <p className='text-slate-500'>To empower local artisans by providing a digital marketplace that reaches every corner of Kenya.</p>
            </div>
            <div className='border-l-4 border-red-600 pl-4'>
                <h3 className='font-bold text-xl'>Our Vision</h3>
                <p className='text-slate-500'>To become the leading MERN-stack powered retail experience in East Africa.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default AboutUs
