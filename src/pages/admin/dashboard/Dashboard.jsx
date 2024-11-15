import React, { useContext, useEffect, useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { getDocs, collection } from 'firebase/firestore';
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Dashboard() {
    const context = useContext(myContext);
    const { mode } = context;

    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const cardStyle = {
        backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
        color: mode === 'dark' ? 'white' : '',
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const productsSnapshot = await getDocs(collection(fireDB, 'products'));
                setProductCount(productsSnapshot.size);

                const ordersSnapshot = await getDocs(collection(fireDB, 'orders'));
                setOrderCount(ordersSnapshot.size);

                const usersSnapshot = await getDocs(collection(fireDB, 'users'));
                setUserCount(usersSnapshot.size);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    const navigate = useNavigate(); // Initialize navigate

    return (
        <section className="text-gray-600 body-font mt-10 mb-10 ">
            <div className="container px-5 mx-auto mb-10 ">
                <div className="flex flex-wrap justify-center item-center -m-4 text-center">

                    {/* Total Products */}
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-purple-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] bg-gray-100 border-gray-300 px-4 py-3 rounded-xl"
                            style={cardStyle}
                        >
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block">
                                <FaUserTie size={50} />
                            </div>
                            <h2
                                className="title-font font-medium text-3xl text-black fonts1"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                {productCount}
                            </h2>
                            <p
                                className="text-purple-500 font-bold"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                Total Products
                            </p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-purple-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] bg-gray-100 border-gray-300 px-4 py-3 rounded-xl"
                            style={cardStyle}
                        >
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block">
                                <FaUserTie size={50} />
                            </div>
                            <h2
                                className="title-font font-medium text-3xl text-black fonts1"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                {orderCount}
                            </h2>
                            <p
                                className="text-purple-500 font-bold"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                Total Orders
                            </p>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-purple-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] bg-gray-100 border-gray-300 px-4 py-3 rounded-xl"
                            style={cardStyle}
                        >
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block">
                                <FaUserTie size={50} />
                            </div>
                            <h2
                                className="title-font font-medium text-3xl text-black fonts1"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                {userCount}
                            </h2>
                            <p
                                className="text-purple-500 font-bold"
                                style={{ color: mode === 'dark' ? 'white' : '' }}
                            >
                                Total Users
                            </p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/')} // Navigate to home screen
                    className="mt-5 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Go to Home
                </button>
                <DashboardTab />
            </div>
        </section>
    );
}

export default Dashboard;
