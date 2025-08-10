"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // استيراد هوك الأوث

// 1. Types
interface ProductInWishlist {
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

interface WishlistData {
  _id: string;
  products: ProductInWishlist[];
}

interface WishlistContextType {
  wishlist: WishlistData | null;
  isWishlistLoading: boolean;
  isLoggedIn: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  getWishlist: () => Promise<void>;
}

// 2. Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// 3. Provider
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const { isLoggedIn, token } = useAuth(); // استخدام حالة الدخول والتوكن من الـ AuthContext

  const API_URL = 'https://ecommerce.routemisr.com/api/v1/wishlist';

  const getWishlist = useCallback(async () => {
    if (!token) return;

    try {
      setIsWishlistLoading(true);
      const response = await axios.get(API_URL, {
        headers: { token },
      });
      setWishlist(response.data.data);
      console.log('Wishlist fetched:', response.data.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist(null);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [token]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!token) {
      console.warn('User must be logged in to add to wishlist');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { productId },
        { headers: { token } }
      );
      setWishlist(response.data.data);
      console.log('Product added to wishlist:', response.data.data);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  }, [token]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!token) return;

    try {
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: { token },
      });
      setWishlist(response.data.data);
      console.log('Product removed from wishlist:', response.data.data);
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn) {
      getWishlist();
    } else {
      setWishlist(null);
      setIsWishlistLoading(false);
    }
  }, [isLoggedIn, getWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistLoading,
        isLoggedIn,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// 4. Hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
