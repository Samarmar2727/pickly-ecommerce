"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SectionHeading from "../SectionHeading";
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  image: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch brands from API
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

  // Scroll carousel left or right
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 250; // Smaller scroll for mobile
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[#A47864] animate-pulse">Loading brands...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-10 bg-[#C0D6E4]">
      <div className="container mx-auto px-4">
        <SectionHeading title="Shop by Brand" icon="🛍️" />

        <div className="relative flex items-center">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-[#A47864]" />
          </button>

          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="flex gap-4 px-8 scroll-smooth"
            style={{
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {brands.map((brand) => (
              <Link key={brand._id} href={`/products?brandId=${brand._id}`}>
                <div
                  className="
                    min-w-[90px] min-h-[90px]
                    sm:min-w-[120px] sm:min-h-[120px]
                    md:min-w-[140px] md:min-h-[140px]
                    bg-white rounded-full p-2 shadow-lg border-2 border-[#A47864]
                    flex items-center justify-center overflow-hidden
                    transition-transform duration-300 hover:scale-110
                  "
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-[#A47864]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Brands;
