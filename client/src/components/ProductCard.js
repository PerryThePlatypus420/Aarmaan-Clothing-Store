import React, { useContext } from "react";
import './ProductCard.css';
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { WishlistContext } from "../wishlistContext";
import { Link } from "react-router-dom";

function ProductCard({ id, imgs, title, price }) {
  const { toggleItemInWishlist, isInWishlist } = useContext(WishlistContext);

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItemInWishlist(id);
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="product-card">
        <div
          className="product-image-container"
          style={{ backgroundImage: `url(${imgs instanceof Array ? imgs[0] : imgs})` }}
        >
          <div className="heart-cont" onClick={handleWishlist}>
            {isInWishlist(id) ? (
              <IoHeart className="heart-icon filled" />
            ) : (
              <IoHeartOutline className="heart-icon outline" />
            )}
          </div>
        </div>
        <div className="product-details">
          <h3 className="product-title text-black">{title}</h3>
          <p className="product-price text-black">Rs. {price}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
