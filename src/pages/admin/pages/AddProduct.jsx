import React, { useContext, useState } from 'react';
import myContext from '../../../context/data/myContext';
import { ref, getDownloadURL } from "firebase/storage";
import { fireDB, imgDB } from '../../../firebase/FirebaseConfig';
import { addDoc, collection } from "firebase/firestore";

function AddProduct() {
    const { products, setProducts } = useContext(myContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchImageUrl = async () => {
        const imageRef = ref(imgDB, `${products.category}/${products.title}.jpg`);
        
        try {
            const imageUrl = await getDownloadURL(imageRef);
            return imageUrl;
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                setError(`Image not found: ${products.title}`);
            } else {
                setError("Error fetching image. Please try again.");
            }
            console.error("Error fetching image:", error);
            return null;
        }
    };
    
    const handleAddProduct = async () => {
        if (!products.title || !products.price || !products.category) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setError(null);
        
        const imageUrl = await fetchImageUrl();
        if (imageUrl) {
            const updatedProduct = {
                ...products,
                imageUrl,
                description: products.description || "No description available."
            };
    
            try {
                const docRef = await addDoc(collection(fireDB, "products"), updatedProduct);
                alert("Product added successfully with ID: " + docRef.id);
                setProducts({ title: '', price: '', category: '', description: '', imageUrl: '' });
            } catch (error) {
                setError("Failed to add product. Please try again.");
                console.error("Error adding product:", error);
            }
        } else {
            setError("Could not fetch image. Please verify the product title and category.");
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
                            placeholder='Product Our price'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='price'
                            onChange={(e) => setProducts({ ...products, actualprice: e.target.value })}
                            value={products.actualprice}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product Actualprice'
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
