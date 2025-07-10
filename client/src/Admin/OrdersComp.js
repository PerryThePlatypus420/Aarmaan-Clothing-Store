import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const OrdersComp = ({ onBack }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("All");
    const [orderProducts, setOrderProducts] = useState({});
    const [searchOrderId, setSearchOrderId] = useState("");

    useEffect(() => {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch(`${API_URL}/api/orders/all-orders`, {
            headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setFilteredOrders(data); // Initially, show all orders
            })
            .catch(error => console.error("Error fetching orders:", error));
    }, []);

    // Fetch product details for a specific order
    const fetchOrderProducts = async (order) => {
        try {
            const productIds = order.products.map(product => product.productId);
            // Get the authentication token
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/products/ids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ids: productIds })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const productDetails = await response.json();

            // Combine order products with fetched product details
            const enrichedProducts = order.products.map(orderProduct => {
                const productDetail = productDetails.find(p => (p._id || p.id) === orderProduct.productId);
                return {
                    ...orderProduct,
                    productName: productDetail?.title || "Unknown Product",
                    imageURL: productDetail?.images?.[0] || productDetail?.images || "https://via.placeholder.com/80",
                    price: productDetail?.price || 0
                };
            });

            setOrderProducts(prev => ({
                ...prev,
                [order._id]: enrichedProducts
            }));
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch(`${API_URL}/api/orders/all-orders`, {
            headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data);
                setFilteredOrders(data); // Initially, show all orders
            })
            .catch(error => console.error("Error fetching orders:", error));
    }, []);

    // Filter Orders Based on Status and Order ID
    useEffect(() => {
        let filtered = orders;

        // Filter by status
        if (filter !== "All") {
            filtered = filtered.filter(order => order.status === filter);
        }

        // Filter by order ID
        if (searchOrderId.trim() !== "") {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchOrderId.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    }, [filter, orders, searchOrderId]);

    const clearSearch = () => {
        setSearchOrderId("");
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
        // Fetch product details when opening modal
        fetchOrderProducts(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    const toggleOrderStatus = () => {
        if (!selectedOrder) return;

        const newStatus = selectedOrder.status === "Pending" ? "Delivered" : "Pending";

        // Get the authentication token
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/orders/update-status/${selectedOrder._id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
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

            {/* Search by Order ID */}
            <div className="row mb-4">
                <div className="col-md-6 mx-auto">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <label className="form-label fw-bold mb-1">
                                <i className="fas fa-search me-2"></i>Search by Order ID
                            </label>
                            <div className="d-flex align-items-center gap-3">
                                <div className="flex-grow-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter full or partial order ID (e.g., 676e1d52460700c1b4781d8b or 676e1d)..."
                                        value={searchOrderId}
                                        onChange={(e) => setSearchOrderId(e.target.value)}
                                    />
                                </div>
                                {searchOrderId && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={clearSearch}
                                        title="Clear search"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                            {searchOrderId && (
                                <small className="text-muted">
                                    Searching for order ID: <span className="fw-bold">{searchOrderId}</span>
                                    <br />
                                    <span className="text-info">💡 Tip: You can search with full ID or just the first/last few characters</span>
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* Responsive Table Wrapper */}
            <div className="table-responsive">
                <table className="table table-hover table-bordered border-dark">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Date</th>
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
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className="badge bg-secondary">{order._id.slice(-6)}</span>
                                    </td>
                                    <td className="fw-semibold">{order.firstName} {order.lastName}</td>
                                    <td>{order.email}</td>
                                    <td>{order.phone}</td>
                                    <td>
                                        <span className="badge bg-info">{order.products.length} items</span>
                                    </td>
                                    <td className="fw-bold text-success">Rs. {order.totalAmount.toLocaleString()}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning"}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                                    <div className="text-muted">
                                        {searchOrderId ? (
                                            <div>
                                                <p>No orders found with ID: <span className="fw-bold">{searchOrderId}</span></p>
                                                <button className="btn btn-sm btn-outline-primary" onClick={clearSearch}>
                                                    Clear search
                                                </button>
                                            </div>
                                        ) : (
                                            <p>No orders found</p>
                                        )}
                                    </div>
                                </td>
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
                                {/* Customer Information */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body">
                                                <h6 className="card-title fw-bold text-primary mb-3">
                                                    <i className="fas fa-user me-2"></i>Customer Information
                                                </h6>
                                                <div className="mb-2">
                                                    <strong>Name:</strong> {selectedOrder.firstName} {selectedOrder.lastName}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Email:</strong> {selectedOrder.email}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Phone:</strong> {selectedOrder.phone}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Address:</strong> {selectedOrder.address}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>City:</strong> {selectedOrder.city}
                                                </div>
                                                {selectedOrder.additionalInfo && (
                                                    <div className="mb-2">
                                                        <strong>Additional Info:</strong> {selectedOrder.additionalInfo}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body">
                                                <h6 className="card-title fw-bold text-primary mb-3">
                                                    <i className="fas fa-receipt me-2"></i>Order Summary
                                                </h6>
                                                <div className="mb-2">
                                                    <strong>Order ID:</strong> {selectedOrder._id}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Status:</strong>
                                                    <span className={`badge ms-2 ${selectedOrder.status === "Delivered" ? "bg-success" : "bg-warning"}`}>
                                                        {selectedOrder.status}
                                                    </span>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Total Amount:</strong>
                                                    <span className="text-success fw-bold ms-2">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Information */}
                                <div className="mb-3">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <i className="fas fa-box me-2"></i>Ordered Products ({selectedOrder.products.length} items)
                                    </h6>
                                    <div className="row">
                                        {(orderProducts[selectedOrder._id] || selectedOrder.products).map((product, index) => (
                                            <div key={index} className="col-12 mb-3">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-2">
                                                                <img
                                                                    src={product.imageURL || "https://via.placeholder.com/80"}
                                                                    alt={product.productName || "Product"}
                                                                    className="img-fluid rounded border"
                                                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <h6 className="fw-bold mb-1">{product.productName || "Loading..."}</h6>
                                                                <div className="text-muted small">
                                                                    <div className="mb-1">
                                                                        <i className="fas fa-tag me-1"></i>
                                                                        Product ID:
                                                                        <span
                                                                            className="badge bg-light text-dark ms-1 user-select-all"
                                                                            style={{ cursor: "text", fontSize: "0.7rem" }}
                                                                            title="Click to select full ID"
                                                                        >
                                                                            {product.productId}
                                                                        </span>
                                                                    </div>
                                                                    {product.size && product.size !== '' && (
                                                                        <div className="mb-1">
                                                                            <i className="fas fa-ruler me-1"></i>
                                                                            Size: <span className="badge bg-secondary">{product.size}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2 text-center">
                                                                <div className="fw-bold">Quantity</div>
                                                                <span className="badge bg-primary fs-6">{product.quantity}</span>
                                                            </div>
                                                            <div className="col-md-2 text-end">
                                                                <div className="text-muted small">Unit Price</div>
                                                                <div className="fw-bold">
                                                                    Rs. {product.price ? product.price.toLocaleString() : "Loading..."}
                                                                </div>
                                                                <div className="text-muted small">
                                                                    Total: Rs. {product.price ? (product.price * product.quantity).toLocaleString() : "Loading..."}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
