"use client";

import React from 'react';
import { useWishlist } from '../../context/WishlistContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, isWishlistLoading, removeFromWishlist } = useWishlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
          
          {isWishlistLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : wishlist && wishlist.products.length > 0 ? (
            <ul>
              {wishlist.products.map((product) => (
                <li key={product._id} className="flex items-center justify-between py-2 border-b">
                  <span>{product.title}</span>
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;