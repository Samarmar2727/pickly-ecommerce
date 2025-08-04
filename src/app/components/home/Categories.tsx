"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const Categories = () => {
  interface Category {
  _id: string;
  name: string;
  image: string;
}
   
   const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
   

    useEffect(() => {
        const fetchCategories = async () => {
            try {
             
                const response = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
                setCategories(response.data.data);
                setLoading(false);
           } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                  const message = err.response?.data?.message || 'Failed to fetch categories.';
                    setError(message); 
                } else {
                
                    setError('An unexpected error occurred.'); 
                }
            } finally {
                setLoading(false); 
            }
        };

        fetchCategories();
    }, []);

   
    if (loading) {
        return <div className="text-center py-8 text-[#A47864]">Loading categories...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="py-8 bg-[#faebd7]"> 
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-[#A47864] text-center mb-8">Shop by Category</h2> {/* عنوان بني */}
                <div className="flex flex-wrap justify-center gap-6">
            
                    {categories.map(category => (
                        <Link
                            key={category._id} 
                             href={`/products?categoryId=${category._id}`}
                         >
                           <div
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer border border-[#C0D6E4]" // كارد بستايل أنيق
                           >

                           <div className="relative w-full h-48">
                                <Image 
                                    src={category.image} 
                                    alt={category.name} 
                                    layout="fill" 
                                    objectFit="cover" 
                                    className="rounded-t-xl" 
                                />
                            </div>
                          <div className="p-4 text-center bg-[#C0D6E4] text-[#A47864] font-semibold"> 
                                <h3>{category.name}</h3>
                            </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;