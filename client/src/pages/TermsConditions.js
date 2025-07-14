import React from "react";

const TermsConditions = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-5 display-6 fw-bold text-dark">Terms & Conditions</h1>
                    
                    <div className="mb-4">
                        <p className="lead text-center mb-5">
                            By placing an order at Armaan, you agree to the following terms:
                        </p>
                    </div>

                    <div className="mb-4">
                        <ul className="list-unstyled">
                            <li className="mb-3">• Prices are in PKR and may change without notice.</li>
                            <li className="mb-3">• Slight variations in color or fabric may occur due to screen resolution or lighting.</li>
                            <li className="mb-3">• Orders can be modified or canceled within 12 hours.</li>
                            <li className="mb-3">• Armaan reserves the right to refuse service for any misuse of the website.</li>
                            <li className="mb-3">• All disputes are subject to the laws of Pakistan.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsConditions;
