import React from "react";
import './CartProductCard.css';
import { CartContext } from '../cartContext';
import { LuTrash2, LuPlus, LuMinus } from "react-icons/lu";

function CartProductCard({ id, img, title, price, count }) {
  const { addItemToCart, removeItemFromCart } = React.useContext(CartContext);

  return (
    <div className="cart-product-card">
      <div className="cart-product-image-container">
        <img src={img} className="cart-product-image" alt={title} />
      </div>
      <div className="cart-product-details">
        <span>
          <h3 className="cart-product-title">{title}</h3>
          <p className="cart-product-price">Rs. {price}</p>
        </span>
        <div >
          <div className="cart-product-quantity">
            <button className="quantity-button" onClick={() => addItemToCart(id, -1)}> <LuMinus/>  </button>
            <span className="quantity-count">{count}</span>
            <button className="quantity-button" onClick={() => addItemToCart(id, 1)}> <LuPlus/> </button>
          </div>
          <button className="delete-button" onClick={() => removeItemFromCart(id)}> <LuTrash2/> </button>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
