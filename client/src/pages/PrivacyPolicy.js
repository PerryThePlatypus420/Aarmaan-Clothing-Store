import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-5 display-6 fw-bold text-dark">Privacy Policy</h1>
                    
                    <div className="mb-4">
                        <p className="lead text-center mb-5">
                            At Armaan, we value your privacy.
                        </p>
                    </div>

                    <div className="mb-4">
                        <p className="mb-3">
                            We only collect personal information necessary to process your orders and enhance your shopping experience—such as your name, address, and contact details.
                        </p>
                        <p className="mb-3">
                            Your data is safe and never sold or shared with anyone except our delivery and payment service providers.
                        </p>
                        <p className="mb-3">
                            By using our website, you agree to our privacy terms.
                        </p>
                    </div>

                    <div className="alert alert-info">
                        <p className="mb-0">
                            <strong>For any privacy-related questions, contact us at:</strong> <a href="mailto:armaaann.pk@gmail.com">armaaann.pk@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
