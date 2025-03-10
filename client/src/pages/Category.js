import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";

function Category() {

    const { cat } = useParams();

    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`http://localhost:3001/api/products/category/${cat}`);
            const data = await response.json();
            setProducts(data);
        };
        fetchProducts();
    }, [cat]);



    return (
        <div className="mt-5">
            <Categories />
            <h1 className="mt-4">{cat}</h1>

            <div className="row my-4">
                {products.map((product, index) => (
                    <div key={product.id || index} className="col-md-3 my-3">
                        <ProductCard
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            img={product.img}
                        />
                    </div>
                ))}
            </div>


        </div>

    );
}

export default Category;