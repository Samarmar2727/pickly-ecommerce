
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CartItemSkeleton from '../skeletons/CartItemSkeleton';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, updateProductQuantity } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            /* Skeleton */
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
          ) : !cart || cart.products.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-4">🛒</span>
              <p className="text-gray-600 mb-6">
                Your cart is currently empty
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#A47864] text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Products */
            <div className="space-y-4">
              {cart.products.map((item) => (
                <div
                  key={item.product._id}
                   className="flex gap-4 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white"
>
                  {/* Image */}
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 line-clamp-1">
                      {item.product.title}
                    </h3>
                   <p className="text-base font-semibold text-[#A47864] mt-1">
                      {item.price} $
                      
                    </p>


                    <div className="flex items-center justify-between mt-3">
                     {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={item.count === 1}
                        onClick={() =>
                          updateProductQuantity(item.product._id, item.count - 1)
                        }
                        className="w-8 h-8 border rounded-full flex items-center justify-center text-lg font-bold bg-[#A47864] text-white disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="text-base font-semibold text-gray-800">
                        {item.count}
                      </span>

                      <button
                        onClick={() =>
                          updateProductQuantity(item.product._id, item.count + 1)
                        }
                        className="w-8 h-8 border rounded-full flex items-center justify-center text-lg font-bold bg-[#A47864] text-white"
                      >
                        +
                      </button>
                    </div>

                        {/* Item Price */}
                        <p className="text-base font-semibold text-grey-500 mt-1">
                          {item.product.price} $
                        </p>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.products.length > 0 && (
          <div className="border-t px-6 py-4 bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-lg font-semibold text-gray-800">
                {cart.totalCartPrice} $
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-[#A47864] text-white hover:opacity-90 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
