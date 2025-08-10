"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SectionHeading from "../SectionHeading";
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

//interfaces
interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

// Filters Component (for filtering products)
const Filters = ({ categories, brands }: { categories: Category[]; brands: Brand[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle filter changes and update URL search params
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Category Filter Dropdown */}
      <select
        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
        defaultValue={searchParams.get('categoryId') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Brand Filter Dropdown */}
      <select
        onChange={(e) => handleFilterChange('brandId', e.target.value)}
        defaultValue={searchParams.get('brandId') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>

      {/* Price Filter Dropdown (Sorting) */}
      <select
        onChange={(e) => handleFilterChange('price', e.target.value)}
        defaultValue={searchParams.get('price') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Lowest to Highest</option>
        <option value="desc">Highest to Lowest</option>
      </select>
    </div>
  );
};

// --- Products Component (Main component for displaying products) ---
const Products = () => {
  // Get filter parameters from URL search params
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const brandId = searchParams.get('brandId');
  const keyword = searchParams.get('keyword');
  const subcategoryId = searchParams.get('subcategoryId');

  // Local state management for products, filters, and UI feedback
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Custom hooks for cart and wishlist functionality
  const { addToCart, isLoading: isCartLoading, isLoggedIn: isCartLoggedIn } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isLoggedIn: isWishlistLoggedIn } = useWishlist();

  // Use one isLoggedIn flag, assuming both contexts are synced
  const isLoggedIn = isCartLoggedIn || isWishlistLoggedIn;

  // Handler for adding a product to the cart
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      router.push('/');  // Redirect to login page
      return;
    }
    addToCart(productId);
  };

  // Helper function to check if a product is in the wishlist
  const isProductInWishlist = (productId: string) => {
  return wishlist?.products?.some(item => item._id === productId) ?? false;
};


  // Handler for adding/removing a product from the wishlist
  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please log in to manage your wishlist.');
      router.push('/');
      return;
    }

    if (isProductInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Effect to fetch categories and brands on initial load
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          axios.get('https://ecommerce.routemisr.com/api/v1/categories'),
          axios.get('https://ecommerce.routemisr.com/api/v1/brands'),
        ]);
        setCategories(catsRes.data.data);
        setBrands(brandsRes.data.data);
      } catch (error) {
        console.error(error, 'Failed to fetch filters');
      }
    };
    fetchFilters();
  }, []); 

  // Memoized function to fetch products based on filters and pagination
  const fetchProducts = useCallback(async (append = false) => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        limit: 12,
        page,
      };

      if (keyword) params['keyword'] = keyword;
      if (categoryId) params['category[in]'] = categoryId;
      if (brandId) params['brand'] = brandId;
      if (subcategoryId) params['subcategory'] = subcategoryId;

      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products', { params });

      const fetched = response.data.data;
      if (append) {
        setProducts((prev) => [...prev, ...fetched]);
      } else {
        setProducts(fetched);
      }

      if (fetched.length < 12) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
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
  }, [categoryId, brandId, keyword, subcategoryId, page]);

  // Effect to refetch products when filters change (resets page to 1)
  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(false);
  }, [categoryId, brandId, keyword, subcategoryId, fetchProducts]);

  // Effect to fetch the next page of products when the page state changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(true);
    }
  }, [page, fetchProducts]);

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

        <Filters categories={categories} brands={brands} />

        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

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
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    New
                  </span>

                  {/* Wishlist icon with dynamic styling */}
                  <HeartIcon
                    onClick={(e) => handleWishlistClick(e, product._id)}
                    className={`
                      absolute top-2 right-2 p-1 w-5 h-5 rounded-full shadow-sm z-10 transition-colors
                      ${
                        isProductInWishlist(product._id)
                          ? 'bg-[#A47864] text-white'
                          : 'bg-white text-[#A47864]'
                      }
                    `}
                  />

                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

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

                      {/* Add to Cart button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={isCartLoading || !isLoggedIn}
                        className="bg-[#A47864] text-white py-1.5 px-4 rounded-full hover:bg-[#C0D6E4] hover:text-[#A47864] transition duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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

      {/* "Load More" button for pagination */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="bg-[#A47864] text-white px-6 py-2 rounded hover:bg-[#8c5c4e] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
