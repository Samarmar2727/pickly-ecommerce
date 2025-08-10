"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

// Interfaces
interface Address {
  _id?: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, isLoading: isCartLoading } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({ name: '', details: '', phone: '', city: '' });
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // API Calls & Handlers
  const getUserAddresses = useCallback(async () => {
    try {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/addresses', {
        headers: { token: token },
      });
      setAddresses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedAddress(response.data.data[0]);
        setShowAddressForm(false);
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setShowAddressForm(true);
    }
  }, [token]);

  const createCashOrder = async () => {
    if (!selectedAddress || !cart) return;
    setIsProcessingOrder(true);
    try {
      const _response = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cart._id}`, { shippingAddress: selectedAddress }, {
        headers: { token: token },
      });
      alert('Cash Order Created Successfully!');
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error creating cash order:', error);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const createOnlineCheckoutSession = async () => {
    if (!selectedAddress || !cart) return;
    setIsProcessingOrder(true);
    try {
      const response = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart._id}?url=${window.location.origin}/order-confirmation`,
        { shippingAddress: selectedAddress },
        { headers: { token: token } }
      );
      if (response.data.session.url) {
        window.location.href = response.data.session.url;
      }
    } catch (error) {
      console.error('Error creating online session:', error);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const addNewAddressHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecommerce.routemisr.com/api/v1/addresses', newAddress, {
        headers: { token: token },
      });
      const addedAddress = response.data.data;
      setSelectedAddress(addedAddress);
      setAddresses([...addresses, addedAddress]);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error adding new address:', error);
    }
  };

  // --- Effects ---
  useEffect(() => {
    getUserAddresses();
  }, [getUserAddresses]);

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#faebd7]">
        <div className="text-center text-[#A47864] font-bold text-2xl">
          Loading cart details...
        </div>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#faebd7]">
        <div className="text-center text-[#A47864] font-bold text-2xl">
          Your cart is empty. Please add some products to checkout.
        </div>
      </div>
    );
  }

  // Rendering
  return (
    <div className="min-h-screen p-6 bg-[#faebd7]">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-[#A47864] mb-8 text-center">Checkout</h1>

        {/* 1. Shipping Details Section */}
        <div className="bg-[#C0D6E4] p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">Shipping Details</h2>

          {showAddressForm ? (
            <form onSubmit={addNewAddressHandler} className="space-y-4">
              <h4 className="text-lg font-medium text-[#A47864]">Add a New Address</h4>
              <input type="text" placeholder="Name (e.g., Home)" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} required className="w-full p-2 border border-[#A47864] rounded-md bg-white text-[#A47864] placeholder-[#8f6551] focus:outline-none focus:ring-2 focus:ring-[#A47864]" />
              <input type="text" placeholder="Details (Street, Building)" value={newAddress.details} onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })} required className="w-full p-2 border border-[#A47864] rounded-md bg-white text-[#A47864] placeholder-[#8f6551] focus:outline-none focus:ring-2 focus:ring-[#A47864]" />
              <input type="tel" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required className="w-full p-2 border border-[#A47864] rounded-md bg-white text-[#A47864] placeholder-[#8f6551] focus:outline-none focus:ring-2 focus:ring-[#A47864]" />
              <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="w-full p-2 border border-[#A47864] rounded-md bg-white text-[#A47864] placeholder-[#8f6551] focus:outline-none focus:ring-2 focus:ring-[#A47864]" />
              <button type="submit" className="w-full bg-[#A47864] text-white px-4 py-3 rounded-lg shadow hover:bg-[#8f6551] transition disabled:bg-gray-400">Save Address</button>
            </form>
          ) : (
            <div>
              <h4 className="text-lg font-medium text-[#A47864]">Choose an Address</h4>
              <div className="space-y-2">
                {addresses.map((address) => (
                  <div key={address._id} className="address-item flex items-center p-3 border border-[#A47864] rounded-md bg-white">
                    <input
                      type="radio"
                      id={address._id}
                      name="shipping-address"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                      className="mr-2 accent-[#A47864]"
                    />
                    <label htmlFor={address._id} className="text-[#8f6551]">
                      <strong>{address.name}</strong>: {address.details}, {address.city}, {address.phone}
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAddressForm(true)} className="mt-4 text-[#A47864] hover:underline font-medium">Add New Address</button>
            </div>
          )}
        </div>

        {/* 2. Order Summary Section */}
        <div className="bg-[#C0D6E4] p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.products.map((item) => (
              <div key={item.product._id} className="flex justify-between items-center border-b border-[#A47864] pb-2 text-[#8f6551]">
                <div className="flex items-center">
                  <span className="font-medium text-[#A47864]">{item.product.title}</span>
                  <span className="text-sm ml-2">x{item.count}</span>
                </div>
                <span className="font-semibold text-[#A47864]">{(item.product.price * item.count).toFixed(2)} EGP</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-[#A47864] flex justify-between items-center">
            <span className="text-xl font-bold text-[#A47864]">Total Price:</span>
            <span className="text-2xl font-bold text-[#A47864]">{cart.totalCartPrice} EGP</span>
          </div>
        </div>

        {/* 3. Payment Method Section */}
        <div className="bg-[#C0D6E4] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">Payment Method</h2>
          <div className="flex space-x-4">
            <button
              onClick={createCashOrder}
              disabled={!selectedAddress || isProcessingOrder}
              className="flex-1 bg-[#A47864] text-white px-6 py-3 rounded-lg shadow hover:bg-[#8f6551] transition disabled:bg-gray-400"
            >
              {isProcessingOrder ? 'Processing...' : 'Pay on Delivery'}
            </button>
            <button
              onClick={createOnlineCheckoutSession}
              disabled={!selectedAddress || isProcessingOrder}
              className="flex-1 bg-[#A47864] text-white px-6 py-3 rounded-lg shadow hover:bg-[#8f6551] transition disabled:bg-gray-400"
            >
              {isProcessingOrder ? 'Processing...' : 'Pay Online'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;