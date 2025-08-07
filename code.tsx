"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionHeading from "../SectionHeading"
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
}

const Products = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const brandId = searchParams.get('brandId');
  const keyword = searchParams.get('keyword');
  const subcategoryId = searchParams.get('subcategoryId');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params: Record<string, string | number> = {
          limit: 12,
          sort: '-price',
        };

        if (keyword) params['keyword'] = keyword;
        if (categoryId) params['category[in]'] = categoryId;
        if (brandId) params['brand'] = brandId;
        if (subcategoryId) params['subcategory'] = subcategoryId;

        const response = await axios.get(
          'https://ecommerce.routemisr.com/api/v1/products',
          { params }
        );
        setProducts(response.data.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || 'Failed to fetch products.';
          setError(message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId, keyword, subcategoryId]);

  if (loading) {
    return <div className="text-center py-8 text-[#A47864] animate-pulse">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-10 bg-[#faebd7]">
      <div className="container mx-auto px-4">
        <SectionHeading
          title={
            keyword
              ? `Search results for "${keyword}"`
              : subcategoryId
              ? 'Filtered by Subcategory'
              : categoryId
              ? 'Filtered by Category'
              : brandId
              ? 'Filtered by Brand'
              : 'All Products'
          }
          icon="🛍️"
        />
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <div
                  className={`
                    bg-white rounded-2xl shadow-md overflow-hidden border border-[#C0D6E4]
                    transform transition-all duration-300 ease-in-out hover:scale-105
                    cursor-pointer animate-zoom-in
                    relative group
                  `}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  {/* Badge "New" */}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    New
                  </span>

                  {/* Wishlist ❤️ */}
                  <button
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm z-10 hover:bg-[#A47864] hover:text-white transition"
                    title="Add to Wishlist"
                  >
                    ❤️
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col justify-between h-48">
                    <div>
                      <h3 className="text-lg font-semibold text-[#A47864] mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{product.category.name}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xl font-bold text-[#A47864]">
                        ${product.price.toFixed(2)}
                      </span>
                      <button className="bg-[#A47864] text-white py-1.5 px-4 rounded-full hover:bg-[#C0D6E4] hover:text-[#A47864] transition duration-300 text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;



"use client";
import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// This component is the modal content itself
const CartContent: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, updateProductQuantity } = useCart();
  const router = useRouter();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-700">Loading cart...</div>;
  }

  if (!cart || cart.products.length === 0) {
    return <div className="p-4 text-center text-gray-700">Your cart is empty.</div>;
  }

  const handleCheckout = () => {
    onClose(); // Close the modal
    router.push('/checkout');
  };

  return (
    <div className="p-6 h-full flex flex-col bg-[#faebd7]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#A47864]">Shopping Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {cart.products.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between p-4 rounded-lg shadow-md bg-[#C0D6E4]">
            <div className="flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={item.product.imageCover}
                  alt={item.product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#A47864]">{item.product.title}</h3>
                <p className="text-gray-600">Quantity: {item.count}</p>
                <p className="text-gray-800 font-bold">{item.product.price} EGP</p>
              </div>
            </div>
            {/* Quantity and Remove Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateProductQuantity(item.product._id, item.count + 1)}
                className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]"
              >
                +
              </button>
              <button
                onClick={() => updateProductQuantity(item.product._id, item.count - 1)}
                className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]"
              >
                -
              </button>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price & Checkout Button */}
      <div className="mt-6 pt-4 border-t-2 border-[#A47864]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#A47864]">Total:</h3>
          <span className="text-2xl font-bold text-[#A47864]">{cart.totalCartPrice} EGP</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full text-lg text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition bg-[#A47864]"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartContent;
