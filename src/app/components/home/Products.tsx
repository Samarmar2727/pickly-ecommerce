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

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category: { _id: string; name: string; };
  brand: { _id: string; name: string; };
}

interface Category { _id: string; name: string; }
interface Brand { _id: string; name: string; }

const Filters = ({ categories, brands }: { categories: Category[]; brands: Brand[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 w-full overflow-x-hidden">
      <select
        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
        defaultValue={searchParams.get('categoryId') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-3 py-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <select
        onChange={(e) => handleFilterChange('brandId', e.target.value)}
        defaultValue={searchParams.get('brandId') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-3 py-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>{brand.name}</option>
        ))}
      </select>

      <select
        onChange={(e) => handleFilterChange('price', e.target.value)}
        defaultValue={searchParams.get('price') || ''}
        className="border border-[#A47864] bg-white text-[#A47864] px-3 py-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Lowest to Highest</option>
        <option value="desc">Highest to Lowest</option>
      </select>
    </div>
  );
};

const Products = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const keyword = searchParams.get("keyword");
  const subcategoryId = searchParams.get("subcategoryId");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const { addToCart, isLoading: isCartLoading, isLoggedIn: isCartLoggedIn } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isLoggedIn: isWishlistLoggedIn } = useWishlist();

  const isLoggedIn = isCartLoggedIn || isWishlistLoggedIn;

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      router.push("/");
      return;
    }
    addToCart(productId);
  };

  const isProductInWishlist = (productId: string) =>
    wishlist?.products?.some((item) => item._id === productId) ?? false;

  const handleWishlistClick = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to manage your wishlist.");
      router.push("/");
      return;
    }
    try {
      if (isProductInWishlist(productId)) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          axios.get("https://ecommerce.routemisr.com/api/v1/categories"),
          axios.get("https://ecommerce.routemisr.com/api/v1/brands"),
        ]);
        setCategories(catsRes.data.data);
        setBrands(brandsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    };
    fetchFilters();
  }, []);

  const fetchProducts = useCallback(async (append = false) => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { limit: 12, page };
      if (keyword) params["keyword"] = keyword;
      if (categoryId) params["category[in]"] = categoryId;
      if (brandId) params["brand"] = brandId;
      if (subcategoryId) params["subcategory"] = subcategoryId;

      const response = await axios.get("https://ecommerce.routemisr.com/api/v1/products", { params });
      const fetched = response.data.data;

      setProducts((prev) => append ? [...prev, ...fetched] : fetched);
      setHasMore(fetched.length >= 12);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "Failed to fetch products.");
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, brandId, keyword, subcategoryId, page]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(false);
  }, [categoryId, brandId, keyword, subcategoryId, fetchProducts]);

  useEffect(() => {
    if (page > 1) fetchProducts(true);
  }, [page, fetchProducts]);

  return (
    <section className="py-10 bg-[#faebd7] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <SectionHeading
          title={
            keyword ? `Search results for "${keyword}"` :
            subcategoryId ? "Filtered by Subcategory" :
            categoryId ? "Filtered by Category" :
            brandId ? "Filtered by Brand" : "All Products"
          }
          icon="🛍️"
        />

        <Filters categories={categories} brands={brands} />

        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, index) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-[#C0D6E4]
                  transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer
                  animate-zoom-in relative group"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                >
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">New</span>

                  <HeartIcon
                    onClick={(e) => handleWishlistClick(e, product._id)}
                    className={`absolute top-2 right-2 p-1 w-5 h-5 rounded-full shadow-sm z-10 transition-colors cursor-pointer
                    ${isProductInWishlist(product._id) ? "bg-[#A47864] text-white" : "bg-white text-[#A47864]"}`}
                  />

                  {/* Image - smaller height on mobile */}
                  <div className="relative w-full h-40 sm:h-52 md:h-64 overflow-hidden">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-xl transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col justify-between h-40 sm:h-44">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#A47864] mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.category.name}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg sm:text-xl font-bold text-[#A47864]">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={isCartLoading || !isLoggedIn}
                        className="bg-[#A47864] text-white py-1 px-3 sm:px-4 rounded-full hover:bg-[#C0D6E4] hover:text-[#A47864] transition text-xs sm:text-sm disabled:opacity-50"
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

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="bg-[#A47864] text-white px-5 py-2 rounded hover:bg-[#8c5c4e] transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
