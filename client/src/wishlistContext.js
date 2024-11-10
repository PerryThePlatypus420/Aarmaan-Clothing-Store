import { useState, createContext, useEffect } from 'react';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || {});

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Wishlist updated:', wishlist);
    }, [wishlist]);

    const toggleItemInWishlist = (productId) => {
        if (wishlist[productId]) {
            removeItemFromWishlist(productId);
        } else {
            addItemToWishlist(productId);
        }
    };

    const addItemToWishlist = (productId) => {
        setWishlist({ ...wishlist, [productId]: true });
        console.log('Product added to wishlist');
    };

    const removeItemFromWishlist = (productId) => {
        const newWishlist = { ...wishlist };
        delete newWishlist[productId];
        setWishlist(newWishlist);
        console.log('Product removed from wishlist');
    };

    const isInWishlist = (productId) => {
        return !!wishlist[productId];
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleItemInWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
