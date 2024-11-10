import React, { useState, useEffect } from "react";
import './SummerCollection.css';
import ProductCard from "../components/ProductCard";

function SummerCollection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummerCollection = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/summerCollection');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data.map(item => item.productID));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummerCollection();
    }, []);

    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>Error: {error}</h3>;

    return (
        <div className="summer24">
            <span>
                <h1>Drop '24</h1>
                <h3>Summer Collection</h3>
            </span>

            <div className="container my-5">
                <div className="row my-4">
                    {products.length === 0 ? (
                        <h3>No products found</h3>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="col-md-4 my-3">
                                <ProductCard 
                                    id={product.id} 
                                    title={product.title} 
                                    price={product.price} 
                                    img={product.img} 
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SummerCollection;
