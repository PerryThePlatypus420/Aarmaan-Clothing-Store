import React, { useContext } from "react";
import './ProductCard.css';
import { CartContext } from "../cartContext";
import { FaCartPlus } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { WishlistContext } from "../wishlistContext";
import { Link } from "react-router-dom";

function ProductCard({ id, img, title, price }) {
  const { addItemToCart } = useContext(CartContext);
  const { toggleItemInWishlist, isInWishlist } = useContext(WishlistContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItemToCart(id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItemInWishlist(id);
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="product-card">
        <div
          className="product-image-container"
          style={{ backgroundImage: `url(${img instanceof Array ? img[0] : img})` }}
        >
        </div>
        <div className="product-details">
          <h3 className="product-title text-black">{title}</h3>
          <p className="product-price text-black">Rs. {price}</p>
          <div className="d-flex justify-content-between">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaCartPlus /> <span>Add to Cart</span>
            </button>
            <div className="heart-cont" onClick={handleWishlist}>
              {isInWishlist(id) ? (
                <IoHeart className="heart-icon filled" />
              ) : (
                <IoHeartOutline className="heart-icon outline" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
