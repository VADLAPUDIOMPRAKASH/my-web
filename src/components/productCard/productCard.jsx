import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';

function ProductCard() {
    const context = useContext(myContext);
    const { mode, product, searchkey } = context;
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const navigate = useNavigate();

    // States for each category's current slide
    const [vegetablesSlide, setVegetablesSlide] = useState(0);
    const [leafyVegetablesSlide, setLeafyVegetablesSlide] = useState(0);

    // Refs for touch handling
    const vegetablesRef = useRef(null);
    const leafyVegetablesRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);
    const isHorizontalSwipe = useRef(false);
    const startTranslateX = useRef(0);
    const currentTranslateX = useRef(0);
    const minSwipeDistance = 50; // Minimum distance for a swipe to register

    // Add to cart
    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Added to cart');
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Filter products by search and category
    const filteredProducts = product.filter((obj) =>
        obj.title.toLowerCase().includes(searchkey.toLowerCase())
    );

    const vegetables = filteredProducts.filter(item => item.category === 'Vegetables');
    const leafyVegetables = filteredProducts.filter(item => item.category === 'Leafy Vegetables');

    const itemsPerSlide = {
        mobile: 4,
        desktop: 4
    };

    // Calculate discount percentage
    const calculateDiscount = (actualPrice, price) => {
        const discount = ((actualPrice - price) / actualPrice) * 100;
        return Math.round(discount);
    };

    // Touch handling functions
    const handleTouchStart = (e, ref) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isDragging.current = false;
        isHorizontalSwipe.current = false;
        startTranslateX.current = currentTranslateX.current;

        if (ref.current) {
            ref.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e, ref, totalSlides) => {
        if (isDragging.current && !isHorizontalSwipe.current) {
            return; // Let the page scroll if we haven't determined it's a horizontal swipe
        }

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - touchStartX.current;
        const deltaY = currentY - touchStartY.current;

        // If we haven't determined the swipe direction yet
        if (!isDragging.current) {
            // Check if the swipe is more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                isDragging.current = true;
                isHorizontalSwipe.current = true;
                e.preventDefault(); // Prevent page scrolling only for horizontal swipes
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
                // It's a vertical swipe, let the page handle it
                return;
            }
        }

        if (isDragging.current && isHorizontalSwipe.current) {
            const newTranslate = startTranslateX.current + deltaX;
            const maxTranslate = 0;
            const minTranslate = -(totalSlides - 1) * 100;

            currentTranslateX.current = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));

            if (ref.current) {
                ref.current.style.transform = `translateX(${currentTranslateX.current}%)`;
            }
        }
    };

    const handleTouchEnd = (ref, totalSlides, setCurrentSlide) => {
        if (!isDragging.current || !isHorizontalSwipe.current) return;

        touchEndX.current = event.changedTouches[0].clientX;
        const deltaX = touchEndX.current - touchStartX.current;

        if (Math.abs(deltaX) > minSwipeDistance) {
            if (ref.current) {
                ref.current.style.transition = 'transform 300ms ease-in-out';
            }

            const slideWidth = 100;
            const nearestSlide = Math.round(Math.abs(currentTranslateX.current) / slideWidth);
            setCurrentSlide(Math.min(totalSlides - 1, Math.max(0, nearestSlide)));

            currentTranslateX.current = -(nearestSlide * 100);
            if (ref.current) {
                ref.current.style.transform = `translateX(${currentTranslateX.current}%)`;
            }
        }

        isDragging.current = false;
        isHorizontalSwipe.current = false;
    };

    const ProductContainer = ({ title, products, carouselRef, currentSlide, setCurrentSlide }) => {
        const totalSlides = Math.ceil(products.length / itemsPerSlide.desktop);

        return (
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900"
                            style={{ color: mode === 'dark' ? 'white' : '' }}>
                            {title}
                        </h1>
                        <div className="h-1 w-20 bg-green-500 rounded"></div>
                    </div>

                    {/* Moved View More button here */}
                    <button
                        onClick={() => navigate('/allproducts')}
                        className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors duration-200"
                    >
                        <span className="text-sm font-medium">View All</span>
                        <svg
                            className="w-5 h-5 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>

                <div className="relative overflow-hidden touch-pan-y">
                    <div
                        ref={carouselRef}
                        className="flex"
                        onTouchStart={(e) => handleTouchStart(e, carouselRef)}
                        onTouchMove={(e) => handleTouchMove(e, carouselRef, totalSlides)}
                        onTouchEnd={() => handleTouchEnd(carouselRef, totalSlides, setCurrentSlide)}
                        style={{
                            transition: 'transform 300ms ease-in-out',
                        }}
                    >
                        {products.map((item) => {
                            const { title, price, imageUrl, id, actualprice } = item;
                            const discountPercentage = calculateDiscount(actualprice, price);

                            return (
                                <div
                                    key={id}
                                    onClick={() => window.location.href = `/productinfo/${id}`}
                                    className="w-1/2 md:w-1/4 p-2 flex-shrink-0 cursor-pointer"
                                >
                                    <div className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                        style={{
                                            backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                                            color: mode === 'dark' ? 'white' : '',
                                        }}>
                                        <div className="relative pt-[100%]">
                                            <img
                                                className="absolute top-0 left-0 w-full h-full object-cover p-2 rounded-xl hover:scale-105 transition-transform duration-200"
                                                src={imageUrl}
                                                alt={title}
                                            />
                                            {/* Discount Badge */}
                                            <div
                                                className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold px-2 py-1 rounded text-xs sm:text-sm shadow-sm flex items-center space-x-1"
                                                aria-label={`Get ${discountPercentage}% off on fresh vegetables`}
                                            >
                                                <span className="material-icons text-yellow-400 text-xs sm:text-sm">star</span>
                                                <span className="text-xs sm:text-sm">{discountPercentage}% OFF</span>
                                            </div>




                                        </div>

                                        <div className="p-3 text-center">
                                            <h2 className="text-xs font-medium mb-1 text-green-600">
                                                Fresh Pick
                                            </h2>
                                            <h1 className="text-sm md:text-base font-medium mb-1"
                                                style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                {title}
                                            </h1>
                                            <div className="flex justify-center items-center gap-2 mb-2">
                                                <p className="text-sm md:text-base font-bold text-green-600">
                                                    ₹{price}
                                                </p>
                                                <p className="text-sm text-gray-500 line-through">
                                                    ₹{actualprice}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addCart(item);
                                                }}
                                                className="w-full py-1.5 px-2 text-xs md:text-sm bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                                aria-label={`Add ${item.name} to cart`}
                                            >
                                                Add To Cart
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-4 bg-green-500' : 'w-2 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-4 py-6 md:py-12 mx-auto">
                <ProductContainer
                    title="Fresh Vegetables"
                    products={vegetables}
                    carouselRef={vegetablesRef}
                    currentSlide={vegetablesSlide}
                    setCurrentSlide={setVegetablesSlide}
                />

                <ProductContainer
                    title="Leafy Vegetables"
                    products={leafyVegetables}
                    carouselRef={leafyVegetablesRef}
                    currentSlide={leafyVegetablesSlide}
                    setCurrentSlide={setLeafyVegetablesSlide}
                />
            </div>
        </section>
    );
}

export default ProductCard;