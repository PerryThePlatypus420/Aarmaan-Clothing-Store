import React, { useState, useContext, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBInput, MDBRow, MDBTextArea, MDBTypography } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../cartContext';
import { useSettings } from '../settingsContext';
import { ThreeDots } from "react-loader-spinner";

const API_URL = process.env.REACT_APP_API_URL;

export default function Checkout() {
    const { cart, resetCart } = useContext(CartContext);
    const { settings, loading: settingsLoading } = useSettings();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        additionalInfo: ''
    });

    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                // Extract product IDs from the new cart structure
                const productIds = cart.items ? Object.values(cart.items).map(item => item.productId) : [];
                if (productIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/api/products/ids`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ids: productIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartProducts();
    }, [cart]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ['firstName', 'lastName', 'city', 'address', 'phone', 'email'];
        const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

        if (isFormValid) {
            setSubmitting(true);
            try {
                // Calculate shipping cost based on settings
                const shippingCost = (settings.freeDeliveryThreshold !== null && total >= settings.freeDeliveryThreshold) ? 0 : (settings.deliveryFee || 250);
                
                const orderData = {
                    ...formData,
                    products: cart.items ? Object.values(cart.items).map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        size: item.size || ''
                    })) : [],
                    totalAmount: total + shippingCost
                };

                const response = await fetch(`${API_URL}/api/orders/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (!response.ok) {
                    // Handle stock validation errors and other server errors
                    throw new Error(result.error || 'Network response was not ok');
                }

                console.log(result.message);
                // Clear the cart after successful order
                resetCart();
                // Navigate to completed page with order ID
                navigate('/completed', { state: { orderId: result.order._id } });
            } catch (error) {
                // Display specific error message from server (e.g., stock validation errors)
                alert('Failed to submit order: ' + error.message);
            } finally {
                setSubmitting(false);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };


    const total = products.reduce((acc, product) => {
        // Calculate total from the new cart structure
        const cartItems = cart.items ? Object.values(cart.items).filter(item => item.productId === (product._id || product.id)) : [];
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        return acc + product.price * totalQuantity;
    }, 0);

    // Debug logging
    console.log('Cart structure:', cart);
    console.log('Products loaded:', products);
    console.log('Calculated total:', total);

    if (loading || settingsLoading) return <div className="d-flex justify-content-center align-items-center vh-100">
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
    </div>;
    if (error) return <h3>Error: {error}</h3>;

    return (
        <div className="mx-auto mt-5 px-3 px-md-0" style={{ maxWidth: '900px' }}>
            <MDBRow className="mx-0">
                <MDBCol md="8" className="mb-4 px-2 px-md-3">
                    <MDBCard className="mb-4">
                        <MDBCardHeader className="py-3">
                            <MDBTypography tag="h5" className="mb-0">Billing details</MDBTypography>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <form onSubmit={handleSubmit}>
                                <MDBRow className="mb-4">
                                    <MDBCol>
                                        <MDBInput
                                            label='First name'
                                            type='text'
                                            name='firstName'
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </MDBCol>
                                    <MDBCol>
                                        <MDBInput
                                            label='Last name'
                                            type='text'
                                            name='lastName'
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </MDBCol>
                                </MDBRow>

                                <MDBInput
                                    label='City'
                                    type='text'
                                    className="mb-4"
                                    name='city'
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <MDBInput
                                    label='Complete Address'
                                    type='text'
                                    className="mb-4"
                                    name='address'
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <MDBInput
                                    label='Phone'
                                    type='tel'
                                    className="mb-4"
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <MDBInput
                                    label='Email'
                                    type='email'
                                    className="mb-4"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <MDBTextArea
                                    label='Additional information'
                                    rows={4}
                                    className="mb-4"
                                    name='additionalInfo'
                                    value={formData.additionalInfo}
                                    onChange={handleInputChange}
                                />

                                <MDBBtn type='submit' className='bg-dark' size="lg" block disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <ThreeDots
                                                height="20"
                                                width="20"
                                                color="white"
                                                ariaLabel="loading"
                                                wrapperStyle={{ display: 'inline-block', marginRight: '8px' }}
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        'Make purchase'
                                    )}
                                </MDBBtn>
                            </form>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Cash on Delivery Section */}
                    <MDBCard className="mb-4">
                        <MDBCardHeader className="py-3">
                            <MDBTypography tag="h5" className="mb-0">Payment Method</MDBTypography>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex align-items-center p-3 bg-light rounded">
                                <div className="me-3">
                                    <i className="fas fa-money-bill-wave fa-2x text-success"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1 fw-bold">Cash on Delivery (COD)</h6>
                                    <p className="mb-0 text-muted small">
                                        Pay with cash when your order is delivered to your doorstep. 
                                        This is the only payment method currently available.
                                    </p>
                                </div>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="4" className="mb-4 px-2 px-md-3">
                    <MDBCard className="mb-4 shadow-sm">
                        <MDBCardHeader className="py-3 bg-light">
                            <MDBTypography tag="h5" className="mb-0 fw-bold text-dark">Order Summary</MDBTypography>
                        </MDBCardHeader>
                        <MDBCardBody className="p-4">
                            {/* Cart Items */}
                            {cart.items && Object.values(cart.items).length > 0 ? (
                                <div className="mb-4">
                                    {Object.values(cart.items).map((item, index) => {
                                        const product = products.find(p => (p._id || p.id) === item.productId);
                                        if (!product) return null;
                                        return (
                                            <div key={index} className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold text-dark mb-1">{product.title}</div>
                                                    <div className="small text-muted">
                                                        {item.size && (
                                                            <span className="me-3">
                                                                <i className="fas fa-tag me-1"></i>
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        <span>
                                                            <i className="fas fa-box me-1"></i>
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold text-dark">Rs. {(product.price * item.quantity).toLocaleString()}</div>
                                                    <div className="small text-muted">Rs. {product.price.toLocaleString()} each</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                                    <p>Your cart is empty</p>
                                </div>
                            )}

                            {/* Summary Totals */}
                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="fw-semibold">Rs. {total.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Shipping</span>
                                    <span className="fw-semibold">
                                        {settings.freeDeliveryThreshold !== null && total >= settings.freeDeliveryThreshold ? (
                                            <span className="text-success">FREE</span>
                                        ) : (
                                            `Rs. ${settings.deliveryFee?.toLocaleString() || '250'}`
                                        )}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center py-2 border-top">
                                    <span className="h6 fw-bold mb-0">Total Amount</span>
                                    <span className="h5 fw-bold mb-0 text-primary">
                                        Rs. {(() => {
                                            const shippingCost = (settings.freeDeliveryThreshold !== null && total >= settings.freeDeliveryThreshold) ? 0 : (settings.deliveryFee || 250);
                                            return (total + shippingCost).toLocaleString();
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </div>
    );
}
