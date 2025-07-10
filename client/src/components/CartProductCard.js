import React from "react";
import './CartProductCard.css';
import { CartContext } from '../cartContext';
import { LuTrash2, LuPlus, LuMinus } from "react-icons/lu";

function CartProductCard({ id, img, title, price, count, size, itemKey, stock }) {
  const { addItemToCart, removeItemFromCart } = React.useContext(CartContext);

  // Handle quantity increase with stock check
  const handleIncrease = () => {
    if (count < stock) {
      addItemToCart(id, 1, size || '', stock);
    }
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    addItemToCart(id, -1, size || '', stock);
  };

  return (
    <div className="cart-product-card">
      <div className="cart-product-image-container">
        <img src={img instanceof Array ? img[0] : img} className="cart-product-image" alt={title} />
      </div>
      <div className="cart-product-details">
        <span>
          <h3 className="cart-product-title">{title}</h3>
          {size && size !== 'no-size' && (
            <p className="cart-product-size text-muted">Size: {size}</p>
          )}
          <p className="cart-product-price">Rs. {price}</p>
        </span>
        <div >
          <div className="cart-product-quantity">
            <button 
              className="quantity-button" 
              onClick={handleDecrease}
            > 
              <LuMinus/>  
            </button>
            <span className="quantity-count">{count}</span>
            <button 
              className="quantity-button" 
              onClick={handleIncrease}
              disabled={count >= stock}
              style={{
                opacity: count >= stock ? 0.5 : 1,
                cursor: count >= stock ? 'not-allowed' : 'pointer'
              }}
            > 
              <LuPlus/> 
            </button>
          </div>
          {/* Stock indicator */}
          <div className="text-muted small mb-2">
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </div>
          <button className="delete-button" onClick={() => removeItemFromCart(id, size || '')}> <LuTrash2/> </button>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
