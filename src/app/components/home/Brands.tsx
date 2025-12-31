"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SectionHeading from "../SectionHeading";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/brands"
        );
        setBrands(response.data.data);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message || "Failed to fetch brands.";
          setError(message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return; // if tap not active (performance)
      if (carouselRef.current) {
        const container = carouselRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        // if reachout  to end return to start
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-[#A47864] animate-pulse">
        Loading brands...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-10 bg-[#C0D6E4]">
      <div className="container mx-auto px-4">
        <SectionHeading title="Shop by Brand" icon="🛍️" />

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-[#A47864]" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-6 scroll-smooth overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden w-screen md:w-auto px-4 touch-pan-x md:overflow-hidden"
          >
            {brands.map((brand) => (
              <Link key={brand._id} href={`/products?brandId=${brand._id}`}>
                <div
                  className="
                    min-w-[120px] min-h-[120px] sm:min-w-[140px] sm:min-h-[140px]
                    bg-white rounded-full p-2 shadow-lg border-2 border-[#A47864]
                    flex items-center justify-center overflow-hidden
                    transition-transform duration-300 hover:scale-110
                  "
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain rounded-full"

                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-[#A47864]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Brands;
