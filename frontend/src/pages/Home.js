import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      {/* <HorizontalCardProduct category={"baskets"} heading={"Top's baskets"}/> */}
      <HorizontalCardProduct category={"baskets"} heading={"Popular's baskets"}/>

      <VerticalCardProduct category={"handbags"} heading={"handbags"}/>
      <VerticalCardProduct category={"hats"} heading={"hats"}/>
      <VerticalCardProduct category={"mats"} heading={"mats"}/>
      <VerticalCardProduct category={"sandals"} heading={"sandals"}/>
      
    </div>
  )
}

export default Home