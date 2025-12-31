"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";

import axios from "axios";
import { useAuth } from "./AuthContext";

/* interfaces */
export interface ProductInCart {
  count: number;
  _id: string;
  product: {
    title: string;
    imageCover: string;
    price: number;
    _id: string;
  };
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: ProductInCart[];
  totalCartPrice: number;
  numOfCartItems: number;
}
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export type PaymentMethod = "cash" | "card";

/* 3️⃣ Context Type */
interface CartContextType {
  /* Cart */
  cart: CartData | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateProductQuantity: (productId: string, count: number) => Promise<void>;
  getCart: () => Promise<void>;

  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;

  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;

  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* Provider */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* STATES */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const { isLoggedIn, token } = useAuth();

  const API_URL = "https://ecommerce.routemisr.com/api/v1/cart";

  /* Cart Logic  */

  const getCart = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, {
        headers: { token },
      });
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addToCart = async (productId: string) => {
    if (!token) return;

    try {
      const response = await axios.post(
        API_URL,
        { productId },
        { headers: { token } }
      );
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;

    try {
      const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: { token },
      });
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to remove product:", error);
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
    } catch (error) {
      console.error("Failed to update quantity:", error);
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
        addresses,
        setAddresses,
        selectedAddress,
        setSelectedAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ===================== */
/* 5️⃣ Hook */
/* ===================== */

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
