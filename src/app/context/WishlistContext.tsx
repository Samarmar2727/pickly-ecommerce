"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface ProductInWishlist {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category: { name: string };
  brand: { name: string };
}

interface WishlistData {
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

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const { isLoggedIn, token } = useAuth();
  const API_URL = 'https://ecommerce.routemisr.com/api/v1/wishlist';

  const getWishlist = useCallback(async () => {
    if (!token) return;
    try {
      setIsWishlistLoading(true);
      const response = await axios.get(API_URL, { headers: { token } });
      setWishlist({ products: response.data.data });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist(null);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [token]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!token) return;
    try {
      await axios.post(API_URL, { productId }, { headers: { token } });
      await getWishlist(); //updated after add
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  }, [token, getWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!token) return;
    try {
      await axios.delete(`${API_URL}/${productId}`, { headers: { token } });
      await getWishlist(); //  //updated after remove
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
    }
  }, [token, getWishlist]);

  useEffect(() => {
    if (isLoggedIn) {
      getWishlist();
    } else {
      setWishlist(null);
      setIsWishlistLoading(false);
    }
  }, [isLoggedIn, getWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlistLoading, isLoggedIn, addToWishlist, removeFromWishlist, getWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

//Hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
