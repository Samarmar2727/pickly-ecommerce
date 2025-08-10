"use client";

import React from "react";
import { useWishlist } from "../../context/WishlistContext";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, isWishlistLoading, removeFromWishlist } = useWishlist();

  if (!isOpen) return null;

  // تأمين wishlist.products دايمًا تكون مصفوفة
  const products = wishlist?.products ?? [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#C0D6E4] p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-[#A47864] hover:text-[#8f6551] text-2xl font-bold transition"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-4 text-[#A47864]">
            Your Wishlist
          </h2>

          {isWishlistLoading ? (
            <p className="text-center text-[#8f6551]">Loading...</p>
          ) : products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between py-2 border-b border-[#A47864]"
                >
                  <span className="text-lg text-[#8f6551]">{product.title}</span>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="ml-4 text-[#A47864] hover:text-red-600 transition font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#8f6551]">
              Your wishlist is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
