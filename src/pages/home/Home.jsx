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
      {/* Add padding to prevent content from being obscured by the fixed navbar */}
      <div style={{ paddingTop: '60px' }}> {/* Adjust the height if needed */}
        <Filter />
        <HeroSection />
        <ProductCard />
        <Track />
        <Testimonial />
      </div>
    </Layout>
  );
}

export default Home;
