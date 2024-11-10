import React from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../cartContext";
import { useContext } from "react";
import { FaCartPlus } from "react-icons/fa";
import { WishlistContext } from "../wishlistContext";
import Heart from "react-animated-heart";
import { ThreeDots } from "react-loader-spinner";


function Product() {
  const { addItemToCart } = useContext(CartContext);
  const { toggleItemInWishlist, isInWishlist } = useContext(WishlistContext);

  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);

  const [product, setProduct] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:3001/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const [items, setItems] = React.useState(1);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
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
  }

  const {
    productDescription,
    fabricComposition,
    designDetails
  } = product.description || {};


  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItemInWishlist(id);
  }


  return (
    <div className="container py-5 text-start">
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          {/* Product Image */}
          <div className="overflow-hidden rounded shadow-sm">
            <img
              src={product.img}
              alt="Product-Image"
              className="img-fluid w-100"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>
        </div>
        {/* Product Details */}
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div className="d-flex flex-column justify-content-center gap-4">
            {/* Product Title */}
            <h1 className="h3 fw-bold text-black d-flex align-items-center justify-content-between">
              {product.title}
              <div className="heart-cont ms-2">
                <Heart isClick={isInWishlist(id)} onClick={handleWishlist} />
              </div>
            </h1>

            {/* Product Description */}
            {productDescription && (
              <p className="mt-3">
                <b>Product Description: </b>{productDescription}
              </p>
            )}
            {fabricComposition && (
              <div className="mt-3 ">
                <b>Fabric Composition: </b>
                <ul>
                  {Object.entries(fabricComposition).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
            )}
            {designDetails && (
              <div className="mt-3 ">
                <b>Design Details: </b>
                <ul>
                  {Object.entries(designDetails).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Product Price */}
            <span className="h4 fw-bold text-black">Rs. {product.price}</span>
          </div>
          {/* Quantity Input and Order Button */}
          <div className="mt-4">
            <div className="mb-3">
              {/* Quantity Label */}
              <div className="d-flex flex-row align-items-center justify-content-between gap-3">
                <label className="fw-bold">Quantity</label>
                {/* Quantity Input */}
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  required
                  onChange={(e) => setItems(e.target.value)}
                  value={items}
                  style={{ maxWidth: "100px" }}
                />
                {/* Order Button */}
                <button
                  className="btn btn-dark d-flex justify-content-center align-items-center gap-2 flex-grow-1"
                  title="Confirm Order"
                  onClick={() => addItemToCart(id, items)}
                >
                  <FaCartPlus /> <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;