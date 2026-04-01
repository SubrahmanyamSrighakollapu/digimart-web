// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);
  }, []);

  const updateStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (product, quantity) => {
    const existing = cartItems.findIndex(item => item.id === product.id);
    let updated;
    
    if (existing > -1) {
      updated = cartItems.map((item, i) =>
        i === existing ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...cartItems, { ...product, quantity }];
    }
    
    updateStorage(updated);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    updateStorage(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateStorage(updated);
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeItem,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};