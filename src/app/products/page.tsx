"use client";
import React, { Suspense } from "react";
import Products from "../components/home/Products";

export default function ProductsPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}

