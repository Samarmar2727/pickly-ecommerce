"use client";
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, updateProductQuantity } = useCart();
  const router = useRouter();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-700">Loading cart...</div>;
  }

  if (!cart || cart.products.length === 0) {
    return <div className="p-4 text-center text-gray-700">Your cart is empty.</div>;
  }

  const handleCheckout = () => {
    onClose(); // Close the modal
    router.push('/checkout');
  };

  return (
    <div className="p-6 h-full flex flex-col bg-[#faebd7]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#A47864]">Shopping Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {cart.products.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between p-4 rounded-lg shadow-md bg-[#C0D6E4]">
            <div className="flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={item.product.imageCover}
                  alt={item.product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#A47864]">{item.product.title}</h3>
                <p className="text-gray-600">Quantity: {item.count}</p>
                <p className="text-gray-800 font-bold">{item.product.price} EGP</p>
              </div>
            </div>
            {/* Quantity and Remove Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateProductQuantity(item.product._id, item.count + 1)}
                className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]"
              >
                +
              </button>
              <button
                onClick={() => updateProductQuantity(item.product._id, item.count - 1)}
                className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]"
              >
                -
              </button>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price & Checkout Button */}
      <div className="mt-6 pt-4 border-t-2 border-[#A47864]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#A47864]">Total:</h3>
          <span className="text-2xl font-bold text-[#A47864]">{cart.totalCartPrice} EGP</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full text-lg text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition bg-[#A47864]"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartModal;