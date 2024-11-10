import React from 'react';
import './App.css';
import MyNav from './components/MyNav';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from './pages/Category';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import { CartProvider } from './cartContext';
import { WishlistProvider } from './wishlistContext';
import Wishlist from './pages/Wishlist';
import CheckoutPage from './pages/CheckoutPage';
import Completed from './pages/Completed';
import AboutUs from './pages/AboutUs';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import { UserProvider } from './userContext';

const App = () => {

  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
            <BrowserRouter>
              <MyNav />
              <Routes>
                <Route index path='/' element={<Home />} />
                <Route path='/category/:cat' element={<Category />} />
                <Route path='/product/:id' element={<ProductDetails />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/login' element={<Login />} />
                <Route path='/checkout' element={<CheckoutPage />} />
                <Route path='/completed' element={<Completed />} />
                <Route path='/about-us' element={<AboutUs />} />
                <Route path='/*' element={<NotFound />} />

              </Routes>
              <Footer />
            </BrowserRouter>
          </div>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
