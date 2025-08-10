"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProductDetails {
  _id: string;
  title: string;
  description: string;
  imageCover: string;
  price: number;
  ratingsAverage: number;
  category: { name: string };
  brand: { name: string };
  images: string[];
}

const ProductPage: React.FC<any> = ({ params }) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${params.id}`);
        setProduct(response.data.data);
        setMainImage(response.data.data.imageCover);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || 'Failed to fetch product details.';
          setError(message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-16 text-[#A47864] text-2xl animate-pulse">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500 text-2xl">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-16 text-gray-500 text-2xl">Product not found.</div>;
  }

  return (
    <>
      <Header />
      <main className="py-12 bg-[#faebd7]">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl border-4 border-[#EAD8C0] shadow-lg">
                <Image
                  src={mainImage || product.imageCover}
                  alt={product.title}
                  fill
                  className="rounded-2xl object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pt-2 scrollbar-hide">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border-2 border-[#C0D6E4] hover:border-[#A47864] transition duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setMainImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} image ${index + 1}`}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center gap-4">
              <h1 className="text-2xl md:text-4xl font-bold text-[#A47864] mb-2">{product.title}</h1>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">{product.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
                <span className="text-2xl md:text-3xl font-semibold text-[#A47864]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-gray-600 text-sm">⭐ {product.ratingsAverage} / 5</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600 mt-4">
                <div className="bg-[#F3E9DD] px-3 py-1 rounded-full">
                  Category: {product.category.name}
                </div>
                <div className="bg-[#F3E9DD] px-3 py-1 rounded-full">
                  Brand: {product.brand.name}
                </div>
              </div>

              <button className="mt-6 bg-[#A47864] hover:bg-[#C0D6E4] hover:text-[#A47864] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out">
                Add to Cart
              </button>
              <button
                onClick={() => router.push('/products')}
                className="mt-3 text-[#A47864] hover:underline text-sm font-semibold self-start"
              >
                ← Back to Products
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;
