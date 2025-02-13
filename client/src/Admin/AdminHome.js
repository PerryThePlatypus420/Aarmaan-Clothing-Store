import React, { useState, useEffect } from "react";
import "./AdminHome.css";
import OrdersComp from "./OrdersComp";
import ProductsComp from "./ProductsComp";
import CategoryComp from "./CategoryComp";

const AdminHome = () => {
    const [section, setSection] = useState("Dashboard");

    const renderComponent = () => {
        switch (section) {
            case "Orders":
                return <OrdersComp onBack={() => setSection("Dashboard")} />;
            case "Products":
                return <ProductsComp onBack={() => setSection("Dashboard")} />;
            case "Categories":
                return <CategoryComp onBack={() => setSection("Dashboard")} />;
            default:
                return <AdminDashboard setSection={setSection} />;
        }
    };

    return (
        <div className="body m-0 p-0">
            <div className="container mt-4">
                {/* Dynamic Title */}
                <div className="my-5 text-center">
                    <h1>{section}</h1>
                    <hr className="mb-4" />
                </div>

                {/* Dynamic Content Based on Selection */}
                {renderComponent()}
            </div>
        </div>
    );
};

const AdminDashboard = ({ setSection }) => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [deliveredOrders, setDeliveredOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/api/orders/total-orders") // Get total orders
            .then(response => response.json())
            .then(data => {
                setTotalOrders(data.totalOrders || 0);
            })
            .catch(error => console.error("Error fetching total orders:", error));

        fetch("http://localhost:3001/api/orders/all-orders") // Fetch all orders
            .then(response => response.json())
            .then(data => {
                // Count delivered and pending orders
                const deliveredCount = data.filter(order => order.status === "Delivered").length;
                const pendingCount = data.filter(order => order.status === "Pending").length;

                setDeliveredOrders(deliveredCount);
                setPendingOrders(pendingCount);
            })
            .catch(error => console.error("Error fetching order details:", error));
    }, []);

    const stats = [
        { label: "Total Orders", value: totalOrders },
        { label: "Delivered Orders", value: deliveredOrders },
        { label: "Pending Orders", value: pendingOrders }
    ];

    const cards = [
        { title: "Orders" },
        { title: "Products" },
        { title: "Categories" }
    ];

    return (
        <>
            {/* Statistics Section */}
            <div className="row text-center mb-4">
                {stats.map((stat, index) => (
                    <div key={index} className="col-md-4">
                        <div className="p-3 ">
                            <h5 className="mb-1">{stat.label}</h5>
                            <h3 className="fw-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Centered, Larger Cards Section */}
            <div className="row justify-content-center">
                {cards.map((card, index) => (
                    <div key={index} className="col-md-4 custom-padding">
                        <div className="card-custom" onClick={() => setSection(card.title)}>
                            <div className="card-body text-center">
                                <h2 className="card-title">{card.title}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AdminHome;
