import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";

const API_URL = process.env.REACT_APP_API_URL;

function Category() {

    const { cat } = useParams();

    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`${API_URL}/api/products/category/${cat}`);
            const data = await response.json();
            setProducts(data);
        };
        fetchProducts();
    }, [cat]);



    return (
        <div className="mt-5">
            <Categories />
            <h1 className="mt-4">{cat}</h1>
            <div className="container-fluid">
                <div className="row my-4">
                    {products.map((product, index) => (
                        <div key={product._id || index} className="col-md-3 my-3">
                            <ProductCard
                                id={product._id}
                                title={product.title}
                                price={product.price}
                                imgs={product.images}
                            />

                        </div>
                    ))}
                </div>
            </div>

        </div>

    );
}

export default Category;