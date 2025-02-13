import React from "react";

const ProductsComp = ({ onBack }) => {
    return (
        <div className="text-center mt-5">
            <button className="btn btn-secondary mb-3" onClick={onBack}>Back to Dashboard</button>
            <h2>Orders Management</h2>
            <p>Manage all customer orders here.</p>
        </div>
    );
};

export default ProductsComp;
