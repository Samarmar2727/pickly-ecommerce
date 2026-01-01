"use client";

import { useState } from "react";

export default function ResetPasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been reset successfully ✅");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.message || "Something went wrong ❌");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("Network error. Please try again later ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 px-2 py-1 text-lg text-gray-600 hover:text-red-600 bg-transparent hover:bg-gray-200 rounded-md transition duration-200"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Your Password
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />

        {message && (
          <p className="text-center text-sm mb-3 text-gray-700">{message}</p>
        )}

        <button
          className="w-full bg-[#A47864] hover:bg-[#C0D6E4] hover:text-white cursor-pointer text-white py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
