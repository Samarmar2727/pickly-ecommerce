

import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
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
  const { cart, isLoading: isCartLoading } = useCart(); // Use the cart context
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({ name: '', details: '', phone: '', city: '' });
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //  API Calls & Handlers 

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
  }, [token])

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
      const response = await axios.post('https://routemisr.com/api/v1/addresses', newAddress, {
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
    return <div>Loading cart details...</div>;
  }
  
  if (!cart || cart.products.length === 0) {
      return <div>Your cart is empty. Please add some products to checkout.</div>;
  }
  
  // Rendering 
  
  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* 1. Shipping Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
        
        {/* Conditional rendering for address form or list */}
        {showAddressForm ? (
          <form onSubmit={addNewAddressHandler} className="space-y-4">
            <h4 className="text-lg font-medium">Add a New Address</h4>
            <input type="text" placeholder="Name (e.g., Home)" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Details (Street, Building)" value={newAddress.details} onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })} required className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="w-full p-2 border rounded" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Save Address & Continue</button>
          </form>
        ) : (
          <div>
            <h4 className="text-lg font-medium">Choose an Address</h4>
            <div className="space-y-2">
              {addresses.map((address) => (
                <div key={address._id} className="address-item flex items-center p-3 border rounded-md">
                  <input
                    type="radio"
                    id={address._id}
                    name="shipping-address"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => setSelectedAddress(address)}
                    className="mr-2"
                  />
                  <label htmlFor={address._id}>
                    <strong>{address.name}</strong>: {address.details}, {address.city}, {address.phone}
                  </label>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddressForm(true)} className="mt-4 text-blue-500 hover:underline">Add New Address</button>
          </div>
        )}
      </div>

      {/* 2. Order Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.products.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <span className="font-medium">{item.product.title}</span>
                <span className="text-sm text-gray-500 ml-2">x{item.count}</span>
              </div>
             <span className="font-semibold">{item.product.price * item.count} EGP</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
          <span className="text-xl font-bold">Total Price:</span>
          <span className="text-xl font-bold text-green-600">{cart.totalCartPrice} EGP</span>
        </div>
      </div>

      {/* 3. Payment Method Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
        <div className="flex space-x-4">
          <button 
            onClick={createCashOrder} 
            disabled={!selectedAddress || isProcessingOrder} 
            className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {isProcessingOrder ? 'Processing...' : 'Pay on Delivery'}
          </button>
          <button 
            onClick={createOnlineCheckoutSession} 
            disabled={!selectedAddress || isProcessingOrder} 
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {isProcessingOrder ? 'Processing...' : 'Pay Online'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;