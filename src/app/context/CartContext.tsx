"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // استيراد هوك الأوث
 
//1. (Types)

interface ProductInCart {
  count: number;
  _id: string;
  product: {
    title: string;
    imageCover: string;
    price: number;
    _id: string;
  };
}

interface CartData {
  _id: string;
  cartOwner: string;
  products: ProductInCart[];
  totalCartPrice: number;
  numOfCartItems: number;
}

interface CartContextType {
  cart: CartData | null;
  isLoading: boolean;
   isLoggedIn: boolean; 
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateProductQuantity: (productId: string, count: number) => Promise<void>;
  getCart: () => Promise<void>;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoggedIn, token } = useAuth();  // جلب الحالة والتوكن من AuthContext

  const API_URL = 'https://ecommerce.routemisr.com/api/v1/cart';

  const getCart = useCallback(async () => {
    if (!token) return; // إذا ما فيش توكن مش محتاج تجيب الكارت

    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, {
        headers: { token },
      });
      setCart(response.data.data);
      console.log('Cart fetched:', response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addToCart = async (productId: string) => {
    if (!token) {
      console.warn('User must be logged in to add to cart');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { productId },
        { headers: { token } }
      );
      setCart(response.data.data);
      console.log('Product added to cart:', response.data.data);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;

    try {
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: { token },
      });
      setCart(response.data.data);
      console.log('Product removed from cart:', response.data.data);
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

  const updateProductQuantity = async (productId: string, count: number) => {
    if (!token) return;

    try {
      const response = await axios.put(
        `${API_URL}/${productId}`,
        { count },
        { headers: { token } }
      );
      setCart(response.data.data);
      console.log('Product quantity updated:', response.data.data);
    } catch (error) {
      console.error('Failed to update product quantity:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getCart();
    } else {
      setCart(null);
      setIsLoading(false);
    }
  }, [isLoggedIn, getCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isLoggedIn,
        addToCart,
        removeFromCart,
        updateProductQuantity,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
