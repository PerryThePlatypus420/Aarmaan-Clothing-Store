import React, { useState, useEffect } from "react";

const OrdersComp = ({ onBack }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetch("http://localhost:3001/api/orders/all-orders")
            .then(response => response.json())
            .then(data => {
                setOrders(data);
                setFilteredOrders(data); // Initially, show all orders
            })
            .catch(error => console.error("Error fetching orders:", error));
    }, []);

    // Filter Orders Based on Status
    useEffect(() => {
        if (filter === "All") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === filter));
        }
    }, [filter, orders]);

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    const toggleOrderStatus = () => {
        if (!selectedOrder) return;

        const newStatus = selectedOrder.status === "Pending" ? "Delivered" : "Pending";

        fetch(`http://localhost:3001/api/orders/update-status/${selectedOrder._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        })
            .then(response => response.json())
            .then(updatedOrder => {
                // Ensure products remain intact
                const updatedOrders = orders.map(order =>
                    order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
                );

                setOrders(updatedOrders);

                // Preserve existing products while updating status
                setSelectedOrder(prevOrder => ({
                    ...prevOrder,
                    status: updatedOrder.status,
                }));
            })
            .catch(error => console.error("Error updating order status:", error));
    };


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3 top-bar">
                <button className="btn btn-secondary" onClick={onBack}>Back to Dashboard</button>

                <h2 className="text-center order-h1"> {filter} Orders</h2>

                {/* Filter Dropdown */}
                <div className="order-filter">
                    <label className="me-2 fw-bold">Filter:</label>
                    <select className="form-select d-inline-block w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>


            {/* Responsive Table Wrapper */}
            <div className="table-responsive">
                <table className="table table-bordered border-dark">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr
                                    key={order._id}
                                    onClick={() => openModal(order)}
                                    className="order-row"
                                    style={{ cursor: "pointer", backgroundColor: "rgba(112, 112, 112, 0.2)" }} // Ensure pointer works
                                >
                                    <td>{index + 1}</td>
                                    <td>{order.firstName} {order.lastName}</td>
                                    <td>{order.email}</td>
                                    <td>{order.phone}</td>
                                    <td>Rs. {order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning"}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* Modal for Order Details */}
            {showModal && selectedOrder && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Order Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                <div className="mb-3 text-start">
                                    <p><strong>Customer:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                                    <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
                                    <p><strong>Total Amount:</strong> <span className="text-success">${selectedOrder.totalAmount.toFixed(2)}</span></p>
                                </div>

                                <h6 className="fw-bold">Ordered Products:</h6>
                                <div className="list-group">
                                    {selectedOrder.products.map((product, index) => (
                                        <div key={index} className="list-group-item d-flex align-items-center border-0 mb-2 shadow-sm rounded"
                                            style={{ padding: "15px", backgroundColor: "#f8f9fa" }}>
                                            <img
                                                src={product.imageURL || "https://via.placeholder.com/80"}
                                                alt={product.productName}
                                                className="me-3 border rounded"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <div>
                                                <strong className="text-dark">{product.productName}</strong>
                                                <p className="text-muted mb-0">Quantity: {product.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className={`btn ${selectedOrder.status === "Pending" ? "btn-success" : "btn-warning"}`} onClick={toggleOrderStatus}>
                                    Mark as {selectedOrder.status === "Pending" ? "Delivered" : "Pending"}
                                </button>
                                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersComp;
