import React, { useState, useEffect, useContext } from 'react';
import CartProductCard from '../components/CartProductCard';
import { CartContext } from '../cartContext';
import { Link } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";


function Cart() {
  const { cart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const productIds = Object.keys(cart).filter(id => id !== 'count');
        if (productIds.length === 0) {
          setLoading(false);
          setProducts([]);
          return;
        }

        const response = await fetch('http://localhost:3001/api/products/ids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: productIds })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cart]);

  const total = products.reduce((acc, product) => {
    const quantity = cart[product.id];
    return acc + product.price * quantity;
  }, 0);

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">
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
    <div className="cart mt-5">
      <h1 className='mb-5'>Cart</h1>
      <div className='row'>
        {
          cart.count === 0 && <h3>Your cart is empty</h3>
        }
        {products.map(product => (
          <div className='col-md-8 col-sm-10 offset-md-2 offset-sm-1 mb-3' key={product.id}>
            <CartProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              img={product.img}
              count={cart[product.id]}
            />
          </div>
        ))}
      </div>
      {cart.count > 0 && (
        <div className="card bg-light mt-3 p-3">
          <div className="card-body">
            <h4 className="card-title">Summary</h4>
            <p className="card-text">Total Items: {cart.count}</p>
            <p className="card-text">Total: Rs. {total}</p>
            <p className="card-text">
              {total >= 2500 ? (
                <span className="text-success">You have got free delivery!</span>
              ) : (
                <span className='text-danger'>Rs. {2500 - total} to go for free delivery!</span>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="mt-5">
        {cart.count > 0 ? (
          <Link to='/checkout' className='btn btn-dark btn-lg'>Checkout</Link>
        ) : (
          <Link to='/' className='btn btn-dark btn-lg'>Continue Shopping</Link>
        )}
      </div>
    </div>
  );
}

export default Cart;
