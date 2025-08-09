"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface FiltersProps {
  categories: Category[];
  brands: Brand[];
}

const Filters: React.FC<FiltersProps> = ({ categories, brands }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Category Filter */}
      <select
        onChange={(e) => handleFilterChange("categoryId", e.target.value)}
        defaultValue={searchParams.get("categoryId") || ""}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Brand Filter */}
      <select
        onChange={(e) => handleFilterChange("brandId", e.target.value)}
        defaultValue={searchParams.get("brandId") || ""}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>

      {/* Price Sort */}
      <select
        onChange={(e) => handleFilterChange("price", e.target.value)}
        defaultValue={searchParams.get("price") || ""}
        className="border border-[#A47864] bg-white text-[#A47864] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#A47864]"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Lowest to Highest</option>
        <option value="desc">Highest to Lowest</option>
      </select>
    </div>
  );
};

export default Filters;
