import { useState, createContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '{}') || {};
            
            // Check if cart is in old format (just product IDs with counts)
            if (savedCart.count && typeof savedCart.count === 'number' && !savedCart.items) {
                // Convert old format to new format
                const newCart = { items: {}, count: 0 };
                Object.keys(savedCart).forEach(key => {
                    if (key !== 'count' && key !== 'undefined' && key !== null && key !== '' && key !== undefined && key.trim() !== '' && typeof key === 'string') {
                        // Create a default size entry for existing items
                        const itemKey = `${key}_no-size`;
                        newCart.items[itemKey] = {
                            productId: key,
                            size: '',
                            quantity: savedCart[key]
                        };
                        newCart.count += savedCart[key];
                    }
                });
                return newCart;
            }
            
            // New format - validate and clean up
            if (savedCart.items && typeof savedCart.items === 'object') {
                const cleanedCart = { items: {}, count: 0 };
                Object.keys(savedCart.items).forEach(key => {
                    const item = savedCart.items[key];
                    if (item && item.productId && typeof item.productId === 'string' && item.productId.trim() !== '' && item.productId !== 'undefined' && item.productId !== 'items') {
                        cleanedCart.items[key] = {
                            productId: item.productId,
                            size: item.size || '',
                            quantity: parseInt(item.quantity) || 0
                        };
                        cleanedCart.count += parseInt(item.quantity) || 0;
                    }
                });
                return cleanedCart;
            }
            
            // Empty cart
            return { items: {}, count: 0 };
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            return { items: {}, count: 0 };
        }
    });

    useEffect(() => {
        try {
            // Ensure count is always a number
            const cartToSave = {
                ...cart,
                count: parseInt(cart.count) || 0
            };
            localStorage.setItem('cart', JSON.stringify(cartToSave));
            console.log('Cart updated:', cartToSave);
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cart]);

    const addItemToCart = (productId, count, size = '', stock = null) => {
        // Validate productId before proceeding
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string' || productId === 'items') {
            console.error('Invalid productId:', productId);
            toast.error('Invalid product ID');
            return;
        }
        
        count = parseInt(count);
        if (isNaN(count)) {
            console.error('Invalid count:', count);
            toast.error('Invalid quantity');
            return;
        }
        
        // Create unique key for product + size combination
        const itemKey = `${productId}_${size || 'no-size'}`;
        const currentItem = cart.items[itemKey];
        
        if (currentItem && currentItem.quantity === 1 && count === -1) {
            removeItemFromCart(productId, size);
            return;
        }
        
        const newCart = { ...cart };
        if (!newCart.items) {
            newCart.items = {};
        }
        
        if (currentItem) {
            const newQuantity = currentItem.quantity + count;
            if (newQuantity <= 0) {
                removeItemFromCart(productId, size);
                return;
            }
            
            // Check stock limit if stock is provided and we're increasing quantity
            if (stock !== null && count > 0 && newQuantity > stock) {
                toast.error(`Cannot add more items. Only ${stock} in stock`);
                return;
            }
            
            newCart.items[itemKey] = {
                ...currentItem,
                quantity: newQuantity
            };
        } else {
            if (count <= 0) {
                return; // Don't add negative quantities for new items
            }
            
            // Check stock limit for new items if stock is provided
            if (stock !== null && count > stock) {
                toast.error(`Cannot add ${count} items. Only ${stock} in stock`);
                return;
            }
            
            newCart.items[itemKey] = {
                productId,
                size,
                quantity: count
            };
        }
        
        // Recalculate total count
        newCart.count = 0;
        Object.values(newCart.items).forEach(item => {
            newCart.count += parseInt(item.quantity) || 0;
        });
        
        setCart(newCart);
        if (count > 0) {
            toast.success('Product added to cart');
        } else {
            toast.success('Product quantity updated');
        }
    }

    const removeItemFromCart = (productId, size = '') => {
        // Validate productId before proceeding
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string' || productId === 'items') {
            console.error('Invalid productId:', productId);
            toast.error('Invalid product ID');
            return;
        }
        
        const itemKey = `${productId}_${size || 'no-size'}`;
        const currentItem = cart.items[itemKey];
        
        if (!currentItem) {
            console.error('Item not found in cart:', itemKey);
            return;
        }
        
        const newCart = { ...cart };
        delete newCart.items[itemKey];
        
        // Recalculate total count
        newCart.count = 0;
        Object.values(newCart.items).forEach(item => {
            newCart.count += parseInt(item.quantity) || 0;
        });
        
        setCart(newCart);
        toast.success('Product removed from cart');
    }

    const resetCart = () => {
        const freshCart = { items: {}, count: 0 };
        setCart(freshCart);
        try {
            localStorage.removeItem('cart');
            localStorage.setItem('cart', JSON.stringify(freshCart));
        } catch (error) {
            console.error('Error clearing cart from localStorage:', error);
        }
        toast.success('Cart reset successfully');
    }

    return (
        <CartContext.Provider value={{ cart, setCart, addItemToCart, removeItemFromCart, resetCart }}>
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