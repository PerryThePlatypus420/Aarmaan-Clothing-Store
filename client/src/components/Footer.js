import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h3 className="footer-logo">آرمان</h3>
            <p className="footer-description">
              Armaan blends tradition with modern elegance — creating soulful,
              expressive clothing for the Pakistani woman. Each piece reflects
              identity, culture, and grace.
            </p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Information</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/exchange-returns">Exchange & Returns</Link>
              </li>
              <li>
                <Link to="/terms-conditions">Terms & Conditions</Link>
              </li>
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
