'use client';
import { useState } from 'react';
import TypingHeader from './components/TypingHeader';
import SignInForm from './components/auth/SignInForm';
import SignUpModal from './components/auth/SignUpModal';
import SignUpPrompt from './components/auth/SignUpPrompt';

export default function OnboardingPage() {
  const messages = [
    "Welcome to our Pickly store!",
    "Discover the latest trends and styles.",
    "Your new shopping journey begins here."
  ];

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <>
      {/* Header Section */}
     <div className="hidden md:flex relative w-full h-20 text-white justify-center items-center">
        {/* Background with clip-path */}
        <div className="absolute inset-0 clip-wave bg-gradient-to-r from-[#A47864] via-[#C0D6E4] to-[#A47864] z-0"></div>

        {/* Text on top */}
        <div className=" z-10 text-center h-full px-4">
          <TypingHeader messages={messages} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4 font-display">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Left part: Sign In section */}
          <SignInForm onSignUpClick={() => setIsSignUpModalOpen(true)} />
          
          {/* Right part: Sign Up prompt (hidden on mobile) */}
          <SignUpPrompt onSignUpClick={() => setIsSignUpModalOpen(true)} />
        </div>
      </div>

      {/* Sign Up Modal */}
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
      />
    </>
  );
}