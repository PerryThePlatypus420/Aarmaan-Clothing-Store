import React, { useState, useEffect } from"react";
import './HomepageProducts.css';
import ProductCard from "./ProductCard";
import { ThreeDots } from "react-loader-spinner";

const API_URL = process.env.REACT_APP_API_URL;

function HomePageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/homepage-products`);
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

        fetchHomeProducts();
    }, []);

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
        <div className="summer24">
            <span>
                <h2>New Collection</h2>
            </span>

            <div className="container-fluid my-5">
                <div className="row my-4">
                    {products.length === 0 ? (
                        <h3>No products found</h3>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="col-md-3 my-3">
                                <ProductCard 
                                    id={product._id} 
                                    title={product.title} 
                                    price={product.price} 
                                    imgs={product.images} 
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePageProducts;
