// src/app/products/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';

// تحديد نوع البيانات للمنتج
interface ProductDetails {
    _id: string;
    title: string;
    description: string;
    imageCover: string;
    price: number;
    ratingsAverage: number;
    category: {
        name: string;
    };
    brand: {
        name: string;
    };
    images: string[];
}

// Props interface لـ page component
interface ProductPageProps {
    params: {
        id: string;
    };
}

const ProductPage = ({ params }: ProductPageProps) => {
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // استخدام الـ ID من الـ URL لجلب بيانات منتج واحد
                const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${params.id}`);
                setProduct(response.data.data);
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
    }, [params.id]); // إعادة جلب البيانات عند تغير الـ ID

    if (loading) {
        return <div className="text-center py-16 text-[#A47864] text-2xl">Loading product details...</div>;
    }

    if (error) {
        return <div className="text-center py-16 text-red-500 text-2xl">Error: {error}</div>;
    }

    if (!product) {
        return <div className="text-center py-16 text-gray-500 text-2xl">Product not found.</div>;
    }

    return (
        <main className="py-12 bg-[#faebd7]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow-lg">
                    {/* جزء عرض الصور */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-96">
                            <Image 
                                src={product.imageCover} 
                                alt={product.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-xl" 
                            />
                        </div>
                        {/* معرض الصور المصغرة */}
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 flex-shrink-0 border-2 border-[#C0D6E4] rounded-lg">
                                    <Image 
                                        src={img} 
                                        alt={`${product.title} image ${index + 1}`} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        className="rounded-lg" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* جزء التفاصيل */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-bold text-[#A47864] mb-2">{product.title}</h1>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-[#A47864]">${product.price.toFixed(2)}</span>
                            <span className="ml-auto text-gray-500">Rating: {product.ratingsAverage} ★</span>
                        </div>
                        <div className="flex items-center mb-4 text-gray-500 text-sm">
                            <span className="mr-4">Category: {product.category.name}</span>
                            <span>Brand: {product.brand.name}</span>
                        </div>
                        <button className="bg-[#A47864] text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-[#C0D6E4] transition duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductPage;