'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hell_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { localStorage.removeItem('hell_cart'); }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('hell_cart', JSON.stringify(items));
  }, [items, hydrated]);

  // The cart belongs to a logged-in user. Once auth has resolved and there is
  // no user (logged out / never logged in), keep the cart empty.
  useEffect(() => {
    if (hydrated && !loading && !user) {
      setItems((prev) => (prev.length ? [] : prev));
    }
  }, [user, loading, hydrated]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, imageUrl: product.imageUrl, qty }];
    });
  };

  const updateQty = (id, qty) => {
    const q = Math.max(1, parseInt(qty, 10) || 1);
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty: q } : i)));
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
