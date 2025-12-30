'use client'; 

import React from 'react';
type SignUpPromptProps = {
  onSignUpClick: () => void; // Function to call when the "Sign Up" button is clicked.
};

const SignUpPrompt = ({ onSignUpClick }: SignUpPromptProps) => {
  return (
    // The main container for the Sign Up section.
    // It's still 1/2 width but has a `relative` position for the pseudo-element.
     <div 
      className=" hidden md:flex w-1/2 bg-[#A47864] text-white p-12 sm:p-6 relative overflow-hidden flex-col justify-center items-center rounded-r-xl"
      style={{  clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0% 50%)' }}
 >
      {/* Content for the Sign Up section. We use a higher z-index to ensure it's visible.*/}
      <h2 className="text-3xl font-bold mb-4 z-10 text-center">Hello, Friend!</h2>
      <p className="mb-8 z-10 text-center">Enter your personal details and start your journey with us.</p>
      
      <button
        onClick={onSignUpClick}
        className="w-full max-w-xs bg-[#A47864] border-2 border-white text-white font-semibold py-3 px-6 rounded-2xl hover:bg-[#C0D6E4] hover:text-white cursor-pointer transition duration-300 z-10"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpPrompt;