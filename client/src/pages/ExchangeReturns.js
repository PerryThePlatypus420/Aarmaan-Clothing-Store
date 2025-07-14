import React from "react";

const ExchangeReturns = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-5 display-6 fw-bold text-dark">Exchange & Returns</h1>
                    
                    <div className="mb-4">
                        <p className="lead text-center mb-5">
                            If you're not fully satisfied with your order, we're here to help.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4 mb-3 text-secondary">Policy Highlights</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2">• Items can be exchanged or returned within <strong>7 days</strong></li>
                            <li className="mb-2">• Products must be unworn, unwashed, and in original condition</li>
                            <li className="mb-2">• Sale and discounted items are not eligible for return</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4 mb-3 text-secondary">How to Request a Return or Exchange</h3>
                        <p className="mb-3">
                            To request a return or exchange, email <a href="mailto:armaaann.pk@gmail.com">armaaann.pk@gmail.com</a> with your order number and details.
                        </p>
                    </div>

                    <div className="mb-4">
                        <p className="mb-3">
                            Refunds, if approved, are issued as store credit or product exchange. Customers are responsible for return shipping unless the item is faulty.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExchangeReturns;
