import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { WishlistContext } from '../wishlistContext';
import { Link } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";

const API_URL = process.env.REACT_APP_API_URL;

function Wishlist() {
    const { wishlist } = useContext(WishlistContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const productIds = Object.keys(wishlist);
                if (productIds.length === 0) {
                    setLoading(false);
                    setProducts([]);
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

        fetchWishlistProducts();
    }, [wishlist]);

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
        <>
            <h1 className='mt-5 h2 fw-bold text-dark mb-4'>Wishlist</h1>

            <div className="container">
                <div className='row my-4'>
                    {
                        products.length === 0 && (<h3 className='mt-4 text-muted'>Your wishlist is empty</h3>)
                    }
                    {products.map((product, index) => (
                        <div key={product._id || index} className='col-md-3 my-3'>
                            <ProductCard
                                id={product._id}
                                title={product.title}
                                price={product.price}
                                imgs={product.images}
                            />
                        </div>
                    ))}

                </div>
                <div className="mt-5">
                    <Link to='/' className='btn btn-dark btn-lg'>
                        {products.length > 0 ? 'Continue Shopping' : 'Start Adding Products'}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Wishlist;
