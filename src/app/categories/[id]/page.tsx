'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Subcategory {
  _id: string;
  name: string;
  category: {
    _id: string;
  };
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
}

const CategoryPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // get subcategories & brands once
  useEffect(() => {
    axios
      .get('https://ecommerce.routemisr.com/api/v1/subcategories')
      .then(res => setSubcategories(res.data.data))
      .catch(err => console.error('Error fetching subcategories:', err));

    axios
      .get('https://ecommerce.routemisr.com/api/v1/brands')
      .then(res => setBrands(res.data.data))
      .catch(err => console.error('Error fetching brands:', err));
  }, []);

  // fetch products based on filters
  useEffect(() => {
    if (!id) return;

    let url = `https://ecommerce.routemisr.com/api/v1/products?category=${id}`;

    if (selectedSubcategory) {
      url += `&subCategory=${selectedSubcategory}`;
    }

    if (selectedBrand) {
      url += `&brand=${selectedBrand}`;
    }

    axios
      .get(url)
      .then(res => setProducts(res.data.data))
      .catch(err => console.error('Error fetching products:', err));
  }, [id, selectedSubcategory, selectedBrand]);

  const filteredSubcategories = subcategories.filter(sub => sub?.category?._id === id);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>

      {/* Subcategory Filter */}
      <div className="mb-4">
        <h3 className="font-semibold">Subcategories:</h3>
        <div className="flex gap-2 flex-wrap">
          {filteredSubcategories.map(sub => (
            <button
              key={sub._id}
              className={`px-3 py-1 border rounded ${selectedSubcategory === sub._id ? 'bg-black text-white' : ''}`}
              onClick={() => setSelectedSubcategory(sub._id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <h3 className="font-semibold">Brands:</h3>
        <div className="flex gap-2 flex-wrap">
          {brands.map(brand => (
            <button
              key={brand._id}
              className={`px-3 py-1 border rounded ${selectedBrand === brand._id ? 'bg-black text-white' : ''}`}
              onClick={() => setSelectedBrand(brand._id)}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product._id} className="border p-2 rounded shadow-sm">
            <Image
              src={product.imageCover}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="mt-2 font-semibold text-sm">{product.title}</h4>
            <p className="text-sm text-gray-600">{product.price} EGP</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
