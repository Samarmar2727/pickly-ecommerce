
import React from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection"
import Categories from "../components/home/Categories"
import Brands from "../components/home/Brands"
import Products from "../components/home/Products"

const HomePage = () => {
  return (
    <>
    <Header/>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
     <HeroSection/>
      <main>
                <Categories />
                <Brands />
                <Products/>
        </main>
    </div>
    <Footer/>
    </>
  
  );
};

export default HomePage;