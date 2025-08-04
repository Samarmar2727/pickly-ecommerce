'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {

  const handleScroll = () => {
    const section = document.getElementById('products');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh]  w-full flex items-center justify-center text-center overflow-hidden">
      {/*Background*/}
        <Image
            src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80"
            alt="Shopping Background"
            fill
            className="object-cover w-full h-full z-0 opacity-80"
            priority
        />

      {/* shadow*/}
      <div className="absolute inset-0 bg-[#A47864]/70 z-10"></div>

      {/* content*/}
      <motion.div
        className="z-20 text-white max-w-2xl px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Your new shopping journey begins here.
        </h1>
        <button
          onClick={handleScroll}
          className="mt-6 bg-[#faebd7] text-[#A47864] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-white transition"
        >
         Pick Your Favorites!
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
