import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Leaf } from 'lucide-react';
import { deleteFromCart, incrementQuantity, decrementQuantity, clearCart} from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig.jsx';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import myContext from '../../context/data/myContext';

function Cart() {
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch = useDispatch();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const cartItems = useSelector((state) => state.cart);
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  // Constants for quantity management
  const MIN_QUANTITY = 0.25;
  const QUANTITY_STEP = 0.25;

  useEffect(() => {
    let tempAmount = 0;
    let tempWeight = 0;
    cartItems.forEach((item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || MIN_QUANTITY;
      const itemWeight = Number(item.weight) || 0;
      
      tempAmount += itemPrice * itemQuantity;
      tempWeight += itemWeight * itemQuantity;
    });
    setTotalAmount(tempAmount);
    setTotalWeight(tempWeight);
  }, [cartItems]);

  const grandTotal = totalAmount;

  const deleteFromCartHandler = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Item removed from cart');
  };

  const handleIncrement = (item) => {
    const newQuantity = Number((Number(item.quantity || MIN_QUANTITY) + QUANTITY_STEP).toFixed(2));
    dispatch(incrementQuantity({ ...item, quantity: newQuantity }));
  };

  const handleDecrement = (item) => {
    const currentQuantity = Number(item.quantity || MIN_QUANTITY);
    
    if (currentQuantity > MIN_QUANTITY) {
      const newQuantity = Number((currentQuantity - QUANTITY_STEP).toFixed(2));
      dispatch(decrementQuantity({ ...item, quantity: newQuantity }));
    } else {
      dispatch(deleteFromCart(item));
      toast.success('Item removed from cart');
    }
  };

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      toast.error("All fields are required", { position: "top-center", autoClose: 1000, theme: "colored" });
      return;
    }
  
    try {
      const addressInfo = {
        name,
        address,
        pincode,
        phoneNumber,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      };
  
      await addDoc(collection(fireDB, "orders"), { ...addressInfo, cartItems, totalAmount, grandTotal });
      toast.success("Order placed successfully!");
  
      dispatch(clearCart());
      localStorage.removeItem('cart');
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" style={{ 
        backgroundColor: mode === 'dark' ? '#282c34' : '', 
        color: mode === 'dark' ? 'white' : '' 
      }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-center">Your Fresh Basket</h1>
          </div>
          
          <div className="lg:flex lg:gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">Your basket is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4" style={{
                      backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '',
                      color: mode === 'dark' ? 'white' : ''
                    }}>
                      <div className="w-full sm:w-32 h-32 relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600" style={{ color: mode === 'dark' ? '#999' : '' }}>
                              Min. order: {MIN_QUANTITY}kg (±{QUANTITY_STEP}kg)
                            </p>
                          </div>
                          <button 
                            onClick={() => deleteFromCartHandler(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDecrement(item)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                              style={{ backgroundColor: mode === 'dark' ? '#444' : '' }}
                            >
                              -
                            </button>
                            <span className="w-20 text-center">
                              {Number(item.quantity || MIN_QUANTITY).toFixed(2)}kg
                            </span>
                            <button 
                              onClick={() => handleIncrement(item)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                              style={{ backgroundColor: mode === 'dark' ? '#444' : '' }}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold">
                            ₹{(Number(item.price) * Number(item.quantity || MIN_QUANTITY)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6" style={{
                backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '',
                color: mode === 'dark' ? 'white' : ''
              }}>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Weight</span>
                    <span>{totalWeight.toFixed(2)} kg</span>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Modal
                  name={name}
                  address={address}
                  pincode={pincode}
                  phoneNumber={phoneNumber}
                  setName={setName}
                  setAddress={setAddress}
                  setPincode={setPincode}
                  setPhoneNumber={setPhoneNumber}
                  cartItems={cartItems}
                  totalAmount={totalAmount}
                />
                
                <p className="text-sm text-gray-500 mt-4" style={{ color: mode === 'dark' ? '#999' : '' }}>
                  Free delivery on orders over 5kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;