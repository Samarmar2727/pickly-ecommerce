# Pickly - E-commerce Project

This document provides an overview of the components created for the e-commerce project, built with **_Next.js_**, **_TypeScript_**, and **_Tailwind CSS_**. The project is designed to display products, categories, and brands interactively, with features for searching and filtering.

## Core Components

### src/components/home/Header.tsx

This component represents the main navigation bar.
Functionality: Displays the site logo, a search bar, a cart icon, and a logout button.

## Key Features:

- Search: When a user types a query and presses Enter, it navigates to the products page, passing the search term as a URL query parameter (keyword).

- Interactivity: Uses useState to manage the search input state and useRouter for programmatic navigation.

## src/components/home/Categories.tsx

This component is responsible for displaying the main product categories.
Functionality: Fetches categories from the API and renders them as clickable cards.

## Key Features:

- Data Fetching: Uses useEffect to fetch the list of categories from the GET /v1/categories API.
- Filtering: Each category card is a Link that redirects the user to the products page, filtering by that category's ID (categoryId).

## src/components/home/Brands.tsx

This component displays the available product brands.

Functionality: Fetches brands from the API and displays their logos in a circular layout.

## Key Features:

- Data Fetching: Uses useEffect to fetch the brands from the GET /v1/brands API.
- Filtering: Each brand logo is a Link that takes the user to the products page, filtering by that brand's ID (brandId).

## src/app/products/page.tsx

This is the main page for displaying the product list.

Functionality: Displays products and supports dynamic filtering and searching.

## Key Features:

- API Control: Uses useEffect to fetch products from the GET /v1/products API.
- Dynamic Filtering: Reads URL query parameters (keyword, categoryId, brandId) using useSearchParams and adjusts the API call accordingly.
- Product Display: Renders a grid of products, where each product card is a Link to its detail page.

## src/app/products/[id]/page.tsx

This is a dynamic route for displaying the details of a specific product.
Functionality: Fetches and renders detailed information for a single product based on the ID in the URL.

## Key Features:

- ID Access: Uses the params object from the Next.js App Router to get the product ID from the URL path.
- Data Fetching: Uses useEffect to fetch product details from the GET /v1/products/:id API.
- Detail Display: Shows the main product image, a gallery of other images, a description, price, and ratings.

#### APIs Used

- `GET https://ecommerce.routemisr.com/api/v1/categories`
- `GET https://ecommerce.routemisr.com/api/v1/brands`
- `GET https://ecommerce.routemisr.com/api/v1/products`
- `GET https://ecommerce.routemisr.com/api/v1/products/:id`
