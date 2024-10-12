import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HeroSection.css'; // For custom styles

function HeroSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="banner-section">
      <Slider {...settings}>
        <div className="banner-slide">
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/299/835/original/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg"
            alt="Advertisement 1"
          />
        </div>
        <div className="banner-slide">
          <img
            src="src/assets/today harvest today delivery.png"
            alt="Advertisement 2"
          />
        </div>
      </Slider>
    </div>
  );
}

export default HeroSection;
