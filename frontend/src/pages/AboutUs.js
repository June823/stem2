import React from 'react'
import { Link } from 'react-router-dom'

export default function AboutUs(){
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">About StemToStyle</h1>
        <p className="text-sm text-gray-600 mt-2">A sustainable digital marketplace connecting Kenyan artisans with buyers through upcycled and eco-friendly products.</p>
      </div>

      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Story</h2>
        <p className="text-gray-700 leading-relaxed">StemToStyle began as a research-driven project and community initiative to tackle environmental waste, unemployment and limited market access by providing an innovative digital solution that empowers local artisans. By combining sustainable design practices with accessible e-commerce tools, StemToStyle helps artisans transform waste materials into valuable products and reach buyers they would otherwise miss.</p>
      </section>

      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Why it matters</h2>
        <p className="text-gray-700 leading-relaxed">This study is significant in addressing environmental waste, unemployment, and limited market access by using an innovative digital solution. It contributes to global goals for sustainable development, particularly <strong>SDG 8</strong> (Decent Work and Economic Growth) and <strong>SDG 12</strong> (Responsible Consumption and Production) (UNDP, 2023). It also encourages circular economy practices in Kenya and supports local artisans through inclusive digital empowerment (FAO, 2023). The project is timely, aligns with eco-conscious trends, and presents a unique opportunity to blend sustainable design with technology for economic and environmental transformation.</p>
      </section>

      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Founder</h2>
        <p className="text-gray-700">Rodgers Oyugi</p>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-gray-700 mb-2">Phone: <a className="text-blue-600 underline" href="tel:+254740117880">0740 117 880</a></p>
        <p className="text-gray-700">Email: <a className="text-blue-600 underline" href="mailto:idahjunecherotich@gmail.com">idahjunecherotich@gmail.com</a></p>
      </section>

      <div className="mt-6 text-sm text-gray-500">
        <Link to="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    </div>
  )
}
