'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders, updateOrderStatus } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiPackage, FiChevronDown, FiChevronUp, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const ORDER_STATUSES   = ['Placed','Confirmed','Processing','Shipped','Delivered','Cancelled'];
const PAYMENT_STATUSES = ['Pending','Paid','Failed'];

const STATUS_STYLE = {
  Placed:     { bg:'#EEF5FF', color:'#4B8BE8', border:'#BDD3F7' },
  Confirmed:  { bg:'#FDF6E3', color:'#B8851F', border:'#F2D07A' },
  Processing: { bg:'#FFFBE6', color:'#B89200', border:'#F9E9BB' },
  Shipped:    { bg:'#FFF5EC', color:'#8B5CF6', border:'#D8CFED' },
  Delivered:  { bg:'#F0FFF4', color:'#5A9B44', border:'#BDD8B0' },
  Cancelled:  { bg:'#FFF5EC', color:'#D4760A', border:'#FFCCD6' },
};
const PAY_COLOR = { Pending:'#D4A030', Paid:'#7AA364', Failed:'#E89830' };

function OrderRow({ order, onUpdate }) {
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({
    orderStatus:   order.orderStatus,
    paymentStatus: order.paymentStatus,
    trackingNumber:order.trackingNumber || '',
  });

  const s = STATUS_STYLE[order.orderStatus] || STATUS_STYLE.Placed;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(order._id, form);
      toast.success('Order updated 🌸');
      setEditing(false);
      onUpdate();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="rounded-3xl border overflow-hidden shadow-soft mb-3" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>

      {/* Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-3 flex-1 text-left min-w-0">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:'#FFF5EC'}}>
            <FiPackage size={15} style={{color:'#D4760A'}} />
          </div>
          <div className="min-w-0">
            <p className="font-dm font-semibold text-[#2D1810] text-sm tracking-wide">
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="font-dm text-[10px] tracking-wider truncate" style={{color:'#8A6A58'}}>
              {order.user?.name} · {order.user?.email}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <span className="font-dm text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border flex-shrink-0"
            style={{background:s.bg, color:s.color, borderColor:s.border}}>
            {order.orderStatus}
          </span>
          <span className="font-playfair font-semibold text-lg flex-shrink-0" style={{color:'#D4760A', fontFamily:'Playfair Display,serif'}}>
            PKR {order.total.toLocaleString()}
          </span>
          <p className="font-dm text-[10px] flex-shrink-0 hidden sm:block" style={{color:'#B8862C'}}>
            {new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}
          </p>
          <div className="flex gap-1 ml-auto sm:ml-0">
            <button onClick={e => { e.stopPropagation(); setEditing(!editing); setOpen(true); }}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
              style={{borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.45)'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#F5C6D0';e.currentTarget.style.color='#D4760A';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(212,118,10,0.12)';e.currentTarget.style.color='rgba(61,43,53,0.45)';}}>
              <FiEdit2 size={12} />
            </button>
            <button onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
              style={{borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.45)'}}
              onMouseEnter={e=>e.currentTarget.style.background='#FFF5EC'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {open ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div className="border-t px-5 py-5 space-y-5" style={{borderColor:'rgba(212,118,10,0.12)'}}>

          {/* Edit form */}
          {editing && (
            <div className="rounded-2xl p-5 border" style={{background:'#FFF5EC', borderColor:'rgba(212,118,10,0.12)'}}>
              <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{color:'#D4760A'}}>
                Update Order ✏️
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label-sm">Order Status</label>
                  <select value={form.orderStatus} onChange={e => setForm(f=>({...f,orderStatus:e.target.value}))}
                    className="input-soft w-full px-3 py-2.5 text-xs rounded-xl">
                    {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label-sm">Payment Status</label>
                  <select value={form.paymentStatus} onChange={e => setForm(f=>({...f,paymentStatus:e.target.value}))}
                    className="input-soft w-full px-3 py-2.5 text-xs rounded-xl">
                    {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label-sm">Tracking Number</label>
                  <input type="text" value={form.trackingNumber}
                    onChange={e => setForm(f=>({...f,trackingNumber:e.target.value}))}
                    placeholder="TRK123456"
                    className="input-soft w-full px-3 py-2.5 text-xs rounded-xl" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleSave} disabled={saving}
                  className="btn-rose px-5 py-2 text-xs rounded-full flex items-center gap-1.5">
                  {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><FiSave size={11}/> Save</>}
                </button>
                <button onClick={() => setEditing(false)}
                  className="btn-outline-rose px-4 py-2 text-xs rounded-full flex items-center gap-1.5">
                  <FiX size={11}/> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items */}
            <div>
              <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-3" style={{color:'#B8862C'}}>Items Ordered</p>
              <div className="space-y-3">
                {order.items.map((item,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-13 rounded-xl overflow-hidden flex-shrink-0 border" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm text-[#2D1810] italic line-clamp-1" style={{fontFamily:'Playfair Display,serif'}}>{item.name}</p>
                      <p className="font-dm text-[10px]" style={{color:'#8A6A58'}}>
                        {[item.size&&`Size: ${item.size}`, item.color&&item.color, `×${item.quantity}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="font-dm text-xs font-semibold flex-shrink-0" style={{color:'#D4760A'}}>
                      PKR {(item.price*item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t space-y-1.5 text-xs font-dm" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                <div className="flex justify-between"><span style={{color:'#8A6A58'}}>Subtotal</span><span className="text-[#2D1810]">PKR {order.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span style={{color:'#8A6A58'}}>Shipping</span>
                  <span style={{color: order.shippingFee===0 ? '#7AA364' : '#3D2B35'}}>
                    {order.shippingFee===0 ? 'FREE' : `PKR ${order.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                  <span className="text-[#2D1810]">Total</span>
                  <span style={{color:'#D4760A'}}>PKR {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer details */}
            <div className="space-y-4">
              <div>
                <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-2" style={{color:'#B8862C'}}>Customer</p>
                <p className="font-dm font-semibold text-sm text-[#2D1810]">{order.user?.name}</p>
                <p className="font-dm text-xs" style={{color:'#8A6A58'}}>{order.user?.email}</p>
              </div>
              <div>
                <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-2" style={{color:'#B8862C'}}>Shipping Address</p>
                <p className="font-dm font-semibold text-sm text-[#2D1810]">{order.shippingAddress?.name}</p>
                {order.shippingAddress?.phone && <p className="font-dm text-xs" style={{color:'#8A6A58'}}>{order.shippingAddress.phone}</p>}
                <p className="font-dm text-xs" style={{color:'#8A6A58'}}>{order.shippingAddress?.street}</p>
                <p className="font-dm text-xs" style={{color:'#8A6A58'}}>
                  {order.shippingAddress?.city}, {order.shippingAddress?.province}
                </p>
              </div>
              <div>
                <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-2" style={{color:'#B8862C'}}>Payment</p>
                <p className="font-dm text-sm text-[#2D1810]">{order.paymentMethod}</p>
                <p className="font-dm text-xs font-semibold" style={{color: PAY_COLOR[order.paymentStatus]}}>
                  {order.paymentStatus}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-1" style={{color:'#B8862C'}}>Tracking</p>
                  <p className="font-dm text-sm font-semibold" style={{color:'#D4760A'}}>{order.trackingNumber}</p>
                </div>
              )}
              {order.notes && (
                <div>
                  <p className="font-dm text-[10px] tracking-[0.3em] uppercase font-medium mb-1" style={{color:'#B8862C'}}>Notes</p>
                  <p className="font-playfair italic text-sm" style={{color:'rgba(61,43,53,0.6)', fontFamily:'Playfair Display,serif'}}>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, authLoading, router]);

  const fetchOrders = async (p=1, status='') => {
    setLoading(true);
    try {
      const params = { page:p, limit:15 };
      if (status) params.status = status;
      const res = await getAllOrders(params);
      setOrders(res.data.orders); setTotal(res.data.total); setPages(res.data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchOrders(page, statusFilter);
  }, [user, page, statusFilter]);

  const handleFilter = (s) => { setStatusFilter(s); setPage(1); };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#FFF9F2'}}>
      <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
    </div>
  );
  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen pb-20" style={{background:'#FFF9F2'}}>
      <div className="max-w-6xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="mb-8">
          <p className="font-dm text-[10px] tracking-[0.4em] uppercase mb-1" style={{color:'#B8862C'}}>Admin Panel</p>
          <h1 className="font-playfair text-4xl text-[#2D1810] italic" style={{fontFamily:'Playfair Display,serif'}}>
            Orders 📦 <span className="font-dm text-xl not-italic" style={{color:'#B8862C'}}>({total})</span>
          </h1>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['', ...ORDER_STATUSES].map(s => {
            const active = statusFilter === s;
            const st = s ? STATUS_STYLE[s] : null;
            return (
              <button key={s||'all'} onClick={() => handleFilter(s)}
                className="px-4 py-2 text-xs font-dm font-medium rounded-full border transition-all"
                style={active
                  ? st ? {background:st.bg, color:st.color, borderColor:st.border, boxShadow:'0 2px 10px rgba(0,0,0,0.08)'}
                       : {background:'linear-gradient(135deg,#D4760A,#E89830)', color:'white', border:'none', boxShadow:'0 4px 14px rgba(201,79,109,0.25)'}
                  : {borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.5)'}}>
                {s || 'All Orders'}
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_,i) => <div key={i} className="h-16 skeleton rounded-3xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-28 rounded-3xl border" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
            <FiPackage size={36} className="mx-auto mb-4" style={{color:'#F5C6D0'}} />
            <p className="font-playfair text-3xl text-[#2D1810]/40 italic" style={{fontFamily:'Playfair Display,serif'}}>No orders found</p>
          </div>
        ) : (
          <>
            {orders.map(o => (
              <OrderRow key={o._id} order={o} onUpdate={() => fetchOrders(page, statusFilter)} />
            ))}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pages)].map((_,i) => (
                  <button key={i} onClick={() => setPage(i+1)}
                    className="w-10 h-10 text-xs font-dm font-medium rounded-full border transition-all"
                    style={page===i+1
                      ? {background:'linear-gradient(135deg,#D4760A,#E89830)', color:'white', border:'none', boxShadow:'0 4px 14px rgba(201,79,109,0.25)'}
                      : {borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.5)'}}>
                    {i+1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .form-label-sm {
          display:block; font-family:'DM Sans',sans-serif;
          font-size:9px; letter-spacing:0.3em; font-weight:600;
          color:#8A6A58; text-transform:uppercase; margin-bottom:5px;
        }
      `}</style>
    </div>
  );
}
