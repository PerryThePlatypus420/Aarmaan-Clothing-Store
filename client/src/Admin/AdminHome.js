import React, { useState, useEffect, useContext, useRef } from "react";
import "./AdminHome.css";
import OrdersComp from "./OrdersComp";
import ProductsComp from "./ProductsComp";
import CategoryComp from "./CategoryComp";
import SettingsComp from "./SettingsComp";
import AddAdmin from "./AddAdmin";
import ChangePassword from "./ChangePassword";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import { FaCog, FaUserShield, FaTimes, FaSignOutAlt, FaKey, FaUserPlus, FaCogs } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

const AdminHome = () => {
    const [section, setSection] = useState("Dashboard");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAdminDetails, setShowAdminDetails] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const adminBadgeRef = useRef(null);

    const renderComponent = () => {
        if (showAddAdmin) {
            return <AddAdmin onClose={() => setShowAddAdmin(false)} />;
        }
        
        if (showChangePassword) {
            return <ChangePassword onClose={() => setShowChangePassword(false)} />;
        }
        
        if (showSettings) {
            return <SettingsComp onBack={() => setShowSettings(false)} />;
        }
        
        switch (section) {
            case "Orders":
                return <OrdersComp onBack={() => setSection("Dashboard")} />;
            case "Products":
                return <ProductsComp onBack={() => setSection("Dashboard")} />;
            case "Categories":
                return <CategoryComp onBack={() => setSection("Dashboard")} />;
            default:
                return <AdminDashboard setSection={setSection} />;
        }
    };

    // Handle logout button click - show confirmation modal
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setDropdownOpen(false);
    };
    
    // Handle actual logout after confirmation
    const handleLogoutConfirm = () => {
        logout();
        navigate('/login');
        setShowLogoutModal(false);
    };

    // Handle change password click
    const handleChangePassword = () => {
        setShowChangePassword(true);
        setDropdownOpen(false);
        setSection("Change Password"); // Update section title
    };

    // Handle add admin click
    const handleAddAdmin = () => {
        setShowAddAdmin(true);
        setDropdownOpen(false);
        setSection("Add Admin"); // Update section title
    };

    // Handle settings click
    const handleSettings = () => {
        setShowSettings(true);
        setDropdownOpen(false);
        setSection("Settings"); // Update section title
    };

    // Close dropdown and admin details when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (adminBadgeRef.current && !adminBadgeRef.current.contains(event.target)) {
                setShowAdminDetails(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // Reset section when closing admin forms
    useEffect(() => {
        if (!showAddAdmin && section === "Add Admin") {
            setSection("Dashboard");
        }
        if (!showChangePassword && section === "Change Password") {
            setSection("Dashboard");
        }
        if (!showSettings && section === "Settings") {
            setSection("Dashboard");
        }
    }, [showAddAdmin, showChangePassword, showSettings, section]);
    
    // Handle modal body class and keyboard events
    useEffect(() => {
        if (showLogoutModal) {
            document.body.classList.add('modal-open');
            
            // Add escape key handler
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    setShowLogoutModal(false);
                }
            };
            
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [showLogoutModal]);

    return (
        <div className="body m-0 p-0">
            <div className="container mt-4">
                {/* Admin Header with Admin Badge and Settings */}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="position-relative" ref={adminBadgeRef}>
                        {user && (
                            <>
                                <button 
                                    type="button"
                                    className="admin-badge" 
                                    onClick={() => setShowAdminDetails(!showAdminDetails)}
                                >
                                    <div className="admin-icon-circle">
                                        <FaUserShield size={18} />
                                    </div>
                                    <span className="admin-name">{user.name || user.username}</span>
                                </button>
                                
                                {showAdminDetails && (
                                    <div className="admin-details-card">
                                        <div className="admin-details-header">
                                            <h6 className="mb-0">Admin Details</h6>
                                            <button className="close-btn" onClick={() => setShowAdminDetails(false)}>
                                                <FaTimes size={16} />
                                            </button>
                                        </div>
                                        <div className="admin-details-content">
                                            <div className="admin-detail-item">
                                                <strong>Name:</strong> {user.name}
                                            </div>
                                            <div className="admin-detail-item">
                                                <strong>Username:</strong> {user.username}
                                            </div>
                                            <div className="admin-detail-item">
                                                <strong>Email:</strong> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="position-relative" ref={dropdownRef}>
                        <button 
                            className="btn btn-outline-secondary rounded-circle"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <FaCog size={20} />
                        </button>
                        
                        {dropdownOpen && (
                            <div className="settings-dropdown">
                                <div className="settings-header">
                                    <h6 className="mb-0">Settings</h6>
                                </div>
                                <div className="settings-options">
                                    <button className="settings-option" onClick={handleChangePassword}>
                                        <FaKey className="option-icon" />
                                        <span>Change Password</span>
                                    </button>
                                    <button className="settings-option" onClick={handleAddAdmin}>
                                        <FaUserPlus className="option-icon" />
                                        <span>Add Admin</span>
                                    </button>
                                    <button className="settings-option" onClick={handleSettings}>
                                        <FaCogs className="option-icon" />
                                        <span>Delivery Settings</span>
                                    </button>
                                </div>
                                <div className="settings-footer">
                                    <button className="settings-option text-danger" onClick={handleLogoutClick}>
                                        <FaSignOutAlt className="option-icon" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Logout Confirmation Modal */}
                    {showLogoutModal && (
                        <>
                            {/* Modal Backdrop */}
                            <div 
                                className="modal-backdrop fade show" 
                                onClick={() => setShowLogoutModal(false)}
                            ></div>
                            
                            {/* Modal Dialog */}
                            <div 
                                className="modal fade show" 
                                id="logoutModal" 
                                tabIndex="-1" 
                                role="dialog" 
                                aria-labelledby="logoutModalLabel" 
                                aria-hidden="true"
                                style={{ display: 'block' }}
                            >
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                                            <button type="button" className="close" onClick={() => setShowLogoutModal(false)} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure you want to logout from the admin panel?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-danger" onClick={handleLogoutConfirm}>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Dynamic Title */}
                <div className="my-5 text-center">
                    <h1>{section}</h1>
                    <hr className="mb-4" />
                </div>

                {/* Dynamic Content Based on Selection */}
                {renderComponent()}
            </div>
        </div>
    );
};

const AdminDashboard = ({ setSection }) => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [deliveredOrders, setDeliveredOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        fetch(`${API_URL}/api/orders/total-orders`, { 
            headers 
        }) // Get total orders
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch total orders');
                }
                return response.json();
            })
            .then(data => {
                setTotalOrders(data.totalOrders || 0);
            })
            .catch(error => console.error("Error fetching total orders:", error));

        fetch(`${API_URL}/api/orders/all-orders`, { 
            headers 
        }) // Fetch all orders
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then(data => {
                // Count delivered and pending orders
                const deliveredCount = data.filter(order => order.status === "Delivered").length;
                const pendingCount = data.filter(order => order.status === "Pending").length;

                setDeliveredOrders(deliveredCount);
                setPendingOrders(pendingCount);
            })
            .catch(error => console.error("Error fetching order details:", error));
    }, []);

    const stats = [
        { label: "Total Orders", value: totalOrders },
        { label: "Delivered Orders", value: deliveredOrders },
        { label: "Pending Orders", value: pendingOrders }
    ];

    const cards = [
        { title: "Orders" },
        { title: "Products" },
        { title: "Categories" }
    ];

    return (
        <>
            {/* Statistics Section */}
            <div className="row text-center mb-4">
                {stats.map((stat, index) => (
                    <div key={index} className="col-md-4">
                        <div className="p-3 ">
                            <h5 className="mb-1">{stat.label}</h5>
                            <h3 className="fw-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Centered, Larger Cards Section */}
            <div className="row justify-content-center">
                {cards.map((card, index) => (
                    <div key={index} className="col-md-4 custom-padding">
                        <div className="card-custom" onClick={() => setSection(card.title)}>
                            <div className="card-body text-center">
                                <h2 className="card-title">{card.title}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AdminHome;
