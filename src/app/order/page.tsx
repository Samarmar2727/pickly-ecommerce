"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCheckCircle,
} from "react-icons/fa";

const OrderConfirmationPage: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    selectedAddress,
    paymentMethod,
  } = useCart();


  if (
    !cart ||
    cart.products.length === 0 ||
    !selectedAddress
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
        <p className="text-[#A47864] font-bold text-2xl">
          No order details found.
        </p>
      </div>
    );
  }

 

  return (
    <div className="min-h-screen p-6 bg-[#f5f5f5]">
      <div className="container mx-auto max-w-3xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 space-x-4 text-[#A47864] font-semibold">
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Cart
          </span>
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Checkout
          </span>
          <span className="flex items-center gap-2 text-white px-3 py-1 rounded-full bg-[#A47864]">
            Confirmation
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#A47864]">
            Thank You!
          </h1>
          <p className="text-xl text-[#8f6551] mt-2">
            Your order has been confirmed successfully.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.products.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#A47864]">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-[#8f6551]">
                      Quantity: {item.count}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#A47864]">
                  {(item.price * item.count).toFixed(2)} $
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#A47864] flex justify-between items-center">
            <span className="font-bold text-[#A47864] text-xl">
              Total:
            </span>
            <span className="font-bold text-[#A47864] text-2xl">
              {cart.totalCartPrice} $
            </span>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">
            Shipping Details
          </h2>
          <p className="text-[#8f6551]">
            <strong>Name:</strong> {selectedAddress.name}
          </p>
          <p className="text-[#8f6551]">
            <strong>Address:</strong> {selectedAddress.details}
          </p>
          <p className="text-[#8f6551]">
            <strong>City:</strong> {selectedAddress.city}
          </p>
          <p className="text-[#8f6551]">
            <strong>Phone:</strong> {selectedAddress.phone}
          </p>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#A47864] mb-4">
            Payment Method
          </h2>

          {paymentMethod === "cash" ? (
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
              Cash on Delivery
            </span>
          ) : (
            <div className="flex items-center gap-4 text-[#A47864]">
              <FaCcVisa size={36} />
              <FaCcMastercard size={36} />
              <FaCcPaypal size={36} />
            </div>
          )}
        </div>

        {/* Back Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-lg bg-[#A47864] text-white font-bold shadow-md hover:bg-[#8f6551] transition-all"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
