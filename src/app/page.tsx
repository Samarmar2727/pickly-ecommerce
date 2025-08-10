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
      {/* Header - hidden on mobile */}
      <div className="relative w-full h-20 text-white hidden md:block">
        <div className="absolute inset-0 clip-wave bg-gradient-to-r from-[#A47864] via-[#C0D6E4] to-[#A47864] z-0"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <TypingHeader messages={messages} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-display">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Left: Sign In */}
          <div className="w-full md:w-1/2 p-4">
            <SignInForm />
          </div>

          {/* Right: Sign Up prompt */}
          <div className="w-full md:w-1/2 p-4">
            <SignUpPrompt onSignUpClick={() => setIsSignUpModalOpen(true)} />
          </div>
        </div>

        {/* Sign Up Modal */}
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
        />
      </div>
    </>
  );
}
