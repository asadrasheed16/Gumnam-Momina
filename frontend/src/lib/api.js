import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('gm_token');
      localStorage.removeItem('gm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const register         = (data)      => api.post('/auth/register', data);
export const login            = (data)      => api.post('/auth/login', data);
export const getMe            = ()          => api.get('/auth/me');
export const updateProfile    = (data)      => api.put('/users/me/profile', data);

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts      = (params)    => api.get('/products', { params });
export const getProduct       = (id)        => api.get(`/products/${id}`);
export const createProduct    = (data)      => api.post('/products', data);
export const updateProduct    = (id, data)  => api.put(`/products/${id}`, data);
export const deleteProduct    = (id)        => api.delete(`/products/${id}`);
export const seedProducts     = ()          => api.post('/products/seed/data');
export const addReview        = (id, data)  => api.post(`/products/${id}/review`, data);

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart          = ()          => api.get('/cart');
export const addToCart        = (data)      => api.post('/cart', data);
export const updateCartItem   = (id, data)  => api.put(`/cart/${id}`, data);
export const removeCartItem   = (id)        => api.delete(`/cart/${id}`);
export const clearCart        = ()          => api.delete('/cart');

// ── Wishlist ─────────────────────────────────────────────────────────────────
export const getWishlist      = ()          => api.get('/wishlist');
export const toggleWishlist   = (productId) => api.post(`/wishlist/${productId}`);
export const removeWishlist   = (productId) => api.delete(`/wishlist/${productId}`);

// ── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder       = (data)      => api.post('/orders', data);
export const getMyOrders      = ()          => api.get('/orders/my');
export const getOrder         = (id)        => api.get(`/orders/${id}`);
export const getAllOrders      = (params)    => api.get('/orders', { params });
export const updateOrderStatus= (id, data)  => api.put(`/orders/${id}/status`, data);
export const getAdminStats    = ()          => api.get('/orders/admin/stats');

// ── Admin Users ───────────────────────────────────────────────────────────────
export const getAdminUsers    = (params)    => api.get('/users', { params });
export const getAdminUser     = (id)        => api.get(`/users/${id}`);
export const updateAdminUser  = (id, data)  => api.put(`/users/${id}`, data);
export const deleteAdminUser  = (id)        => api.delete(`/users/${id}`);

export default api;
