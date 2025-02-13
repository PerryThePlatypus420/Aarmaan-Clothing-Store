import React, { useState, useEffect } from 'react';
import './MyNav.css';
import swooshLogo from '../assets/swoosh-logo.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../cartContext';
import { WishlistContext } from '../wishlistContext';
import { FiMenu } from "react-icons/fi";
import { FaHeart, FaRegUser } from "react-icons/fa";
import { UserContext } from '../userContext';
import { VscDebugBreakpointData } from "react-icons/vsc";



function MyNav() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categories = ["Tees", "Button-Shirts", "Pants", "Shoes", "Accessories"];
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { user: contextUser, logout } = useContext(UserContext);

    useEffect(() => {
        if (contextUser) {
            setUser(contextUser);
        }
    }, [contextUser]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <div className="nav-main">
            <div className="nav-top">
                آرمان is live now !
                <Link to='/login'>
                    <div className="circle-icon">
                        <VscDebugBreakpointData />
                    </div>
                </Link>
            </div>



            <nav className="navbar navbar-expand-lg navbar-light bg-light nav-bottom">
                <div className="container">
                    <Link to='/' className="navbar-brand swoosh-brand">
                        <span className="swoosh-text titan-one-regular">آرمان</span>
                    </Link>

                    <div className="navbar-nav d-none d-lg-flex">
                        <Link to="/" className="nav-link">Home</Link>
                        <div className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Categories
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <Link className="dropdown-item" to={`/category/${category}`}>{category}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to='/about-us' className="nav-link">About Us</Link>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="sidebar-toggle mx-2" onClick={toggleSidebar}>
                            <h4><FiMenu /></h4>
                        </div>

                        <Link to='/wishlist' className="position-relative text-black me-3">
                            <FaHeart style={{ fontSize: "25px" }} />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {Object.keys(wishlist).length}
                            </span>
                        </Link>
                        <Link to='/cart' className="position-relative mx-2 me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" id="cart-svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M22.713,4.077A2.993,2.993,0,0,0,20.41,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H1A1,1,0,0,0,1,2h.222a1,1,0,0,1,.993.883l1.376,11.7A5,5,0,0,0,8.557,19H19a1,1,0,0,0,0-2H8.557a3,3,0,0,1-2.82-2h11.92a5,5,0,0,0,4.921-4.113l.785-4.354A2.994,2.994,0,0,0,22.713,4.077ZM21.4,6.178l-.786,4.354A3,3,0,0,1,17.657,13H5.419L4.478,5H20.41A1,1,0,0,1,21.4,6.178Z" />
                                <circle cx="7" cy="22" r="2" />
                                <circle cx="17" cy="22" r="2" />
                            </svg>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cart.count}
                            </span>
                        </Link>
                    </div>

                    <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                        <span className="close-btn" onClick={toggleSidebar}>&times;</span>
                        <div className="sidebar-links">
                            <Link to="/" onClick={toggleSidebar}>Home</Link>
                            <div className="dropdown">
                                <span className="dropdown-toggle" onClick={toggleCategory}>Categories</span>
                                <div className={`dropdown-content ${isCategoryOpen ? 'show' : ''}`}>
                                    {categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            to={`/category/${category}`}
                                            onClick={() => {
                                                toggleSidebar();
                                                setIsCategoryOpen(false);
                                            }}
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <Link to='/about-us' onClick={toggleSidebar}>About Us</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default MyNav;