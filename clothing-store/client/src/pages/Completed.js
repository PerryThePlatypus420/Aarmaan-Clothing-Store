import React from "react";
import tick from "../assets/tick-animated.webm";

function Completed() {
    return (
        <div className="mx-auto mt-5" style={{ maxWidth: "900px" }}>
            <video autoPlay className="w-25 d-block mx-auto mb-4">
                <source src={tick} type="video/webm" />
            </video>
            
            <h1 className="mb-4">Order Completed</h1>
            <p>
                Your order has been successfully placed.
            </p>
        </div>
    );
}

export default Completed;