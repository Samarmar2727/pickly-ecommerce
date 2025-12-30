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
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Your Wishlist
        </h2>

        {isWishlistLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition"
              >
                {/* Product Info */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-gray-500 font-medium mt-1">${product.price}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="text-white bg-[#A47864] hover:bg-[#8f6551] px-3 py-1 rounded-lg text-sm font-medium transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-red-500 hover:text-red-600 font-medium text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Your wishlist is empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
