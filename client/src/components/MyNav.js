import React, { useState, useEffect, useContext } from 'react';
import './MyNav.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../cartContext';
import { WishlistContext } from '../wishlistContext';
import { FiMenu, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;

function MyNav() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/api/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar');
            if (isSidebarOpen && sidebar && !sidebar.contains(event.target) && !event.target.classList.contains('sidebar-toggle')) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    return (
        <div className="nav-main">
            <nav className="navbar navbar-expand-lg navbar-light bg-light nav-bottom">
                <div className="container">
                    <Link to='/' className="navbar-brand swoosh-brand">
                        <span className="swoosh-text titan-one-regular">آرمان</span>
                    </Link>
                    
                    <div className="navbar-nav d-none d-lg-flex">
                        <Link to="/" className="nav-link">Home</Link>
                        <div className="nav-item dropdown">
                            <div className="nav-link dropdown-toggle d-flex align-items-center" 
                                id="navbarDropdown" role="button" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Categories <IoIosArrowDown className="ms-1" />
                            </div>
                            <ul className="dropdown-menu dropdown-menu-animate" aria-labelledby="navbarDropdown">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <Link className="dropdown-item" to={`/category/${category.category}`}>{category.category}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to='/about-us' className="nav-link">About Us</Link>
                    </div>
                    
                    <div className="nav-actions">
                        <Link to='/wishlist' className="nav-icon-link">
                            <div className="nav-icon-container">
                                <FaHeart className="nav-icon" />
                                <span className="icon-badge">{Object.keys(wishlist).length}</span>
                            </div>
                        </Link>
                        
                        <Link to='/cart' className="nav-icon-link">
                            <div className="nav-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" id="cart-svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M22.713,4.077A2.993,2.993,0,0,0,20.41,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H1A1,1,0,0,0,1,2h.222a1,1,0,0,1,.993.883l1.376,11.7A5,5,0,0,0,8.557,19H19a1,1,0,0,0,0-2H8.557a3,3,0,0,1-2.82-2h11.92a5,5,0,0,0,4.921-4.113l.785-4.354A2.994,2.994,0,0,0,22.713,4.077ZM21.4,6.178l-.786,4.354A3,3,0,0,1,17.657,13H5.419L4.478,5H20.41A1,1,0,0,1,21.4,6.178Z" />
                                    <circle cx="7" cy="22" r="2" />
                                    <circle cx="17" cy="22" r="2" />
                                </svg>
                                <span className="icon-badge">{cart.count}</span>
                            </div>
                        </Link>

                        <div className="sidebar-toggle" onClick={toggleSidebar}>
                            <FiMenu className="menu-icon" />
                        </div>
                    </div>

                    <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                        <div className="sidebar-header">
                            <span className="sidebar-brand titan-one-regular">آرمان</span>
                            <FiX className="close-btn" onClick={toggleSidebar} />
                        </div>
                        
                        <div className="sidebar-links">
                            <Link to="/" onClick={toggleSidebar} className="sidebar-link">Home</Link>
                            <div className="sidebar-dropdown">
                                <div className="dropdown-toggle-container" onClick={toggleCategory}>
                                    <span className="dropdown-toggle">Categories</span>
                                    <IoIosArrowDown className={`dropdown-icon ${isCategoryOpen ? 'rotated' : ''}`} />
                                </div>
                                <div className={`dropdown-content ${isCategoryOpen ? 'show' : ''}`}>
                                    {categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            to={`/category/${category.category}`}
                                            onClick={() => {
                                                toggleSidebar();
                                                setIsCategoryOpen(false);
                                            }}
                                            className="dropdown-link"
                                        >
                                            {category.category}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <Link to='/about-us' onClick={toggleSidebar} className="sidebar-link">About Us</Link>
                            
                            <div className="sidebar-divider"></div>
                            
                            <Link to='/wishlist' onClick={toggleSidebar} className="sidebar-link sidebar-icon-link">
                                <FaHeart className="sidebar-icon" /> Wishlist 
                                <span className="sidebar-badge">{Object.keys(wishlist).length}</span>
                            </Link>
                            <Link to='/cart' onClick={toggleSidebar} className="sidebar-link sidebar-icon-link">
                                <svg className="sidebar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M22.713,4.077A2.993,2.993,0,0,0,20.41,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H1A1,1,0,0,0,1,2h.222a1,1,0,0,1,.993.883l1.376,11.7A5,5,0,0,0,8.557,19H19a1,1,0,0,0,0-2H8.557a3,3,0,0,1-2.82-2h11.92a5,5,0,0,0,4.921-4.113l.785-4.354A2.994,2.994,0,0,0,22.713,4.077ZM21.4,6.178l-.786,4.354A3,3,0,0,1,17.657,13H5.419L4.478,5H20.41A1,1,0,0,1,21.4,6.178Z" />
                                    <circle cx="7" cy="22" r="2" />
                                    <circle cx="17" cy="22" r="2" />
                                </svg> Cart
                                <span className="sidebar-badge">{cart.count}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Overlay when sidebar is open */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </div>
    );
}

export default MyNav;
