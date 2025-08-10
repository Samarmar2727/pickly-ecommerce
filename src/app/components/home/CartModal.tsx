"use client";
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, updateProductQuantity } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  if (isLoading) {
    return <div className="p-4 text-center text-gray-700">Loading cart...</div>;
  }

  if (!cart || cart.products.length === 0) {
    return <div className="p-4 text-center text-gray-700">Your cart is empty.</div>;
  }

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
      <div className="bg-[#faebd7] p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-h-[80vh] h-auto sm:h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#A47864]">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl sm:text-3xl font-light leading-none">&times;</button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cart.products.map((item) => (
            <div key={item.product._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg shadow-md bg-[#C0D6E4]">
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#A47864]">{item.product.title}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.count}</p>
                  <p className="text-sm sm:text-base text-gray-800 font-bold">{item.product.price} EGP</p>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button onClick={() => updateProductQuantity(item.product._id, item.count + 1)} className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]">+</button>
                <button onClick={() => updateProductQuantity(item.product._id, item.count - 1)} className="w-8 h-8 rounded-full text-white font-bold bg-[#A47864]">-</button>
                <button onClick={() => removeFromCart(item.product._id)} className="text-red-600 hover:text-red-800 transition text-sm sm:text-base">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout */}
        <div className="mt-6 pt-4 border-t-2 border-[#A47864]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#A47864]">Total:</h3>
            <span className="text-xl sm:text-2xl font-bold text-[#A47864]">{cart.totalCartPrice} EGP</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full text-base sm:text-lg text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:opacity-90 transition bg-[#A47864]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
