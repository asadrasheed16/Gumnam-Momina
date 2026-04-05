'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminStats, getAllOrders, getProducts, getAdminUsers } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiTrendingUp, FiPackage, FiShoppingBag, FiUsers,
  FiGrid, FiArrowRight, FiClock, FiCheckCircle,
} from 'react-icons/fi';

const STATUS_STYLE = {
  Placed:     { bg:'#EEF5FF', color:'#4B8BE8' },
  Confirmed:  { bg:'#FDF6E3', color:'#B8851F' },
  Processing: { bg:'#FFFBE6', color:'#B89200' },
  Shipped:    { bg:'#FFF5EC', color:'#8B5CF6' },
  Delivered:  { bg:'#F0FFF4', color:'#5A9B44' },
  Cancelled:  { bg:'#FFF5EC', color:'#D4760A' },
};

function StatCard({ icon: Icon, emoji, label, value, sub, color, bg, href }) {
  return (
    <Link href={href || '#'} className="block rounded-3xl p-5 border shadow-soft transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: bg }}>
          {emoji}
        </div>
        <FiArrowRight size={14} style={{ color: '#B8862C' }} />
      </div>
      <p className="font-playfair text-3xl font-bold text-[#2D1810]" style={{ fontFamily: 'Playfair Display,serif' }}>{value}</p>
      <p className="font-dm text-[10px] tracking-[0.2em] uppercase mt-1 font-medium" style={{ color: '#8A6A58' }}>{label}</p>
      {sub && <p className="font-dm text-xs mt-0.5" style={{ color }}>{sub}</p>}
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats,          setStats]          = useState(null);
  const [recentOrders,   setRecentOrders]   = useState([]);
  const [lowStockItems,  setLowStockItems]  = useState([]);
  const [userCount,      setUserCount]      = useState(0);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.role === 'admin') return;
    const load = async () => {
      try {
        const [statsRes, ordersRes, productsRes, usersRes] = await Promise.allSettled([
          getAdminStats(),
          getAllOrders({ limit: 6 }),
          getProducts({ limit: 50 }),
          getAdminUsers({ limit: 1 }),
        ]);
        if (statsRes.status    === 'fulfilled') setStats(statsRes.value.data);
        if (ordersRes.status   === 'fulfilled') setRecentOrders(ordersRes.value.data.orders || []);
        if (productsRes.status === 'fulfilled') {
          const lowStock = (productsRes.value.data.products || []).filter(p => p.stock <= 5 && p.stock > 0);
          setLowStockItems(lowStock.slice(0, 5));
        }
        if (usersRes.status === 'fulfilled') setUserCount(usersRes.value.data.total || 0);
      } catch {}
      setLoading(false);
    };
    if (user?.role === 'admin') load();
  }, [user]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF9F2' }}>
      <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    {
      emoji: '💰', label: 'Total Revenue', color: '#10B981', bg: '#F0FDF8',
      value: stats ? `PKR ${(stats.totalRevenue / 1000).toFixed(0)}k` : '—',
      sub: 'All confirmed orders', href: '/admin/orders',
    },
    {
      emoji: '📦', label: 'Total Orders', color: '#4B8BE8', bg: '#EEF5FF',
      value: stats?.totalOrders ?? '—',
      sub: `${stats?.pendingOrders ?? 0} pending`, href: '/admin/orders',
    },
    {
      emoji: '✅', label: 'Delivered', color: '#5A9B44', bg: '#F0FFF4',
      value: stats?.deliveredOrders ?? '—',
      sub: 'Successfully fulfilled', href: '/admin/orders',
    },
    {
      emoji: '👥', label: 'Customers', color: '#C68B2C', bg: '#FFF5EC',
      value: userCount || '—',
      sub: 'Registered accounts', href: '/admin/users',
    },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FFF9F2' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
        <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#B8862C' }}>Admin Panel</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-playfair text-3xl text-[#2D1810] italic" style={{ fontFamily: 'Playfair Display,serif' }}>
              Dashboard 📊
            </h1>
            <p className="font-dm text-xs mt-1" style={{ color: '#8A6A58' }}>
              Welcome back, {user?.name?.split(' ')[0]} ✦ {new Date().toLocaleDateString('en-PK', { weekday:'long', day:'numeric', month:'long' })}
            </p>
          </div>
          <Link href="/admin/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-dm font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#D4760A,#C68B2C)' }}>
            <FiGrid size={12} /> + Add Product
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(c => <StatCard key={c.label} {...c} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="lg:col-span-2 rounded-3xl border shadow-soft overflow-hidden" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(212,118,10,0.12)', background: 'linear-gradient(135deg,#FFF5EC,#FFF9F2)' }}>
              <div className="flex items-center gap-2">
                <FiPackage size={14} style={{ color: '#D4760A' }} />
                <p className="font-dm font-bold text-sm text-[#2D1810]">Recent Orders</p>
              </div>
              <Link href="/admin/orders" className="font-dm text-[10px] tracking-wider uppercase font-bold flex items-center gap-1" style={{ color: '#D4760A' }}>
                View All <FiArrowRight size={11}/>
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center">
                <FiPackage size={32} className="mx-auto mb-3" style={{ color: '#F5C6D0' }} />
                <p className="font-dm text-sm" style={{ color: '#8A6A58' }}>No orders yet</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#FFF5EC' }}>
                {recentOrders.map(order => {
                  const s = STATUS_STYLE[order.orderStatus] || STATUS_STYLE.Placed;
                  return (
                    <div key={order._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[rgba(212,118,10,0.04)]/30 transition-colors">
                      <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFF5EC' }}>
                        <FiShoppingBag size={14} style={{ color: '#D4760A' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-sm text-[#2D1810] font-semibold">#{order._id.slice(-7).toUpperCase()}</p>
                        <p className="font-dm text-[10px] truncate" style={{ color: '#8A6A58' }}>{order.user?.name || 'Guest'} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-dm font-bold text-sm" style={{ color: '#D4760A' }}>PKR {order.total?.toLocaleString()}</p>
                        <span className="font-dm text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Low Stock Alert + Quick Links */}
          <div className="space-y-5">

            {/* Low Stock */}
            <div className="rounded-3xl border shadow-soft overflow-hidden" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(212,118,10,0.12)', background: 'linear-gradient(135deg,#FFFBE6,#FFF9F2)' }}>
                <span>⚠️</span>
                <p className="font-dm font-bold text-sm text-[#2D1810]">Low Stock</p>
              </div>
              {lowStockItems.length === 0 ? (
                <div className="py-8 text-center">
                  <FiCheckCircle size={24} className="mx-auto mb-2" style={{ color: '#BDD8B0' }} />
                  <p className="font-dm text-xs" style={{ color: '#8A6A58' }}>All items well stocked ✦</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#FFF5EC' }}>
                  {lowStockItems.map(p => (
                    <div key={p._id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: 'rgba(212,118,10,0.12)' }}>
                        {p.images?.[0] && <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-xs text-[#2D1810] font-semibold truncate">{p.name}</p>
                        <p className="font-dm text-[10px]" style={{ color: p.stock <= 2 ? '#E89830' : '#B8851F' }}>
                          {p.stock} left {p.stock <= 2 ? '🔴' : '🟡'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-4 pb-4 pt-2">
                <Link href="/admin/products" className="block text-center py-2 rounded-xl text-[10px] font-dm font-bold tracking-wider uppercase transition-colors hover:bg-[rgba(212,118,10,0.04)]" style={{ color: '#D4760A', border: '1px dashed rgba(212,118,10,0.18)' }}>
                  Manage Products →
                </Link>
              </div>
            </div>

            {/* Quick Nav */}
            <div className="rounded-3xl border shadow-soft p-4" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
              <p className="font-dm text-[9px] tracking-[0.25em] uppercase font-bold mb-3 px-1" style={{ color: '#B8862C' }}>Quick Actions</p>
              <div className="space-y-1.5">
                {[
                  { href:'/admin/products', label:'Add New Product',   emoji:'🧕', color:'#D4760A' },
                  { href:'/admin/orders',   label:'View All Orders',   emoji:'📦', color:'#4B8BE8' },
                  { href:'/admin/users',    label:'Manage Users',      emoji:'👥', color:'#C68B2C' },
                  { href:'/products',       label:'View Storefront',   emoji:'🌸', color:'#10B981' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-dm font-medium transition-all hover:shadow-sm"
                    style={{ color: item.color }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5EC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                    <FiArrowRight size={11} className="ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Order Status Breakdown */}
        {stats && (
          <div className="rounded-3xl border shadow-soft p-6" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
            <div className="flex items-center gap-2 mb-5">
              <FiTrendingUp size={15} style={{ color: '#D4760A' }} />
              <p className="font-dm font-bold text-sm text-[#2D1810]">Order Overview</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'New / Placed',   value: stats.pendingOrders,   color: '#4B8BE8', bg: '#EEF5FF',  emoji: '🆕' },
                { label: 'In Progress',    value: stats.totalOrders - stats.pendingOrders - stats.deliveredOrders, color: '#B89200', bg: '#FFFBE6', emoji: '⚙️' },
                { label: 'Delivered',      value: stats.deliveredOrders, color: '#5A9B44', bg: '#F0FFF4',  emoji: '✅' },
                { label: 'Total Revenue',  value: `PKR ${(stats.totalRevenue/1000).toFixed(1)}k`, color: '#D4760A', bg: '#FFF3E6', emoji: '💰' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: item.bg }}>
                  <p className="text-2xl mb-1">{item.emoji}</p>
                  <p className="font-playfair text-2xl font-bold" style={{ color: item.color, fontFamily: 'Playfair Display,serif' }}>{item.value ?? 0}</p>
                  <p className="font-dm text-[10px] uppercase tracking-wider mt-1 font-medium" style={{ color: item.color + 'aa' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
