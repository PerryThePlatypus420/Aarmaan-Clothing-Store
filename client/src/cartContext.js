import { useState, createContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || 0) || { count: 0 });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart updated:', cart);
    }, [cart]);

    const addItemToCart = (productId, count) => {
        count = parseInt(count);
        if (cart[productId] === 1 && count === -1) {
            removeItemFromCart(productId);
            toast.success('Product removed from cart');
            return;
        }
        setCart({ ...cart, [productId]: (cart[productId] || 0) + count, count: cart.count + count });
        if (count > 0) {
            toast.success('Product added to cart');
        }
        else {
            toast.success('Product removed from cart');
        }

    }

    const removeItemFromCart = (productId) => {
        const newCart = { ...cart };
        delete newCart[productId];
        setCart({ ...newCart, count: cart.count - cart[productId] });
        toast.success('Product removed from cart');
    }

    return (
        <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart }}>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                stacked
            />
            {children}
        </CartContext.Provider>
    );
};