"use client";
import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, isWishlistLoading, removeFromWishlist } = useWishlist();
  const router = useRouter();

  if (!isOpen) return null;

  const products = Array.isArray(wishlist?.products) ? wishlist.products : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div
        className="bg-[#C0D6E4] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#A47864] hover:text-[#8f6551] text-2xl sm:text-3xl font-bold transition"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#A47864]">Your Wishlist</h2>

        {isWishlistLoading ? (
          <p className="text-center text-[#8f6551]">Loading...</p>
        ) : products.length > 0 ? (
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg shadow"
              >
                {/* Content */}
                <div
                  className="flex items-center gap-3 cursor-pointer mb-2 sm:mb-0"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <div>
                    <p className="text-[#8f6551] font-semibold">{product.title}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="text-white bg-[#A47864] hover:bg-[#8f6551] px-2 sm:px-3 py-1 rounded transition text-sm sm:text-base"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-[#A47864] hover:text-red-600 transition font-medium text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-[#8f6551]">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
