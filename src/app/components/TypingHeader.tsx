'use client'; 

import React, { useState, useEffect } from 'react';
import { Playfair_Display } from 'next/font/google';

// Import the Playfair Display font from Google Fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

// Define the props type for the component
type TypingHeaderProps = {
  messages: string[]; // An array of messages to display one after another
};

// TypingHeader component to simulate typing and deleting effect
const TypingHeader = ({ messages }: TypingHeaderProps) => {
  const [currentText, setCurrentText] = useState(''); // The text currently being displayed
  const [messageIndex, setMessageIndex] = useState(0); // Index of the current message
  const [charIndex, setCharIndex] = useState(0); // Index of the current character in the message
  const [isDeleting, setIsDeleting] = useState(false); // Indicates if we are in the deleting phase

  useEffect(() => {
    // Function to handle typing and deleting logic
    const handleTyping = () => {
      const fullText = messages[messageIndex]; // Get the full current message

      if (!isDeleting) {
        // Typing characters
        if (charIndex < fullText.length) {
          setCurrentText(prev => prev + fullText.charAt(charIndex));
          setCharIndex(prev => prev + 1);
        } else {
          // Once typing is complete, wait before starting to delete
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting characters
        if (charIndex > 0) {
          setCurrentText(prev => prev.substring(0, prev.length - 1));
          setCharIndex(prev => prev - 1);
        } else {
          // Once deleting is complete, move to the next message
          setIsDeleting(false);
          setMessageIndex(prev => (prev + 1) % messages.length);
        }
      }
    };

    // Typing/deleting speed
    const typingSpeed = isDeleting ? 75 : 150;
    const timer = setTimeout(handleTyping, typingSpeed);

    // Cleanup function to clear the timer when component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, messageIndex, messages]);

  return (
    // Display the current text and a blinking cursor
    <h1 className={`${playfair.className} text-4xl font-bold`}>
      {currentText}
      {/* Blinking cursor */}
      <span className="inline-block w-1 h-8 bg-white animate-blink ml-1"></span>
    </h1>
 
  );
};

export default TypingHeader;
