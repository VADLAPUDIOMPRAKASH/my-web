import React, { useContext, useState } from 'react';
import myContext from '../../../context/data/myContext';
import { ref, getDownloadURL } from "firebase/storage";
import { fireDB, imgDB } from '../../../firebase/FirebaseConfig';
import { addDoc, collection } from "firebase/firestore";

function AddProduct() {
    const context = useContext(myContext);
    const { products, setProducts } = context;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Function to get the image URL from Firebase Storage
    const fetchImageUrl = async () => {
        const imageRef = ref(imgDB, `${products.category}/${products.title}.jpg`);
        
        try {
            const imageUrl = await getDownloadURL(imageRef);
            return imageUrl;
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.error("Image not found:", products.title);
                alert("Image not found in Firebase Storage. Please ensure it exists.");
            } else {
                console.error("Error fetching image:", error);
            }
            return null;
        }
    };
    
    // Updated addProduct function to include the image URL
    const handleAddProduct = async () => {
        console.log("Fetching image URL for:", products.title); // Debugging log
        setLoading(true);
        setError(null);
        
        const imageUrl = await fetchImageUrl();
        if (imageUrl) {
            console.log("Image URL obtained:", imageUrl); // Debugging log
            
            // Add the image URL to the product object
            const updatedProduct = { ...products, imageUrl };
    
            try {
                // Upload the updated product to Firestore
                const docRef = await addDoc(collection(fireDB, "products"), updatedProduct);
                console.log("Product added with ID: ", docRef.id);
                alert("Product added successfully!");
                
                // Optionally, reset the form
                setProducts({ title: '', price: '', category: '', description: '', imageUrl: '' });
    
            } catch (error) {
                console.error("Error adding product:", error);
                setError("Failed to add product. Please try again.");
            }
        } else {
            console.error("Could not fetch image. Please check the title and category.");
            alert("Failed to fetch image. Please verify the product title and category.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-gray-800 px-10 py-10 rounded-xl'>
                    <div className="">
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Product</h1>
                    </div>
                    <div>
                        <input
                            type="text"
                            onChange={(e) => setProducts({ ...products, title: e.target.value })}
                            value={products.title}
                            name='title'
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product title'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='price'
                            onChange={(e) => setProducts({ ...products, price: e.target.value })}
                            value={products.price}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product price'
                        />
                    </div>
                
                    <div>
                        <input
                            type="text"
                            name='category'
                            onChange={(e) => setProducts({ ...products, category: e.target.value })}
                            value={products.category}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product category (e.g., vegetable or leafy vegetable)'
                        />
                    </div>
                    <div>
                        <textarea
                            cols="30" rows="10"
                            name='description'
                            onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            value={products.description}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product description'
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className='flex justify-center mb-3'>
                        <button
                            onClick={handleAddProduct}
                            className='bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg'
                            disabled={loading}>
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
