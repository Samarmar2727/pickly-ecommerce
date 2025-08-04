
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const keyword = searchParams.get('keyword')
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {

            try {
                  // select the url of api depend on paramaters
               const params: Record<string, string | number> = {
                // the main params
                    limit: 12,
                    sort: '-price'
                };
                 // search params
                if (keyword) {
                    params['keyword'] = keyword;
                }

                // Filtered params
                if (categoryId) {
                    params['category[in]'] = categoryId;
                }
                if (brandId) {
                    params['brand'] = brandId;
                }
                const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products',{ params }) 
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
    }, [categoryId, brandId, keyword]);

    if (loading) {
        return <div className="text-center py-8 text-[#A47864]">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="py-8 bg-[#faebd7]">
            <div className="container mx-auto px-4">
 {/*// Fetches products from the API. It can filter by category and brand, and also handles a search query.
 // Default parameters are set to limit the results and sort by price.*/ }
            <h2 className="text-3xl font-bold text-[#A47864] text-center mb-8">
                {keyword ? `Search results for "${keyword}"` : categoryId ? 'Filtered by Category' : brandId ? 'Filtered by Brand' : 'All Products'}
            </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Link key={product._id} href={`/products/${product._id}`}>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer border border-[#C0D6E4]">
                                <div className="relative w-full h-56">
                                    <Image
                                        src={product.imageCover}
                                        alt={product.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-xl"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-[#A47864] mb-2">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-[#A47864]">${product.price.toFixed(2)}</span>
                                        <button className="bg-[#A47864] text-white py-2 px-4 rounded-full hover:bg-[#C0D6E4] transition duration-300">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;