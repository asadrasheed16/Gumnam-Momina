'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId, quantity = 1, size, color) => {
    try {
      const res = await addToCart({ productId, quantity, size, color });
      setCart(res.data.cart);
      toast.success('Added to cart ✨');
      setCartOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(itemId, { quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const emptyCart = async () => {
    try {
      await clearCart();
      setCart([]);
    } catch {}
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartOpen, setCartOpen, addItem, updateItem, removeItem, emptyCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
