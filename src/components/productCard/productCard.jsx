import React, { useContext, useEffect, useState } from 'react';
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

    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Added to cart');
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const filteredProducts = product.filter((obj) =>
        obj.title.toLowerCase().includes(searchkey.toLowerCase())
    );

    const vegetables = filteredProducts.filter(item => item.category === 'Vegetables');
    const leafyVegetables = filteredProducts.filter(item => item.category === 'Leafy Vegetables');

    const calculateDiscount = (actualPrice, price) => {
        const discount = ((actualPrice - price) / actualPrice) * 100;
        return Math.round(discount);
    };

    const ProductContainer = ({ title, products }) => {
        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-medium title-font mb-1"
                            style={{ color: mode === 'dark' ? 'white' : '' }}>
                            {title}
                        </h1>
                        <div className="h-1 w-16 bg-green-500 rounded"></div>
                    </div>

                    <button
                        onClick={() => navigate('/allproducts')}
                        className="inline-flex items-center text-green-500 hover:text-green-600 text-sm"
                    >
                        View All
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

                <div className="relative overflow-x-auto sm:overflow-x-hidden pb-4">
                    <div className="flex flex-nowrap sm:flex-wrap gap-2
                                  overflow-x-auto sm:overflow-x-visible
                                  scroll-smooth scrollbar-hide
                                  -mx-2 px-2 sm:mx-0 sm:px-0
                                  sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                        {products.map((item) => {
                            const { title, price, imageUrl, id, actualprice } = item;
                            const discountPercentage = calculateDiscount(actualprice, price);

                            return (
                                <div
                                    key={id}
                                    onClick={() => window.location.href = `/productinfo/${id}`}
                                    className="w-[160px] sm:w-full flex-none sm:flex-auto cursor-pointer"
                                >
                                    <div className="h-full border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                                        style={{
                                            backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                                            color: mode === 'dark' ? 'white' : '',
                                        }}>
                                        <div className="relative pt-[100%]">
                                            <img
                                                className="absolute top-0 left-0 w-full h-full object-cover p-1 rounded-lg hover:scale-105 transition-transform duration-200"
                                                src={imageUrl}
                                                alt={title}
                                            />
                                            <div
                                                className="absolute top-1 right-1 z-10 bg-gradient-to-r from-green-500 to-green-700 text-white px-1.5 py-0.5 rounded text-xs shadow-sm flex items-center space-x-0.5"
                                            >
                                                <span className="material-icons text-yellow-400 text-xs">star</span>
                                                <span>{discountPercentage}% OFF</span>
                                            </div>
                                        </div>

                                        <div className="p-2 text-center">
                                            <h2 className="text-xs font-medium text-green-600">
                                                Fresh Pick
                                            </h2>
                                            <h1 className="text-xs sm:text-sm font-medium truncate px-1"
                                                style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                {title}
                                            </h1>
                                            <div className="flex justify-center items-center gap-1 my-1">
                                                <p className="text-sm font-bold text-green-600">
                                                    ₹{price}
                                                </p>
                                                <p className="text-xs text-gray-500 line-through">
                                                    ₹{actualprice}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addCart(item);
                                                }}
                                                className="w-full py-1 px-2 text-xs bg-gradient-to-r from-green-400 to-green-500 text-white rounded hover:from-green-500 hover:to-green-600 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:ring-opacity-50"
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
                </div>
            </div>
        );
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-2 py-4 md:py-8 mx-auto">
                <ProductContainer
                    title="Fresh Vegetables"
                    products={vegetables}
                />
                <ProductContainer
                    title="Leafy Vegetables"
                    products={leafyVegetables}
                />
            </div>
        </section>
    );
}

export default ProductCard;