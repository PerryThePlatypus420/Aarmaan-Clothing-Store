import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { CartContext } from '../cartContext';

function Completed() {
    const { cart, setCart } = useContext(CartContext);
    const hasCleared = useRef(false);

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

    return (
        <MDBContainer className="py-5">
            <MDBRow className="justify-content-center">
                <MDBCol md="8" lg="6">
                    <MDBCard className="shadow-sm border-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.47)" }}>
                        <MDBCardBody className="text-center p-5">

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

                            {/* Order Details */}
                            <div className="bg-light rounded p-4 mb-4">
                                <div className="row text-start">
                                    <div className="col-12 mb-3">
                                        <MDBIcon fas icon="shipping-fast" className="text-primary me-2" />
                                        <span className="fw-semibold">Order Status:</span>
                                        <span className="ms-2 badge bg-success">Confirmed</span>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <MDBIcon fas icon="envelope" className="text-primary me-2" />
                                        <span className="fw-semibold">Confirmation Email:</span>
                                        <span className="ms-2 text-muted">Will be sent shortly</span>
                                    </div>
                                    <div className="col-12">
                                        <MDBIcon fas icon="clock" className="text-primary me-2" />
                                        <span className="fw-semibold">Processing Time:</span>
                                        <span className="ms-2 text-muted">5-7 business days</span>
                                    </div>
                                </div>
                            </div>

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