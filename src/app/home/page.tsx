'use client';

import React,  { Suspense } from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection"
//import Categories from "../components/home/Categories"
import Brands from "../components/home/Brands"
//import Filters from "../components/home/Filters"
import Products from "../components/home/Products"
import TypingHeader from "../components/TypingHeader"
import { motion } from "framer-motion";


const messages =[
  "Welcome to Your Dream Store...",
  "Your new shopping journey begins here."

]

const HomePage = () => {
  return (
    <>
    <Header/>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className= "text-5xl font-extrabold text-center text-[#C0D6E4] mt-12 mb-6"
        >
          <TypingHeader messages = {messages}/>
         
      </motion.div>

     <HeroSection/>
      <main>
                <Brands />
                   <Suspense>
                      <Products />
                  </Suspense>

        </main>
    </div>
    <Footer/>
    </>
  
  );
};

export default HomePage;