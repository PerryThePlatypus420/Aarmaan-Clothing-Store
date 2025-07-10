import React, { useState, useEffect, useContext } from 'react';
import CartProductCard from '../components/CartProductCard';
import { CartContext } from '../cartContext';
import { useSettings } from '../settingsContext';
import { Link } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";

const API_URL = process.env.REACT_APP_API_URL;

function Cart() {
  const { cart } = useContext(CartContext);
  const { settings, loading: settingsLoading } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        // Extract unique product IDs from cart items
        const productIds = Object.values(cart.items || {})
          .map(item => item && item.productId ? item.productId : null)
          .filter(id => id && typeof id === 'string' && id.trim() !== '' && id !== 'undefined');

        const uniqueProductIds = [...new Set(productIds)];

        console.log('Cart items:', cart.items);
        console.log('Unique product IDs:', uniqueProductIds);

        if (uniqueProductIds.length === 0) {
          setLoading(false);
          setProducts([]);
          return;
        }

        const response = await fetch(`${API_URL}/api/products/ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: uniqueProductIds })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching cart products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cart]);

  const total = products.reduce((acc, product) => {
    // Find all cart items for this product
    const productItems = Object.values(cart.items || {}).filter(item => item.productId === product._id);
    const productTotal = productItems.reduce((sum, item) => {
      if (item.quantity && typeof item.quantity === 'number' && item.quantity > 0) {
        return sum + product.price * item.quantity;
      }
      return sum;
    }, 0);
    return acc + productTotal;
  }, 0);

  if (loading || settingsLoading) return <div className="d-flex justify-content-center align-items-center vh-100">
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
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className='h2 fw-bold text-dark mb-0'>Shopping Cart</h1>
            {cart.count > 0 && (
              <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                {cart.count} {cart.count === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          
          {(!cart.count || cart.count === 0) ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-cart-x display-1 text-muted"></i>
              </div>
              <h3 className="text-muted mb-3">Your cart is empty</h3>
              <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet</p>
              <Link to='/' className='btn btn-dark btn-lg px-4'>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className='row g-4'>
              {products.length > 0 && products.map(product => {
                // Find all cart items for this product (different sizes)
                const productItems = Object.entries(cart.items || {}).filter(([key, item]) =>
                  item && item.productId === product._id
                );

                return productItems.map(([itemKey, item]) => {
                  // Get stock for the specific size or general stock
                  const getStockForSize = () => {
                    if (product.sizes && product.sizes.length > 0) {
                      const sizeObj = product.sizes.find(s => s.size === item.size);
                      return sizeObj ? sizeObj.stock : 0;
                    } else {
                      return product.stock || 0;
                    }
                  };

                  return (
                    <div className='col-12' key={itemKey}>
                      <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                          <CartProductCard
                            id={product._id}
                            title={product.title}
                            price={product.price}
                            img={product.images}
                            count={item.quantity || 0}
                            size={item.size || ''}
                            itemKey={itemKey}
                            stock={getStockForSize()}
                          />
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          )}
        </div>
      </div>

      {cart.count > 0 && (
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h4 className="card-title fw-bold mb-3">Order Summary</h4>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Total Items:</span>
                      <span className="fw-semibold">{cart.count}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Subtotal:</span>
                      <span className="fw-bold fs-5">Rs. {total.toLocaleString()}</span>
                    </div>
                    <div className="border-top pt-3">
                      {settings.freeDeliveryThreshold !== null ? (
                        total >= settings.freeDeliveryThreshold ? (
                          <div className="d-flex align-items-center text-success">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <span className="fw-semibold">You have got free delivery!</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center text-warning">
                            <i className="bi bi-truck me-2"></i>
                            <span>Rs. {(settings.freeDeliveryThreshold - total).toLocaleString()} more for free delivery</span>
                          </div>
                        )
                      ) : (
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-truck me-2"></i>
                          <span>Standard delivery charge of Rs. {settings.deliveryFee?.toLocaleString()} applies to all orders</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <Link to='/checkout' className='btn btn-dark btn-lg px-4 py-3 shadow-sm'>
                      <i className="bi bi-arrow-right me-2"></i>
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Cart;
