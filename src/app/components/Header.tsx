"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import WishlistModal from "./home/WishlistModal";
import CartModal from "./home/CartModal";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import LogOutModal from "./auth/LogOutModal";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { cart, isLoading } = useCart();
  const numberOfItems = cart?.products?.reduce((acc, item) => acc + item.count, 0) ?? 0;
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist?.products?.length ?? 0;

  const [isWishListModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleWishlistOpenModal = () => setIsWishlistModalOpen(true);
  const handleWishlistCloseModal = () => setIsWishlistModalOpen(false);

  const handleCartOpenModal = () => setIsCartModalOpen(true);
  const handleCartCloseModal = () => setIsCartModalOpen(false);

  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(
        `/products?keyword=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown((prev) => (prev === categoryId ? null : categoryId));
  };

  const getSubcategoriesByCategory = (categoryId: string) =>
    subcategories.filter((sub) => sub.category === categoryId);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get("https://ecommerce.routemisr.com/api/v1/categories"),
          axios.get("https://ecommerce.routemisr.com/api/v1/subcategories"),
        ]);
        setCategories(catRes.data.data ?? []);
        setSubcategories(subRes.data.data ?? []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".category-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#A47864] text-white w-full">
      {/* === Top Header === */}
      <div className="p-4 flex items-center justify-between gap-3 sm:gap-2 md:gap-2 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="text-lg sm:text-3xl font-extrabold tracking-wide text-[#C0D6E4] cursor-pointer">
            Pick<span className="text-[#faebd7] italic">ly</span>
          </h1>
        </Link>

        {/* Search Input */}
        <div className="flex items-center gap-2 flex-grow w-[140px] xs:w-[180px] sm:w-[300px] md:max-w-[400px] bg-[#C0D6E4]/40 rounded-md px-2 py-1.5 focus-within:ring-2 focus-within:ring-[#A47864] transition">
          <input
            type="text"
            placeholder="what are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent text-[11px] sm:text-lg text-[#F9F9F9] placeholder-[#e5d9d0]/80 focus:outline-none"
          />
          <MagnifyingGlassIcon className="h-4 w-4 flex-shrink-0 text-[#C0D6E4]" />
        </div>

        {/* Icons + Logout */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Wishlist Icon */}
          <div className="relative">
            <HeartIcon
              onClick={handleWishlistOpenModal}
              className="h-5 w-5 sm:h-6 sm:w-6 text-[#C0D6E4] font-bold cursor-pointer hover:text-[#faebd7] transition"
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <button
              aria-label="Cart"
              className="relative"
              onClick={handleCartOpenModal}
              type="button"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#C0D6E4] font-bold cursor-pointer hover:text-[#faebd7] transition" />
              
              {!isLoading && numberOfItems > 0 && (
                <span className="cart-count absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {numberOfItems}
                </span>
              )}
            </button>
          </div>

          {/* === Logout Button (desktop) === */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hidden sm:inline-block text-sm font-bold bg-[#A47864] text-white px-4 py-2 rounded-md hover:bg-[#c2917c] transition duration-200 cursor-pointer"
            type="button"
          >
            Logout
          </button>

          {/* === Logout Icon (mobile) === */}
          <ArrowLeftStartOnRectangleIcon
            onClick={() => setShowLogoutModal(true)}
            className="h-5 w-5 sm:h-6 sm:w-6 text-[#C0D6E4] font-bold cursor-pointer hover:text-[#faebd7] transition sm:hidden"
          />
        </div>
      </div>
      {/* === navbar === */}
      <div className="bg-[#8f6551] px-4 py-2 relative overflow-visible ">
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden z-0">
          <nav className="flex gap-6 justify-start md:justify-center overflow-visible">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                className="relative group snap-start"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
              >
                <button
                  onClick={() => toggleDropdown(category._id)}
                  className="text-white font-semibold hover:underline focus:outline-none cursor-pointer"
                  type="button"
                >
                  {category.name}
                </button>

                {openDropdown === category._id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute category-dropdown top-full left-1/2 -translate-x-1/2 bg-white text-[#A47864] rounded-xl shadow-lg mt-2 z-[9999] min-w-[180px] p-2 space-y-1 animate-fade-in border border-[#CBB8AE] will-change-transform"
                  >
                    {getSubcategoriesByCategory(category._id).map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/products?subcategoryId=${sub._id}`}
                        className="block px-4 py-2 text-sm font-medium hover:bg-[#faebd7] hover:text-[#8f6551] transition"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>
        </div>
      </div>

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishListModalOpen}
        onClose={handleWishlistCloseModal}
      />

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={handleCartCloseModal} />

      {/* Logout Modal */}
      <LogOutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </header>
  );
}
