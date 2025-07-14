import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { CartContext } from '../cartContext';
import { ThreeDots } from "react-loader-spinner";

const API_URL = process.env.REACT_APP_API_URL;

function Completed() {
    const { cart, setCart } = useContext(CartContext);
    const hasCleared = useRef(false);
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const orderId = location.state?.orderId;

    // Clear cart silently when component mounts (only once)
    useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
        if (!hasCleared.current && cart.items && Object.keys(cart.items).length > 0) {
            const freshCart = { items: {}, count: 0 };
            setCart(freshCart);
            try {
                localStorage.removeItem('cart');
                localStorage.setItem('cart', JSON.stringify(freshCart));
            } catch (error) {
                console.error('Error clearing cart from localStorage:', error);
            }
            hasCleared.current = true;
        }
    }, []); // Empty dependency array to run only once

    // Fetch order details if orderId is available
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch order details
                const orderResponse = await fetch(`${API_URL}/api/orders/order/${orderId}`);
                if (!orderResponse.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const order = await orderResponse.json();
                setOrderDetails(order);

                // Fetch product details for the order
                if (order.products && order.products.length > 0) {
                    const productIds = order.products.map(product => product.productId);
                    const productsResponse = await fetch(`${API_URL}/api/products/ids`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids: productIds })
                    });

                    if (!productsResponse.ok) {
                        throw new Error('Failed to fetch product details');
                    }

                    const productDetails = await productsResponse.json();

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

                    setOrderProducts(enrichedProducts);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="black"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        );
    }

    if (error) {
        return (
            <MDBContainer className="py-5">
                <MDBRow className="justify-content-center">
                    <MDBCol md="8" lg="6">
                        <MDBCard className="shadow-sm border-0">
                            <MDBCardBody className="text-center p-5">
                                <MDBIcon fas icon="exclamation-triangle" size="4x" className="text-warning mb-4" />
                                <h2 className="text-dark mb-3">Error Loading Order</h2>
                                <p className="text-muted mb-4">{error}</p>
                                <Link to="/">
                                    <MDBBtn color="primary">Go to Home</MDBBtn>
                                </Link>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

    return (
        <MDBContainer className="py-5 px-3 px-md-0">
            <MDBRow className="justify-content-center mx-0">
                <MDBCol md="10" lg="8" className="px-2 px-md-3">
                    <MDBCard className="shadow-sm border-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.47)" }}>
                        <MDBCardBody className="text-center p-4 p-md-5">

                            {/* Success Icon Fallback */}
                            <div className="mb-4">
                                <MDBIcon 
                                    fas 
                                    icon="check-circle" 
                                    size="4x" 
                                    className="text-success"
                                />
                            </div>

                            {/* Main Message */}
                            <h1 className="h2 text-dark fw-bold mb-3">
                                Order Completed Successfully!
                            </h1>
                            
                            <p className="lead text-muted mb-4">
                                Thank you for your purchase. Your order has been received and is being processed.
                            </p>

                            {/* Order Summary */}
                            {orderDetails && (
                                <div className="bg-light rounded p-4 mb-4">
                                    <div className="row text-start">
                                        <div className="col-12 mb-3">
                                            <MDBIcon fas icon="receipt" className="text-primary me-2" />
                                            <span className="fw-semibold">Order Number:</span>
                                            <span className="ms-2 badge bg-secondary">{orderDetails._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <MDBIcon fas icon="shipping-fast" className="text-primary me-2" />
                                            <span className="fw-semibold">Order Status:</span>
                                            <span className="ms-2 badge bg-success">Confirmed</span>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <MDBIcon fas icon="calendar" className="text-primary me-2" />
                                            <span className="fw-semibold">Order Date:</span>
                                            <span className="ms-2 text-muted">{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <MDBIcon fas icon="dollar-sign" className="text-primary me-2" />
                                            <span className="fw-semibold">Total Amount:</span>
                                            <span className="ms-2 text-success fw-bold">Rs. {orderDetails.totalAmount.toLocaleString()}</span>
                                        </div>
                                        {/* <div className="col-12 mb-3">
                                            <MDBIcon fas icon="envelope" className="text-primary me-2" />
                                            <span className="fw-semibold">Confirmation Email:</span>
                                            <span className="ms-2 text-muted">Will be sent to {orderDetails.email}</span>
                                        </div> */}
                                        <div className="col-12">
                                            <MDBIcon fas icon="clock" className="text-primary me-2" />
                                            <span className="fw-semibold">Processing Time:</span>
                                            <span className="ms-2 text-muted">5-7 business days</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Details */}
                            {orderDetails && orderProducts.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="fw-bold text-dark mb-3 text-start">
                                        <MDBIcon fas icon="box me-2" />
                                        Your Order ({orderProducts.length} items)
                                    </h5>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-0">
                                            {orderProducts.map((product, index) => (
                                                <div key={index} className={`p-3 ${index !== orderProducts.length - 1 ? 'border-bottom' : ''}`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-3 col-md-2">
                                                            <img
                                                                src={product.imageURL}
                                                                alt={product.productName}
                                                                className="img-fluid rounded border"
                                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                            />
                                                        </div>
                                                        <div className="col-9 col-md-6">
                                                            <h6 className="fw-bold mb-1 text-start">{product.productName}</h6>
                                                            <div className="text-muted small text-start">
                                                                {product.size && product.size !== '' && (
                                                                    <div className="mb-1">
                                                                        <i className="fas fa-tag me-1"></i>
                                                                        Size: <span className="badge bg-secondary">{product.size}</span>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <i className="fas fa-box me-1"></i>
                                                                    Qty: {product.quantity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-4 text-end mt-2 mt-md-0">
                                                            <div className="text-muted small">Unit Price: Rs. {product.price.toLocaleString()}</div>
                                                            <div className="fw-bold text-dark">Rs. {(product.price * product.quantity).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                <Link to="/">
                                    <MDBBtn 
                                        color="primary" 
                                        size="lg"
                                        className="px-4"
                                    >
                                        <MDBIcon fas icon="home" className="me-2" />
                                        Continue Shopping
                                    </MDBBtn>
                                </Link>
                                
                                <Link to="/about-us" className="text-decoration-none">
                                    <MDBBtn 
                                        outline 
                                        color="secondary" 
                                        size="lg"
                                        className="px-4"
                                    >
                                        <MDBIcon fas icon="info-circle" className="me-2" />
                                        About Us
                                    </MDBBtn>
                                </Link>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-4 pt-3 border-top">
                                <p className="small text-muted mb-0">
                                    If you have any questions, feel free to contact us.
                                </p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Completed;