import React from 'react';
import './App.css';
import MyNav from './components/MyNav';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Category from './pages/Category';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import { CartProvider } from './cartContext';
import { WishlistProvider } from './wishlistContext';
import { SettingsProvider } from './settingsContext';
import Wishlist from './pages/Wishlist';
import CheckoutPage from './pages/CheckoutPage';
import Completed from './pages/Completed';
import AboutUs from './pages/AboutUs';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import AdminHome from './Admin/AdminHome';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ExchangeReturns from './pages/ExchangeReturns';
import TermsConditions from './pages/TermsConditions';
import ContactUs from './pages/ContactUs';
import { UserProvider } from './userContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {

  return (
    <UserProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </UserProvider>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/secret-admin-portal');

  return (
    <div className="App">
      {!isAdminRoute && <MyNav />}
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/category/:cat' element={<Category />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/very-secret-login' element={<Login />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/completed' element={<Completed />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/shipping-policy' element={<ShippingPolicy />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/exchange-returns' element={<ExchangeReturns />} />
        <Route path='/terms-conditions' element={<TermsConditions />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/secret-admin-portal' element={
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        } />
        <Route path='/*' element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
