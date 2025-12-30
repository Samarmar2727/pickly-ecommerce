"use client"; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import ResetPasswordModal from './ResetPasswordModal';

type SignInFormProps = {
  onSignUpClick?: () => void; // to open sign Up Modal
};

const SignInForm = ({ onSignUpClick }: SignInFormProps) => {
 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setLoading(true); 

    const API_URL = 'https://ecommerce.routemisr.com/api/v1/auth/signin';

    try {
      const res = await axios.post(
        API_URL,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('API Response:', res);

      const token = res.data.token;
      localStorage.setItem('token', token);
      router.push('/home'); 

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
        setError(message); 
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        {/* Sign-in title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#C0D6E4] mb-6 text-center">
          Sign In
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-600 font-medium text-sm text-center">
            {error}
          </div>
        )}

        {/* Sign-in form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Social media buttons */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <button 
              type="button"
              className="p-2 sm:p-3 border rounded-full hover:bg-gray-100 transition cursor-pointer" 
              aria-label="Sign in with Google"
            >
              <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5 text-[#DB4437]" />
            </button>
            <button 
              type="button"
              className="p-2 sm:p-3 border rounded-full hover:bg-gray-100 transition cursor-pointer" 
              aria-label="Sign in with Facebook"
            >
              <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 text-[#4267B2]" />
            </button>
            <button 
              type="button"
              className="p-2 sm:p-3 border rounded-full hover:bg-gray-100 transition cursor-pointer" 
              aria-label="Sign in with LinkedIn"
            >
              <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5 text-[#0077B5]" />
            </button>
            <button 
              type="button"
              className="p-2 sm:p-3 border rounded-full hover:bg-gray-100 transition cursor-pointer" 
              aria-label="Sign in with GitHub"
            >
              <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-3 sm:mx-4 whitespace-nowrap">or use your account?</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0D6E4]"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0D6E4]"
            />
          </div>

          {/* Forgot password */}
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-sm text-[#C0D6E4] hover:underline text-center block w-full"
          >
            Forgot your password?
          </button>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#A47864] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#C0D6E4] hover:text-white cursor-pointer transition-colors flex justify-center items-center disabled:bg-opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>

          {/* Skip button */}
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-sm text-gray-500 hover:underline text-center block w-full cursor-pointer"
          >
            Skip for now
          </button>

          {/*Sign Up button show on mobile only */}
          {onSignUpClick && (
            <div className="md:hidden pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">
                Don't have an account?
              </p>
              <button
                type="button"
                onClick={onSignUpClick}
                className="w-full bg-white border-2 border-[#A47864] text-[#A47864] font-semibold py-2 rounded-lg hover:bg-[#A47864] hover:text-white cursor-pointer transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </form>

        {/* Reset Password Modal */}
        {showResetModal && (
          <ResetPasswordModal onClose={() => setShowResetModal(false)} />
        )}
      </div>
    </section>
  );
};

export default SignInForm;