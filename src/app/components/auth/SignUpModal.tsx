
'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios'; 

type SignUpModalProps = {
  isOpen: boolean; // Controls the visibility of the modal.
  onClose: () => void; // Function to call when the modal needs to be closed.
};


const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '', 
    phone: '',
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // If the modal is not open, return null to render nothing.
  if (!isOpen) {
    return null;
  }

  // Handles changes in form input fields, updating the formData state.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles the form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(''); 

    // Validate if passwords match.
    if (formData.password !== formData.rePassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return; // Stop the submission process.
    }
    
    const API_URL = 'https://ecommerce.routemisr.com/api/v1/auth/signup';

    try {
      const res = await axios.post(API_URL, formData);
      console.log('Success:', res.data);

      // If signup is successful and a token is received, store it and redirect.
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token); // Store the authentication token.
        onClose(); 
        router.push('/home'); 
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Extract error message from Axios error response.
        const message = err.response?.data?.message || 'Something went wrong. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure.
    }
  };

  return (
   
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-500 bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8 m-4">
        
        {/* Close button for the modal. */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          {/* SVG icon for the close button (an 'X'). */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal title. */}
        <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Create Account</h2>

        {/* Error message display area. */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Signup form. */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Email input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Phone input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Password input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Confirm Password input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="rePassword">Confirm Password</label>
            <input
              id="rePassword"
              name="rePassword"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Submit button for signup. */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading.
            className="w-full bg-[#A47864] text-white py-2 rounded-lg font-semibold hover:bg-[#4caf50]/90 transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'} {/* Button text changes based on loading state. */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
