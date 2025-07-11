import React from "react";
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-row">
                    <div className="footer-column">
                        <h3 className="footer-logo">آرمان</h3>
                        <p className="footer-description">
                            آرمان is a diverse unisex clothing brand with a goal to combine art, culture, style
                            and comfort.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
                        </div>
                    </div>
                    
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Shop</a></li>
                            <li><a href="#">Collections</a></li>
                            <li><a href="#">About Us</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h3>Information</h3>
                        <ul className="footer-links">
                            <li><a href="#">Shipping Policy</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Exchange & Returns</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>©{new Date().getFullYear()} آرمان All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;