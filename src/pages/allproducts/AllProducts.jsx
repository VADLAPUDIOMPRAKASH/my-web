import React, { useContext, useEffect, useState } from 'react';
import Filter from '../../components/filter/Filter';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';

function Allproducts() {
    const context = useContext(myContext);
    const { mode, product, searchkey, setSearchkey } = context;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const addCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Added to cart');
    };

    // Calculate discount percentage
    const calculateDiscount = (actualPrice, price) => {
        const discount = ((actualPrice - price) / actualPrice) * 100;
        return Math.round(discount);
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get unique categories
    const categories = ['all', ...new Set(product.map(item => item.category))];

    // Filter and sort products
    const filteredAndSortedProducts = product
        .filter((obj) => {
            const matchesSearch = obj.title.toLowerCase().includes(searchkey.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || obj.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'discount':
                    return calculateDiscount(b.actualprice, b.price) - calculateDiscount(a.actualprice, a.price);
                default:
                    return 0;
            }
        });

    return (
        <Layout>
            <Filter />
            <section className="text-gray-600 body-font">
                <div className="container px-4 py-6 md:py-12 mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div className="mb-4 md:mb-0">
                            <h1 
                                className="sm:text-3xl text-xl font-medium title-font mb-2 text-gray-900" 
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                All Products
                            </h1>
                            <div className="h-1 w-20 bg-green-500 rounded"></div>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                                style={{
                                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                                    color: mode === 'dark' ? 'white' : '',
                                }}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                                style={{
                                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                                    color: mode === 'dark' ? 'white' : '',
                                }}
                            >
                                <option value="default">Sort by</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="discount">Highest Discount</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAndSortedProducts.map((item) => {
                            const { title, price, imageUrl, id, actualprice } = item;
                            const discountPercentage = calculateDiscount(actualprice, price);

                            return (
                                <div
                                    key={id}
                                    className="relative group cursor-pointer"
                                    onClick={() => window.location.href = `/productinfo/${id}`}
                                >
                                    <div 
                                        className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                        style={{
                                            backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                                            color: mode === 'dark' ? 'white' : '',
                                        }}
                                    >
                                        {/* Image Container */}
                                        <div className="relative pt-[100%] overflow-hidden">
                                            <img
                                                className="absolute top-0 left-0 w-full h-full object-cover p-2 rounded-xl 
                                                         group-hover:scale-105 transition-transform duration-200"
                                                src={imageUrl}
                                                alt={title}
                                            />
                                            {/* Discount Badge */}
                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                {discountPercentage}% OFF
                                            </div>
                                        </div>
                                        
                                        {/* Content Container */}
                                        <div className="p-3 text-center">
                                            <h2 className="text-xs font-medium mb-1 text-green-600">
                                                {item.category}
                                            </h2>
                                            <h1 
                                                className="text-sm md:text-base font-medium mb-1 truncate px-2"
                                                style={{ color: mode === 'dark' ? 'white' : '' }}
                                            >
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
                                                className="w-full py-1.5 px-2 text-xs md:text-sm bg-green-500 text-white rounded-lg 
                                                         hover:bg-green-600 transition-colors duration-200 focus:outline-none 
                                                         focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredAndSortedProducts.length === 0 && (
                        <div className="text-center py-12">
                            <h2 
                                className="text-xl font-medium text-gray-600" 
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                No products found
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default Allproducts;