import React, { useContext } from "react";
import './ProductCard.css';
import { CartContext } from "../cartContext";
import { FaCartPlus } from "react-icons/fa";
import Heart from "react-animated-heart";
import { WishlistContext } from "../wishlistContext";
import { Link } from "react-router-dom";

function ProductCard({ id, img, title, price }) {

  const { addItemToCart } = useContext(CartContext);

  const { toggleItemInWishlist, isInWishlist } = useContext(WishlistContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItemToCart(id, 1);
  }

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItemInWishlist(id);
  }


  return (
    <Link to={`/product/${id}`}>
      <div className="product-card">
        <div
          className="product-image-container"
          style={{ backgroundImage: `url(${img})` }}
        >
        </div>
        <div className="product-details">
          <h3 className="product-title text-black">{title}</h3>
          <p className="product-price text-black">Rs. {price}</p>
          <div className="d-flex justify-content-around">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaCartPlus /> <span>Add to Cart</span>
            </button>
            <div className="heart-cont">
              <Heart isClick={isInWishlist(id)} onClick={handleWishlist} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
