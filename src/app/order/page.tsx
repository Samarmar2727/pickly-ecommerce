"use client";

import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

// Interfaces for data typing
interface ProductInOrder {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    price: number;
    imageCover: string;
  };
}

interface OrderData {
  _id: string;
  user: string;
  cartItems: ProductInOrder[];
  totalOrderPrice: number;
  shippingAddress: {
    name: string;
    details: string;
    phone: string;
    city: string;
  };
  isPaid: boolean;
  paymentMethodType: 'card' | 'cash';
  createdAt: string;
}

const OrderConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get token and decode it to find the user ID
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: { id: string } = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserId(null);
        setIsLoading(false);
      }
    } else {
      setUserId(null);
      setIsLoading(false);
    }
  }, [token]);

  // API call to fetch user orders
   const getUserOrders = useCallback(async () => {
    if (!token || !userId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
        headers: { token },
      });

      const orders: OrderData[] = response.data.data; 
      if (orders && orders.length > 0) {
        const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        setOrder(latestOrder);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    // Only fetch data if the user ID is available
    if (userId) {
      getUserOrders();
    }
  }, [userId,  getUserOrders ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#faebd7]">
        <div className="text-center text-[#A47864] font-bold text-2xl">
          Loading order details...
        </div>
      </div>
    );
  }
  
  // No order found state
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#faebd7]">
        <div className="text-center text-red-500 font-bold text-2xl">
          No order details found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl rounded-lg shadow-lg mt-10" style={{ backgroundColor: '#faebd7' }}>
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#A47864]">Thank You!</h1>
        <p className="text-xl text-[#8f6551] mt-2">Your order has been confirmed successfully.</p>
      </div>
      
      {/* Order Summary */}
      <div className="p-6 rounded-md shadow-md mb-6 bg-[#C0D6E4">
        <h2 className="text-2xl font-semibold mb-4 text-[#A47864]">Order Summary</h2>
        <div className="space-y-4">
          {order.cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center border-b border-[#A47864] pb-2">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-medium text-lg text-[#A47864]">{item.product.title}</span>
                  <p className="text-sm text-[#8f6551]">Quantity: {item.count}</p>
                </div>
              </div>
              <span className="font-semibold text-lg text-[#A47864]">{(item.product.price * item.count).toFixed(2)} EGP</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t-2 border-[#A47864] flex justify-between items-center">
          <span className="text-xl font-bold text-[#A47864]">Total Order:</span>
          <span className="text-2xl font-bold text-[#A47864]">{order.totalOrderPrice.toFixed(2)} EGP</span>
        </div>
      </div>
      
      {/* Shipping Details */}
      <div className="p-6 rounded-md shadow-md mb-6  bg-[#C0D6E4">
        <h2 className="text-2xl font-semibold mb-4 text-[#A47864]">Shipping Details</h2>
        <p className="text-[#8f6551]"><strong>Address:</strong> {order.shippingAddress.name} ({order.shippingAddress.details})</p>
        <p className="text-[#8f6551]"><strong>City:</strong> {order.shippingAddress.city}</p>
        <p className="text-[#8f6551]"><strong>Phone:</strong> {order.shippingAddress.phone}</p>
      </div>

      {/* Payment Information */}
      <div className="p-6 rounded-md shadow-md bg-[#C0D6E4]">
        <h2 className="text-2xl font-semibold mb-4 text-[#A47864]">Payment Information</h2>
        <p className="text-[#8f6551]"><strong>Payment Method:</strong> {order.paymentMethodType === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</p>
      </div>

      {/* Back to Home Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/home')}
          className="inline-block px-6 py-3 rounded-lg bg-[#A47864] shadow-md hover:bg-[#c2917c] transition font-bold text-white"
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;