import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

function Layout({ children }) {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="content pt-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
