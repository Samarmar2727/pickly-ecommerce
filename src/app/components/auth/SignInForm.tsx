'use client'; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import ResetPasswordModal from './ResetPasswordModal';

const SignInForm = () => {
 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter();

  // useEffect hook to check for an existing token on component mount.
  // If a token is found, it means the user is already logged in, so redirect to '/home'.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    }
  }, [router]); // Dependency array ensures this effect runs only when router object changes.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(''); // Clear any previous error messages.
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
          headers: { 'Content-Type': 'application/json' }, // Specify content type as JSON.
        }
      );
      console.log('API Response:', res);

      const token = res.data.token;
      localStorage.setItem('token', token); // Store the authentication token in local storage.
      router.push('/home'); 


    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
        setError(message); 
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Always reset loading state after the API call completes (success or failure).
    }
  };

  return (
    
    <section className="w-1/2 p-12 sm:p-8 xs:p-4 flex items-center justify-center bg-white px-4 py-12">
      <div>
        {/* Sign-in title. */}
        <h2 className="text-3xl sm:text-2xl font-bold text-red-500 mb-6 text-center">
          Sign In
        </h2>

        {/* Error message display area. */}
        {error && (
          <div className="mb-4 text-red-600 font-medium text-sm text-center">
            {error}
          </div>
        )}

        {/* The sign-in form. */}
        <form onSubmit={handleSubmit} className="space-y-5">
        {/* Social media sign-in buttons section. */}
            <div className="flex items-center justify-center space-x-4">
            <button className="p-3 sm:p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer" aria-label="Sign in with Google">
              <FaGoogle className="w-5 h-5 sm:w-4 sm:h-4 text-[#DB4437]" />
            </button>
            <button className="p-3 sm:p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer" aria-label="Sign in with Facebook">
              <FaFacebookF className="w-5 h-5 sm:w-4 sm:h-4 text-[#4267B2]" />
            </button>
            <button className="p-3 sm:p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer" aria-label="Sign in with LinkedIn">
              <FaLinkedinIn className="w-5 h-5 sm:w-4 sm:h-4 text-[#0077B5]" />
            </button>
            <button className="p-3 sm:p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer" aria-label="Sign in with GitHub">
              <FaGithub className="w-5 h-5 sm:w-4 sm:h-4 text-black" />
            </button>
          </div>
          <div className="flex items-center justify-center text-gray-500">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4">or use your account?</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Email input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              // Apply custom focus ring color.
              className="w-full px-4 py-2 sm:px-3 sm:py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Password input field. */}
          <div>
            <label className="block text-sm text-text-primary mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 sm:px-3 sm:py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-accent"
            />
          </div>

          {/* Forgot password link. */}
          <button
            onClick={() => setShowResetModal(true)}
            className="text-sm text-[#C0D6E4] hover:underline text-center block"
          >
            Forgot your password?
          </button>

          {/* Submit button for sign-in. */}
          <button
            type="submit"
            className="w-full bg-[#A47864] text-white py-2 sm:py-1.5 rounded-lg font-semibold  text-base sm:text-sm hover:bg-[#C0D6E4] hover:text-white cursor-pointer transition transition-colors flex justify-center disabled:bg-opacity-70 disabled:cursor-not-allowed"
            disabled={loading} // Disable button when loading.
          >
            {loading ? 'Loading...' : 'Log In'} {/* Button text changes based on loading state. */}
          </button>
          <button
                    onClick={() => router.push('/home')}
                    className="text-sm text-gray-500 underline mt-4 cursor-pointer"
                  >
                    Skip for now
                  </button>

                  {/* Modal */}
              {showResetModal && (
                <ResetPasswordModal onClose={() => setShowResetModal(false)} />
              )}
              
               
       
        </form>
      </div>
    </section>
  );
};

export default SignInForm;
