"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import axios from 'axios';
//import { useCart } from './CartContext';

// 1. (Types) 

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
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  getWishlist: () => Promise<void>;
}

// 2. (Context)
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// 3. (Provider) 
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const API_URL = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // استخدام useCallback لتجنب الـ re-render الغير ضروري
  const getWishlist = useCallback(async () => {
    try {
      setIsWishlistLoading(true);
      if (!userToken) {
        setWishlist(null);
        return;
      }
      const response = await axios.get(API_URL, {
        headers: { token: userToken },
      });
      setWishlist(response.data.data);
      console.log('Wishlist fetched:', response.data.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist(null);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [userToken]);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      const response = await axios.post(
        API_URL,
        { productId },
        { headers: { token: userToken } }
      );
      setWishlist(response.data.data);
      console.log('Product added to wishlist:', response.data.data);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  }, [userToken]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: { token: userToken },
      });
      setWishlist(response.data.data);
      console.log('Product removed from wishlist:', response.data.data);
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
    }
  }, [userToken]);

  // ✅ جلب الويشليست عند تحميل الـ Provider أو تغير الـ Token
  useEffect(() => {
    if (userToken) {
      getWishlist();
    } else {
      setIsWishlistLoading(false);
    }
  }, [userToken, getWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistLoading,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// 4. (Hook)
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};