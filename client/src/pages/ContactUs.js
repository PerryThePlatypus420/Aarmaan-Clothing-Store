import React from "react";

const ContactUs = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-5 display-6 fw-bold text-dark">Contact Us</h1>
                    
                    <div className="mb-4">
                        <p className="lead text-center mb-5">
                            We'd love to hear from you!
                        </p>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                                    <h5 className="card-title">Email</h5>
                                    <p className="card-text">
                                        <a href="mailto:armaaann.pk@gmail.com" className="text-decoration-none">
                                            armaaann.pk@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fab fa-whatsapp fa-2x text-success mb-3"></i>
                                    <h5 className="card-title">WhatsApp/Phone</h5>
                                    <p className="card-text">
                                        <a href="tel:+923224158641" className="text-decoration-none">
                                            +92322 4158641
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fab fa-instagram fa-2x text-danger mb-3"></i>
                                    <h5 className="card-title">Instagram</h5>
                                    <p className="card-text">
                                        <a href="https://instagram.com/armaan.official" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            @armaan.official
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
