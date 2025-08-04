

"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';



const Brands = () => {
interface Brand {
  _id: string;
  name: string;
  image: string;
}

    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('https://ecommerce.routemisr.com/api/v1/brands');
                setBrands(response.data.data);
                setLoading(false);
            } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                         const message = err.response?.data?.message || 'Failed to fetch brands.';
                        setError(message); 
                    } else {
                        setError('An unexpected error occurred.'); 
                    }
                } finally {
                    setLoading(false); 
                }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-[#A47864]">Loading brands...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="py-8 bg-[#C0D6E4]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-[#A47864] text-center mb-8">Shop by Brand</h2> {/* عنوان بني */}
                <div className="flex flex-wrap justify-center gap-6">
                    {brands.map(brand => (
                        <Link
                            key={brand._id} 
                            href={`/products?brandId=${brand._id}`}>
                            <div
                            className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-md transform transition duration-300 hover:scale-110 cursor-pointer border-2 border-[#A47864]" 
                            >
                           <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                                <Image 
                                    src={brand.image} 
                                    alt={brand.name} 
                                    layout="fill"
                                    objectFit="contain"
                                    className="rounded-full" 
                                />
                            </div>
                            </div>
                        </Link>
                        
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Brands;