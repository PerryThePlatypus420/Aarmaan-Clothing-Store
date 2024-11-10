# Clothing-Store-Website

This project is a React-based clothing store website with Bootstrap styling. It provides a user-friendly interface for browsing and purchasing clothing items online.

## Features

- Responsive design with header, footer, and navigation bar
- Category pages for easy product browsing
- Products and their details are fetched from the backend
- Product cards displaying item details
- Product details page showing the description, design details, and fabric composition of the product
- Add to wishlist functionality
- Add to cart functionality
- Order placement with delivery information input
- User signup, signin and signout functionality using JWT

## Technologies Used

- MERN stack
- Bootstrap
- MdBootstrap

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/PerryThePlatypus420/Clothing-Store-Website.git
   ```

2. Navigate to the project directory:
   ```
   cd clothing-store-website
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit the corresponding localhost to view the website.

## Project Structure

All the products are defind in a collection in the mongodb database
All the routes are defind in the root element i.e App.js file.
Any route other than the defined routes lead to a NotFound page.
The main three functionalities added are the wishlist, cart and user accounts functionalities. All of them are implemented using Context Hooks of React and are integrated with the backend.

## Usage

The user can go to the category pages through the category dropdown in the navbar and also through the category icons on homepage.
The product can be added to or removed from the wishlist by clicking on the heart icon in the product card or the product details page.
The wishlist can be viewed any time by clicking the wishlist icon in the navbar.
The product can be added to the cart by clicking on the "Add to cart" button in the product card or the product details page.
The cart can be viewed any time by clicking the cart icon in the navbar.
The order can then be placed by proceeding from cart to the delivery info and filling the form to compete the order.
The user can navigate to the login/register page by clicking on the user icon in the navbar.
A registered user can login to his account.
A logged in user can logout from his account.
