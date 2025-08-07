'use client';

import Link from "next/link";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import WishlistModal from './home/WishlistModal';
import CartModal from "./home/CartModal";
import { useState, useEffect } from 'react';
import { ShoppingCartIcon, HeartIcon} from "@heroicons/react/24/outline";
import LogOutModal from "./auth/LogOutModal";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { cart, isLoading } = useCart();
  const numberOfItems = cart?.numOfCartItems || 0;

  const { wishlist } = useWishlist();

  const [isWishListModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);


  const handleWishlistOpenModal = () => setIsWishlistModalOpen(true);
  const handleWishlistCloseModal = () => setIsWishlistModalOpen(false);
  
  const handleCartOpenModal = () => setIsCartModalOpen(true);
  const handleCartCloseModal = () => setIsCartModalOpen(false);

  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/products?keyword=${searchQuery}`);
    }
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(prev => (prev === categoryId ? null : categoryId));
  };

  const getSubcategoriesByCategory = (categoryId: string) =>
    subcategories.filter(sub => sub.category === categoryId);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get('https://ecommerce.routemisr.com/api/v1/categories'),
          axios.get('https://ecommerce.routemisr.com/api/v1/subcategories'),
        ]);

        setCategories(catRes.data.data);
        setSubcategories(subRes.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-[#A47864] text-white">
      {/* === Top Header === */}
      <div className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-wide text-[#C0D6E4] cursor-pointer">
            Pick<span className="text-[#faebd7] italic">ly</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="px-4 py-2 rounded-md bg-[#C0D6E4] text-[#A47864] placeholder-[#A47864] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition duration-200"
          />

          <div className="flex items-center gap-4">
            {/* Wishlist Icon */}
            <div className="relative">
              <HeartIcon onClick={handleWishlistOpenModal} className="h-6 w-6 text-[#C0D6E4] cursor-pointer hover:text-[#faebd7] transition" />
              {wishlist && wishlist.products.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.products.length}
                </span>
              )}
            </div>

            {/* Cart Icon */}
            <div className="relative">
              <button aria-label="Cart" className="relative" onClick={handleCartOpenModal}>
                <ShoppingCartIcon className="h-6 w-6 text-[#C0D6E4] cursor-pointer hover:text-[#faebd7] transition" />
                {!isLoading && numberOfItems > 0 && (
                  <span className="cart-count absolute -top-2 -right-2 bg-[#C0D6E4] text-[#A47864] text-xs rounded-full px-1">{numberOfItems}</span>
                )}
              </button>
            </div>

          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-sm bg-[#A47864] text-white px-4 py-2 rounded-md hover:bg-[#c2917c] transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* === Categories Nav Bar === */}
      <nav className="bg-[#8f6551] px-4 py-2 flex gap-6 justify-center relative z-50">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            className="relative group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >

            <button
              onClick={() => toggleDropdown(category._id)}
              className="text-white font-semibold hover:underline focus:outline-none cursor-pointer"
            >
              {category.name}
            </button>

            {/* Dropdown */}
            {openDropdown === category._id && (
              <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute category-dropdown top-full left-0 bg-white text-[#A47864] rounded-xl shadow-lg mt-2 z-50 min-w-[180px] p-2 space-y-1 animate-fade-in border border-[#CBB8AE]"
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

      

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishListModalOpen}
        onClose={handleWishlistCloseModal}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCartCloseModal}
      />
      {/* Logout Modal */}
      <LogOutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </header>
  );
}