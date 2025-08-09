"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";


const images = [
  "/images/hero0.jpg",
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
  "/images/hero6.jpg",

]

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <motion.div
        key={currentImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <Image
          src={images[currentImage]}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-1000"
        />
      </motion.div>
       {/* shadow */}
      <div className="absolute inset-0 bg-[#A47864]/40 z-10"></div>

      {/* زر CTA */}
      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <Link href="/products">
          <span className="bg-[#A47864] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#8b5e4d] transition-colors duration-300">
            Shop Now
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;