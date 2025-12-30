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
  <div className="container mx-auto max-w-3xl">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-[#A47864] mb-12">
      Checkout
    </h1>

    {/* --- Shipping Details --- */}
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-[#A47864] mb-6">Shipping Details</h2>
      {showAddressForm ? (
        <form onSubmit={addNewAddressHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Name (Home, Office...)"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            required
            className="w-full p-3 border border-[#A47864] rounded-xl bg-[#f9f9f9] text-[#8f6551] placeholder-[#C0D6E4] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition"
          />
          <input
            type="text"
            placeholder="Street, Building, Floor..."
            value={newAddress.details}
            onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
            required
            className="w-full p-3 border border-[#A47864] rounded-xl bg-[#f9f9f9] text-[#8f6551] placeholder-[#C0D6E4] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            required
            className="w-full p-3 border border-[#A47864] rounded-xl bg-[#f9f9f9] text-[#8f6551] placeholder-[#C0D6E4] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            required
            className="w-full p-3 border border-[#A47864] rounded-xl bg-[#f9f9f9] text-[#8f6551] placeholder-[#C0D6E4] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition"
          />
          <button
            type="submit"
            className="w-full bg-[#A47864] text-white py-3 rounded-xl shadow-lg hover:bg-[#8f6551] transition font-semibold"
          >
            Save Address
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address._id}
              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition hover:shadow-md ${
                selectedAddress?._id === address._id
                  ? 'border-[#A47864] shadow-lg bg-[#f9f9f9]'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping-address"
                  checked={selectedAddress?._id === address._id}
                  onChange={() => setSelectedAddress(address)}
                  className="accent-[#A47864]"
                />
                <div className="text-[#8f6551]">
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-sm">{address.details}, {address.city}</p>
                  <p className="text-sm">{address.phone}</p>
                </div>
              </div>
            </label>
          ))}
          <button
            onClick={() => setShowAddressForm(true)}
            className="mt-4 text-[#A47864] hover:underline font-medium"
          >
            + Add New Address
          </button>
        </div>
      )}
    </div>

    {/* --- Order Summary --- */}
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-[#A47864] mb-6">Order Summary</h2>
      <div className="divide-y divide-gray-200">
        {cart.products.map((item) => (
          <div key={item.product._id} className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <img
                src={item.product.imageCover}
                alt={item.product.title}
                className="w-16 h-16 object-cover rounded-lg shadow"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-[#A47864]">{item.product.title}</span>
                <span className="text-sm text-gray-500">x{item.count}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {item.product.discount ? (
                <>
                  <span className="text-sm line-through text-gray-400">
                    {(item.product.price).toFixed(2)} $
                  </span>
                  <span className="font-semibold text-[#A47864]">
                    {(item.product.price * (1 - item.product.discount / 100) * item.count).toFixed(2)} EGP
                  </span>
                </>
              ) : (
                <span className="font-semibold text-[#A47864]">
                  {(item.price * item.count).toFixed(2)} $
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
        <span className="text-xl font-bold text-[#A47864]">Total:</span>
        <span className="text-2xl font-bold text-[#A47864]">{cart.totalCartPrice} $</span>
      </div>
    </div>

    {/* --- Payment Method --- */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-[#A47864] mb-4">Payment Method</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={createCashOrder}
          disabled={!selectedAddress || isProcessingOrder}
          className="flex-1 bg-[#A47864] text-white py-3 rounded-xl shadow-lg hover:bg-[#8f6551] transition font-semibold disabled:bg-gray-400"
        >
          {isProcessingOrder ? 'Processing...' : 'Pay on Delivery'}
        </button>
        <button
          onClick={createOnlineCheckoutSession}
          disabled={!selectedAddress || isProcessingOrder}
          className="flex-1 bg-[#A47864] text-white py-3 rounded-xl shadow-lg hover:bg-[#8f6551] transition font-semibold disabled:bg-gray-400"
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