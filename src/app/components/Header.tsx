'use client'
import Link from "next/link";
import {useState } from 'react';
import { TagIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import LogOutModal from "./auth/LogOutModal";
import { useRouter } from "next/navigation";



export default function Header() {
// to store the value of search
   const [searchQuery, setSearchQuery] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>)  => {
        // if the Enter key press
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            // navigating the user to the products page and passing the search value as a query params 
            router.push(`/products?keyword=${searchQuery}`);
        }
    };

  return (
    
    <header className="bg-[#A47864] text-white p-4 flex justify-between items-center">
      
      <Link href="/">
       <TagIcon className="text-[#C0D6E4] w-6 h-6" />
          <h1 className="text-3xl font-extrabold tracking-wide text-[#C0D6E4] cursor-pointer">
            Pick<span className="text-[#faebd7] italic">ly</span>
          </h1>
        </Link>
      <div className="flex items-center gap-4">
        <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
             onKeyDown={handleSearch} // Handeling the Enter key press
            className="px-4 py-2 rounded-md bg-[#C0D6E4] text-[#A47864] placeholder-[#A47864] focus:outline-none focus:ring-2 focus:ring-[#A47864] transition duration-200"
          />


        <button aria-label="Cart" className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-white cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-[#C0D6E4] text-[#A47864] text-xs rounded-full px-1 ">
            0
          </span>
        </button>
        <button
            onClick={() => setShowLogoutModal(true)}
            className="text-sm bg-[#A47864] text-white px-4 py-2 rounded-md hover:bg-[#c2917c] transition duration-200 cursor-pointer"
          >
            Logout
        </button>



          {/*Logout Modal*/ }
          <LogOutModal 
             isOpen={showLogoutModal}
             onClose={() => setShowLogoutModal(false)}
             />
          
      
      </div>
    </header>
  );
}
