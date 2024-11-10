import React from "react";
import './Footer.css';
import swooshLogoWhite from '../assets/swoosh-logo-white.png';


function Footer() {
    return (
        
        <div className="footer">

            <div className="footer-content">

                <div className="footer-description">

                <div className="swoosh-brand-footer mb-3 ">
                    <div to='/' className="swoosh-link-footer">
                        <img src={swooshLogoWhite} alt="swoosh logo" className="swoosh-logo-footer" />
                        <span className="swoosh-text-footer titan-one-regular text-white">SWOOSH</span>
                    </div>
                </div>

                    <span><b>SWOOSH</b> is a diverse unisex clothing brand with a goal to combine art, culture, style
                        and comfort.</span>
                </div>


                <div>
                    <h3>Information</h3>
                    <div className="quick-links">
                        <p>Shipping Policy</p>
                        <p>Privacy Policy</p>
                        <p>Exchange and Return Policy</p>
                        <p>Terms and Conditions</p>
                        <p>Contact Us</p>
                    </div>
                </div>

            </div>

            <br />
            <hr className="hori mb-3" />
            <p>© 2024 All Rights Reserved</p>
        </div>
    );
}

export default Footer;