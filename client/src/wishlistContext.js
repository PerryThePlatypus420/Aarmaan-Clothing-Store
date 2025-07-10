import { useState, createContext, useEffect } from 'react';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
        // Clean up invalid keys
        const cleanedWishlist = {};
        Object.keys(savedWishlist).forEach(key => {
            if (key && key !== 'undefined' && key !== null && key !== '' && key !== undefined && key.trim() !== '') {
                cleanedWishlist[key] = savedWishlist[key];
            }
        });
        return cleanedWishlist;
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Wishlist updated:', wishlist);
    }, [wishlist]);

    const toggleItemInWishlist = (productId) => {
        // Validate productId before proceeding
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string') {
            console.error('Invalid productId in wishlist:', productId);
            return;
        }
        
        if (wishlist[productId]) {
            removeItemFromWishlist(productId);
        } else {
            addItemToWishlist(productId);
        }
    };

    const addItemToWishlist = (productId) => {
        // Validate productId before proceeding
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string') {
            console.error('Invalid productId in addItemToWishlist:', productId);
            return;
        }
        
        setWishlist({ ...wishlist, [productId]: true });
        console.log('Product added to wishlist');
    };

    const removeItemFromWishlist = (productId) => {
        // Validate productId before proceeding
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string') {
            console.error('Invalid productId in removeItemFromWishlist:', productId);
            return;
        }
        
        const newWishlist = { ...wishlist };
        delete newWishlist[productId];
        setWishlist(newWishlist);
        console.log('Product removed from wishlist');
    };

    const isInWishlist = (productId) => {
        // Validate productId before checking
        if (!productId || productId === 'undefined' || productId === undefined || productId === null || productId === '' || typeof productId !== 'string') {
            return false;
        }
        return !!wishlist[productId];
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleItemInWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
