import React from "react";

const ShippingPolicy = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-5 display-6 fw-bold text-dark">Shipping Policy</h1>
                    
                    <div className="mb-4">
                        <p className="lead text-center mb-5">
                            We work hard to deliver your Armaan pieces quickly and safely.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4 mb-3 text-secondary">Processing Time</h3>
                        <p className="mb-3">1–3 business days</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4 mb-3 text-secondary">Delivery Timeline</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2">• <strong>Pakistan:</strong> 5–7 working days</li>
                            <li className="mb-2">• <strong>International:</strong> 7–14 working days</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4 mb-3 text-secondary">Shipping Fee</h3>
                        <p className="mb-3">Shown at checkout based on location and order weight.</p>
                    </div>

                    <div className="mb-4">
                        <p className="mb-3">
                            Once your order is dispatched, tracking details will be sent to you via SMS or email.
                        </p>
                        <p className="mb-3">
                            Please double-check your shipping address during checkout to avoid any delays.
                        </p>
                    </div>

                    <div className="alert alert-info">
                        <p className="mb-0">
                            <strong>For support, email us at:</strong> <a href="mailto:armaaann.pk@gmail.com">armaaann.pk@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShippingPolicy;
