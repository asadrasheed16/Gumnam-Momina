'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, toggleWishlist } from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const res = await getWishlist();
      setWishlist(res.data || []);
    } catch {}
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (productId) => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      const res = await toggleWishlist(productId);
      setWishlist(res.data.wishlist || []);
      if (res.data.action === 'added') toast.success('Added to wishlist 💕');
      else toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const isWishlisted = (productId) =>
    wishlist.some(p => (p._id || p) === productId || (p._id?.toString?.() === productId));

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
