import React, { useContext } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import HeroSection from '../../components/heroSection/HeroSection';
import ProductCard from '../../components/productCard/productCard';
import Track from '../../components/track/Track';
import Testimonial from '../../components/testimonial/Testimonial';
import Filter from '../../components/filter/Filter';

function Home() {
  
  return (
    <Layout>
      <Filter />
      <HeroSection/>
      <ProductCard/>
      <Track/>
      <Testimonial/>
      
    </Layout>
  );
}

export default Home;
