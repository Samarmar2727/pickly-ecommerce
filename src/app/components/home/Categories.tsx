'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionHeading from '../SectionHeading';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get('https://ecommerce.routemisr.com/api/v1/categories'),
          axios.get('https://ecommerce.routemisr.com/api/v1/subcategories'),
        ]);

        setCategories(catRes.data.data);
        setSubcategories(subRes.data.data);
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

    fetchAll();
  }, []);

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(prev => (prev === categoryId ? null : categoryId));
  };

  const getSubcategoriesByCategory = (categoryId: string) =>
    subcategories.filter(sub => sub.category === categoryId);

  if (loading) return <div className="text-center py-10 text-[#A47864]">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="py-10 bg-[#fffaf4]">
      <div className="container mx-auto px-4 max-w-lg">
        <SectionHeading title="Shop by Category" icon="🛍️" />

        <div className="space-y-3">
          {categories.map(category => (
            <div key={category._id} className="relative">
              <button
                onClick={() => toggleDropdown(category._id)}
                className="w-full flex justify-between items-center bg-white border border-[#E0DAD4] rounded-lg px-4 py-3 text-[#A47864] font-semibold hover:shadow transition"
              >
                <Link href={`/products?categoryId=${category._id}`} className="hover:underline">
                  {category.name}
                </Link>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openDropdown === category._id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === category._id && (
                <div className="absolute z-10 left-0 right-0 bg-white border border-[#E0DAD4] rounded-lg mt-1 py-2 shadow-md animate-fade-in">
                  {getSubcategoriesByCategory(category._id).map(sub => (
                    <Link
                      key={sub._id}
                      href={`/products?subcategoryId=${sub._id}`}
                      className="block px-4 py-2 text-sm font-medium text-[#A47864] bg-[#ECE5E1] border border-[#D2BDB2] rounded-lg mb-1 hover:bg-[#A47864] hover:text-white transition"

                      >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
