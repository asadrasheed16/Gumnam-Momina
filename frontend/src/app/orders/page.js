'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const STATUS_STYLE = {
  Placed:     { bg:'#EEF5FF', color:'#4B8BE8', border:'#BDD3F7' },
  Confirmed:  { bg:'#FDF6E3', color:'#B8851F', border:'#F2D07A' },
  Processing: { bg:'#FFFBE6', color:'#B89200', border:'#F2D07A' },
  Shipped:    { bg:'#FFF5EC', color:'#8B5CF6', border:'#D8CFED' },
  Delivered:  { bg:'#F0FFF4', color:'#5A9B44', border:'#BDD8B0' },
  Cancelled:  { bg:'#FFF5EC', color:'#D4760A', border:'#FFCCD6' },
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_STYLE[order.orderStatus] || { bg:'#FFF5EC', color:'#8A6A58', border:'rgba(212,118,10,0.12)' };

  return (
    <div className="rounded-3xl border overflow-hidden shadow-soft" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
      <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-[rgba(212,118,10,0.04)]/30 transition-colors" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'#FFF5EC'}}>
            <FiPackage size={16} style={{color:'#D4760A'}} />
          </div>
          <div>
            <p className="font-dm font-semibold text-[#2D1810] text-sm">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="font-dm text-[10px] tracking-wider" style={{color:'#8A6A58'}}>
              {new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-dm text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
            style={{background:s.bg, color:s.color, borderColor:s.border}}>
            {order.orderStatus}
          </span>
          <span className="font-playfair font-semibold text-lg" style={{color:'#D4760A', fontFamily:'Playfair Display,serif'}}>
            PKR {order.total.toLocaleString()}
          </span>
          {open ? <FiChevronUp size={14} style={{color:'rgba(61,43,53,0.4)'}} /> : <FiChevronDown size={14} style={{color:'rgba(61,43,53,0.4)'}} />}
        </div>
      </div>

      {open && (
        <div className="border-t p-5" style={{borderColor:'rgba(212,118,10,0.12)'}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-3 font-medium" style={{color:'#B8862C'}}>Items</p>
              <div className="space-y-3">
                {order.items.map((item,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-13 rounded-2xl overflow-hidden flex-shrink-0 border" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm text-[#2D1810] italic line-clamp-1" style={{fontFamily:'Playfair Display,serif'}}>{item.name}</p>
                      <p className="font-dm text-[10px]" style={{color:'#8A6A58'}}>
                        {[item.size&&`Size: ${item.size}`, item.color&&item.color, `×${item.quantity}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="font-dm text-xs font-semibold" style={{color:'#D4760A'}}>PKR {(item.price*item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-2 font-medium" style={{color:'#B8862C'}}>Shipping To</p>
                <p className="font-dm text-sm text-[#2D1810] font-medium">{order.shippingAddress?.name}</p>
                <p className="font-dm text-xs" style={{color:'#8A6A58'}}>{order.shippingAddress?.street}</p>
                <p className="font-dm text-xs" style={{color:'#8A6A58'}}>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
              </div>
              <div>
                <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-2 font-medium" style={{color:'#B8862C'}}>Payment</p>
                <p className="font-dm text-sm text-[#2D1810]">{order.paymentMethod}</p>
                <p className="font-dm text-xs font-medium" style={{color: order.paymentStatus==='Paid' ? '#7AA364' : '#E89830'}}>{order.paymentStatus}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="font-dm text-[10px] tracking-[0.3em] uppercase mb-1 font-medium" style={{color:'#B8862C'}}>Tracking</p>
                  <p className="font-dm text-sm font-medium" style={{color:'#D4760A'}}>{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      getMyOrders().then(res => setOrders(res.data)).catch(()=>{}).finally(()=>setLoading(false));
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#FFF9F2'}}>
      <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{background:'#FFF9F2'}}>
      <div className="py-14 text-center relative overflow-hidden" style={{background:'linear-gradient(160deg,#FFF5EC,#FFF9F2,#FFF3E6)'}}>
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative">
          <p className="font-dm text-[10px] tracking-[0.4em] uppercase mb-3" style={{color:'#B8862C'}}>My Account</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#2D1810] italic" style={{fontFamily:'Playfair Display,serif'}}>My Orders 📦</h1>
          <div className="lace-divider max-w-48 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {orders.length === 0 ? (
          <div className="text-center py-28 rounded-3xl border" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{background:'#FFF5EC'}}>
              <FiPackage size={32} style={{color:'#F5C6D0'}} />
            </div>
            <p className="font-playfair text-3xl text-[#2D1810]/40 italic mb-3" style={{fontFamily:'Playfair Display,serif'}}>No orders yet</p>
            <p className="font-dm text-xs tracking-wider mb-8 uppercase" style={{color:'#B8862C'}}>Your orders will appear here ✨</p>
            <Link href="/products" className="btn-rose px-8 py-3 rounded-full text-xs">Start Shopping 🌸</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => <OrderCard key={o._id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}
