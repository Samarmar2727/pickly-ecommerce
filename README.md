# 🛒 Pickly - E-commerce Project

**Pickly** is a complete e-commerce web application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.  
It provides product browsing, category & brand filtering, search functionality, authentication, order placement, and an onboarding flow.

---

## 🚀 Tech Stack

- **Next.js 15** – App Router
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Framer Motion** – Animations
- **React Icons** – Icons
- **React Context API** – State management
- **REST APIs** – `https://ecommerce.routemisr.com/api/v1`

---

## 📂 Project Structure

src/
app/
home/ # Home page
products/ # Product listing
products/[id]/ # Product details
checkout/ # Checkout page
orders/ # Order placement page
onboarding/ # Onboarding flow
layout/ # Layout wrapper
components/ # Reusable UI components
context/ # Global state management

---

## ✨ Features

- Real authentication (Login & Register via API).
- Category & subcategory filtering from navbar dropdown.
- Brand filtering & display.
- Search functionality in header.
- Animated hero section.
- Product listing with filtering by category, brand, and price range.
- Product details page with gallery and extra info.
- Wishlist modal to view saved items.
- Cart modal with checkout button.
- Checkout page with shipping & payment details.
- Order confirmation page.

---

## 🖥️ Pages Overview

### **Onboarding Page (`src/app/onboarding/page.tsx`)**

- Welcome screen for first-time users.
- Features:
  - **Animated Typing Header** with rotating welcome messages.
  - **Sign In Form** for returning users.
  - **Sign Up Prompt** with modal-based registration.
- UI:
  - Gradient wave-shaped header.
  - Two-column layout (Sign In & Sign Up).
  - Responsive, modern design.

---

### **Root Layout (`src/app/layout.tsx`)**

- Global wrapper for the entire application.
- Wraps all pages with:
  - `<CartProvider>` for cart state.
  - `<WishlistProvider>` for wishlist state.
- Applies global styles from `globals.css`.
- Sets up `<html lang="en">` and base colors.

---

### **Header (`src/components/home/Header.tsx`)**

- Main navigation bar.
- Features:
  - Site logo.
  - Search bar (navigates to `/products` with `keyword` query).
  - Category & subcategory dropdown menus.
  - Cart and wishlist icons (open modals).
  - Logout button.

---

### **Brands (`src/components/home/Brands.tsx`)**

- Fetches brands from `GET /v1/brands`.
- Displays brand logos in a circular style.
- Clicking a brand navigates to `/products` filtered by `brandId`.

---

### **Products Page (`src/app/products/page.tsx`)**

- Displays a grid of products with filtering and search.
- Fetches from `GET /v1/products`.
- Reads URL query parameters:
  - `keyword`
  - `categoryId`
  - `brandId`
- Each product links to its detail page.

---

### **Product Detail Page (`src/app/products/[id]/page.tsx`)**

- Fetches product data from `GET /v1/products/:id`.
- Displays:
  - Main image & gallery.
  - Description, price, ratings.
  - Additional product info.

---

### **Orders Page (`src/app/orders/page.tsx`)**

- Displays a list of placed orders for the authenticated user.
- Shows order details such as product list, total amount, and status.

---

## 🧭 User Flow

1. User lands on Onboarding Page → chooses to Log in or Register.
2. Redirect to Home Page with:
   - Header (search, categories dropdown, wishlist & cart modals).
3. Hero Section welcomes the user.
4. Brands component shows available brands.
5. Products section:
   - Filtering options.
   - Product cards linking to details page.
6. Wishlist modal → view saved products.
7. Cart modal → view cart & checkout.
8. Checkout page → enter shipping & payment details.
9. Order confirmation → redirect to Home.

---

## 🔮 Future Enhancements

- Add "Add to Cart" directly from Wishlist modal.
- Implement persistent cart & wishlist storage.
- Add product reviews and ratings.
- Improve category & subcategory filtering UI.

---
