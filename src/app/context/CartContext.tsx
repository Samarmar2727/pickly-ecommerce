
import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import axios from 'axios';

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
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateProductQuantity: (productId: string, count: number) => Promise<void>;
  getCart: () => Promise<void>;
}

// 2.Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3.Provider 
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = 'https://ecommerce.routemisr.com/api/v1/cart'
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  //a func to get products 
  const getCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, {
        headers: { token: userToken },
      });
      setCart(response.data.data);
      console.log('Cart fetched:', response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null); 
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  //a fun to add (POST)
  const addToCart = async (productId: string) => {
    try {
      const response = await axios.post(
        API_URL,
        { productId: productId },
        { headers: { token: userToken } }
      );
      setCart(response.data.data);
      console.log('Product added to cart:', response.data.data);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  // a func to (DELETE)
  const removeFromCart = async (productId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: { token: userToken },
      });
      setCart(response.data.data);
      console.log('Product removed from cart:', response.data.data);
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

  // a fun to update a quantatity (PUT)
  const updateProductQuantity = async (productId: string, count: number) => {
    try {
      const response = await axios.put(
        `${API_URL}/${productId}`,
        { count },
        { headers: { token: userToken } }
      );
      setCart(response.data.data);
      console.log('Product quantity updated:', response.data.data);
    } catch (error) {
      console.error('Failed to update product quantity:', error);
    }
  };

  // 4. هات السلة اول ما الprovider يشتغل 
   useEffect(() => {
    if (userToken) {
        getCart();
    } else {
        // لو مفيش توكن، يبقى مفيش سلة
        setIsLoading(false);
    }
  }, [userToken,getCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
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

// 5. Hook to store a cart context 
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};