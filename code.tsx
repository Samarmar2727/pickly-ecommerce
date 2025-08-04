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
