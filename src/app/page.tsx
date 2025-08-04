
'use client';
import { useState } from 'react';
import Link from "next/link";
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
  // State to control the visibility of the Sign Up modal.
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  return (
    <>
   <div className="relative w-full h-20 text-white">
  {/* Background with clip-path */}
  <div className="absolute inset-0 clip-wave bg-gradient-to-r from-[#A47864] via-[#C0D6E4] to-[#A47864] z-0"></div>
  {/* logo */}
     <Link href="/home">
            <h1 className="text-3xl font-extrabold tracking-wide text-[#C0D6E4] cursor-pointer">
              Pick<span className="text-[#faebd7] italic">ly</span>
            </h1>
          </Link>

  {/* Text on top */}
  <div className="relative z-10 flex items-center justify-center h-full">
    <TypingHeader messages={messages} />
  </div>
</div>

    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-display">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Left part: Sign In section. */}
          <SignInForm />
        {/* Right part: Sign Up prompt section. */}
        <SignUpPrompt onSignUpClick={() => setIsSignUpModalOpen(true)} />
        </div>
      
      {/* The Sign Up Modal. */}
      {/* Its visibility is controlled by the isSignUpModalOpen state. */}
      {/* It also receives a function to close itself. */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
    </div>
    </>
  );
}
