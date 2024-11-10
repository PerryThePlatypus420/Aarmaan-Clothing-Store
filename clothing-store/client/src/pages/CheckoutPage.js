import React, { useState, useContext, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBInput, MDBListGroup, MDBListGroupItem, MDBRow, MDBTextArea, MDBTypography } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../cartContext';
import { ThreeDots } from "react-loader-spinner";


export default function Checkout() {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                const productIds = Object.keys(cart).filter(id => id !== 'count');
                if (productIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:3001/api/products/ids', {
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
            try {
                const orderData = {
                    ...formData,
                    products: Object.keys(cart).filter(id => id !== 'count').map(id => ({
                        productId: id,
                        quantity: cart[id]
                    })),
                    totalAmount: total < 2500 ? total + 250 : total
                };

                const response = await fetch('http://localhost:3001/api/orders/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result.message);
                navigate('/completed');
            } catch (error) {
                alert('Failed to submit order: ' + error.message);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };


    const total = products.reduce((acc, product) => {
        const quantity = cart[product.id] || 0;
        return acc + product.price * quantity;
    }, 0);

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">
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
        <div className="mx-auto mt-5" style={{ maxWidth: '900px' }}>
            <MDBRow>
                <MDBCol md="8" className="mb-4">
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

                                <MDBBtn type='submit' className='bg-dark' size="lg" block>
                                    Make purchase
                                </MDBBtn>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="4" className="mb-4">
                    <MDBCard className="mb-4">
                        <MDBCardHeader className="py-3">
                            <MDBTypography tag="h5" className="mb-0">Summary</MDBTypography>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBListGroup flush>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                    Products
                                    <span>Rs. {total}</span>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0">
                                    Shipping
                                    <span>{total < 2500 ? "Rs. 250" : "FREE"}</span>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                    <div>
                                        <strong>Total amount</strong>
                                    </div>
                                    <span><strong>{total < 2500 ? total + 250 : total}</strong></span>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </div>
    );
}
