"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaTrash, FaEdit, FaTimes, FaCheckCircle } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import type { Address, PaymentMethod } from "../context/CartContext";

const CheckoutPage = () => {
  const router = useRouter();

  const {
    cart,
    isLoading,
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
  } = useCart();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [processingType, setProcessingType] = useState<
    "cash" | "online" | null
  >(null);

  const [formData, setFormData] = useState<Omit<Address, "_id">>({
    name: "",
    details: "",
    phone: "",
    city: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= Fetch Addresses ================= */
  const getUserAddresses = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        { headers: { token } }
      );

      setAddresses(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedAddress(res.data.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token, setAddresses, setSelectedAddress]);

  useEffect(() => {
    getUserAddresses();
  }, [getUserAddresses]);

  /* ================= Address Handlers ================= */
  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingAddress) {
        await axios.put(
          `https://ecommerce.routemisr.com/api/v1/addresses/${editingAddress._id}`,
          formData,
          { headers: { token } }
        );

        toast.success("Address updated successfully");
      } else {
        await axios.post(
          "https://ecommerce.routemisr.com/api/v1/addresses",
          formData,
          { headers: { token } }
        );

        toast.success("Address added successfully");
      }

      resetForm();
      getUserAddresses();
    } catch (error) {
      toast.error("Failed to save address");
      console.error(error);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/addresses/${id}`,
        { headers: { token } }
      );

      toast.success("Address deleted");
      getUserAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setShowAddressForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", details: "", phone: "", city: "" });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  /* ================= Orders ================= */
  const createCashOrder = async () => {
    if (!cart || !selectedAddress) return;
    setProcessingType("cash");

    try {
      await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cart._id}`,
        { shippingAddress: selectedAddress },
        { headers: { token } }
      );

      toast.success("Order placed successfully");
      router.push("/order");
    } catch {
      toast.error("Failed to create order");
    } finally {
      setProcessingType(null);
    }
  };

  const createOnlineOrder = async () => {
    if (!cart || !selectedAddress) return;
    setProcessingType("online");

    try {
      const res = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart._id}?url=${window.location.origin}/order`,
        { shippingAddress: selectedAddress },
        { headers: { token } }
      );

      window.location.href = res.data.session.url;
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessingType(null);
    }
  };

  /* ================= UI STATES ================= */
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!cart || cart.products.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        Cart is empty
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= Stepper ================= */}
        <div className="flex items-center justify-center gap-4 font-semibold text-sm md:text-base">
          <span className="flex items-center gap-2 text-green-500">
            <FaCheckCircle /> Cart
          </span>
          <span className="px-3 py-1 rounded-full bg-[#F3E8E0] text-[#A47864]">
            Checkout
          </span>
          <span className="text-gray-400">Confirmation</span>
        </div>

        {/* ================= Addresses ================= */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

          {showAddressForm ? (
            <form onSubmit={submitAddress} className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  value={value}
                  placeholder={key}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="w-full border p-3 rounded"
                  required
                />
              ))}

              <div className="flex gap-3">
                <button className="flex-1 bg-[#A47864] text-white py-3 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            </form>
          ) : (
            <>
              {addresses.map((address) => (
                <div
                  key={address._id}
                  onClick={() => setSelectedAddress(address)}
                  className={`border rounded-xl p-4 mb-3 cursor-pointer ${
                    selectedAddress?._id === address._id
                      ? "border-[#A47864]"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-sm">{address.details}</p>
                  <p className="text-sm">{address.city}</p>
                  <p className="text-sm">{address.phone}</p>

                  <div className="flex gap-3 mt-2">
                    <FaEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(address);
                      }}
                    />
                    <FaTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(address._id);
                      }}
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowAddressForm(true)}
                className="text-[#A47864] font-semibold"
              >
                + Add new address
              </button>
            </>
          )}
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
            <span className="font-bold text-[#A47864] text-xl">Total:</span>
            <span className="font-bold text-[#A47864] text-2xl">
              {cart.totalCartPrice} $
            </span>
          </div>
        </div>

        {/* ================= Payment ================= */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex gap-4 mb-4">
            {(["cash", "card"] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 border p-4 rounded ${
                  paymentMethod === method
                    ? "border-[#A47864]"
                    : "border-gray-300"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <p className="font-semibold text-[#A47864]">
              {" "}
              Selected Payment:{" "}
              {paymentMethod === "cash" ? "Cash on Delivery" : "Card / Online"}
            </p>
          </div>

          <button
            disabled={!selectedAddress || processingType !== null}
            onClick={
              paymentMethod === "cash" ? createCashOrder : createOnlineOrder
            }
            className="w-full bg-[#A47864] text-white py-3 rounded"
          >
            {processingType ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
