'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct, seedProducts, getAdminStats } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiDatabase, FiPackage, FiShoppingBag, FiTrendingUp, FiStar, FiZap } from 'react-icons/fi';

const CATEGORIES = ['Abaya','Hijab','Namaz Chadar','Accessories','Gift Sets','Kids'];
const SIZES      = ['XS','S','M','L','XL','XXL','Free Size'];

const emptyForm = {
  name:'', description:'', price:'', originalPrice:'', category:'Abaya',
  images:[''], sizes:[], colors:[''], material:'', stock:0,
  isAvailable:true, isFeatured:false, isNewArrival:false, tags:'',
  metaTitle:'', metaDescription:'', metaKeywords:''
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-3xl p-5 border shadow-soft" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{background:color+'18'}}>
          <span style={{color}}>{icon}</span>
        </div>
        <p className="font-dm text-[10px] tracking-[0.25em] uppercase font-medium" style={{color:'#8A6A58'}}>{label}</p>
      </div>
      <p className="font-playfair text-3xl font-semibold text-[#2D1810]" style={{fontFamily:'Playfair Display,serif'}}>{value}</p>
    </div>
  );
}

export default function AdminProductsPage() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [aiLoading, setAiLoading] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, authLoading, router]);

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getProducts({ page:p, limit:10 });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts(page);
      getAdminStats().then(r => setStats(r.data)).catch(() => {});
    }
  }, [user, page]);

  const openCreate = () => { setEditProduct(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit   = (p) => {
    setEditProduct(p);
    setForm({
      ...p,
      images:      p.images?.length  ? p.images  : [''],
      colors:      p.colors?.length  ? p.colors  : [''],
      tags:        p.tags?.join(', ')|| '',
      price:       String(p.price),
      originalPrice: String(p.originalPrice || ''),
      metaTitle:       p.metaTitle       || '',
      metaDescription: p.metaDescription || '',
      metaKeywords:    p.metaKeywords?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted 🌸'); fetchProducts(page); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSeed = async () => {
    if (!confirm('This will replace ALL products with 8 fresh sample items. Continue?')) return;
    setSeeding(true);
    try { const r = await seedProducts(); toast.success(r.data.message+' 🌸'); fetchProducts(1); setPage(1); }
    catch (err) { toast.error(err.response?.data?.message || 'Seed failed'); }
    finally { setSeeding(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock:         Number(form.stock),
        images:        form.images.filter(Boolean),
        colors:        form.colors.filter(Boolean),
        tags:          form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        metaKeywords:  form.metaKeywords ? form.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [],
      };
      if (editProduct) { await updateProduct(editProduct._id, payload); toast.success('Product updated 🌸'); }
      else             { await createProduct(payload);                  toast.success('Product created 🌸'); }
      setModalOpen(false);
      fetchProducts(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const toggleSize = (s) => setForm(f => ({
    ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
  }));

  // ── AI Admin Tools ────────────────────────────────────────────────────
  const runAiTool = async (tool) => {
    if (!form.name && !form.category) { toast.error('Add a product name and category first!'); return; }
    setAiLoading(tool);
    try {
      const res = await fetch('/api/ai/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, name: form.name, category: form.category, material: form.material, colors: form.colors, price: form.price, tags: form.tags }),
      });
      const data = await res.json();
      if (tool === 'description' && data.description) {
        setForm(f => ({ ...f, description: data.description }));
        toast.success('AI description generated! ✦');
      } else if (tool === 'seo' && data.tags) {
        setForm(f => ({ ...f, tags: data.tags }));
        toast.success('SEO tags generated! ✦');
      } else if (tool === 'caption') {
        await navigator.clipboard.writeText(data.caption || '');
        toast.success('Caption copied to clipboard! 📋');
      }
    } catch {
      toast.error('AI tool failed, try again!');
    }
    setAiLoading('');
  };

  if (authLoading || (!user && !authLoading)) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#FFF9F2'}}>
      <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
    </div>
  );
  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen pb-20" style={{background:'#FFF9F2'}}>
      <div className="max-w-6xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="font-dm text-[10px] tracking-[0.4em] uppercase mb-1" style={{color:'#B8862C'}}>Admin Panel 🌸</p>
            <h1 className="font-playfair text-4xl text-[#2D1810] italic" style={{fontFamily:'Playfair Display,serif'}}>Products</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSeed} disabled={seeding}
              className="btn-outline-rose px-4 py-2.5 text-xs rounded-full flex items-center gap-2">
              <FiDatabase size={12} />
              {seeding ? 'Seeding...' : 'Seed Data'}
            </button>
            <button onClick={openCreate}
              className="btn-rose px-5 py-2.5 text-xs rounded-full flex items-center gap-2 shadow-petal">
              <FiPlus size={14} /> Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard icon={<FiPackage size={15}/>}     label="Total Orders"   value={stats.totalOrders}                             color="#D4760A" />
            <StatCard icon={<FiTrendingUp size={15}/>}  label="Revenue"        value={`PKR ${(stats.totalRevenue||0).toLocaleString()}`} color="#D4A030" />
            <StatCard icon={<FiShoppingBag size={15}/>} label="Pending"        value={stats.pendingOrders}                            color="#8B5CF6" />
            <StatCard icon={<FiStar size={15}/>}        label="Delivered"      value={stats.deliveredOrders}                          color="#7AA364" />
          </div>
        )}

        {/* Table */}
        <div className="rounded-3xl border overflow-hidden shadow-soft" style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{background:'#FFF5EC', borderColor:'rgba(212,118,10,0.12)'}}>
                  {['Product','Category','Price','Stock','Badges','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-dm text-[10px] tracking-[0.25em] uppercase font-medium" style={{color:'#B8862C'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(5)].map((_,i) => (
                      <tr key={i} className="border-b" style={{borderColor:'#FFF3E6'}}>
                        {[...Array(6)].map((_,j) => (
                          <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded-full w-24" /></td>
                        ))}
                      </tr>
                    ))
                  : products.map(p => (
                      <tr key={p._id} className="border-b transition-colors hover:bg-[rgba(212,118,10,0.04)]/30" style={{borderColor:'#FFF3E6'}}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 relative rounded-xl overflow-hidden flex-shrink-0 border" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                              <Image src={p.images?.[0]||'https://via.placeholder.com/40'} alt={p.name}
                                fill className="object-cover" sizes="40px" />
                            </div>
                            <p className="font-playfair text-sm text-[#2D1810] italic line-clamp-1 max-w-[160px]"
                              style={{fontFamily:'Playfair Display,serif'}}>{p.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-dm text-[10px] tracking-widest uppercase font-medium" style={{color:'#8A6A58'}}>{p.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-playfair font-semibold" style={{color:'#D4760A', fontFamily:'Playfair Display,serif'}}>
                            PKR {p.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-dm text-sm font-semibold"
                            style={{color: p.stock > 5 ? '#7AA364' : p.stock > 0 ? '#D4A030' : '#E89830'}}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1 flex-wrap">
                            {p.isFeatured  && <span className="badge-gold">⭐</span>}
                            {p.isNewArrival && <span className="badge-sage">New</span>}
                            {!p.isAvailable && <span className="badge-rose">Hidden</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(p)}
                              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:shadow-petal"
                              style={{borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.5)'}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor='#F5C6D0';e.currentTarget.style.color='#D4760A';}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(212,118,10,0.12)';e.currentTarget.style.color='rgba(61,43,53,0.5)';}}>
                              <FiEdit2 size={12} />
                            </button>
                            <button onClick={() => handleDelete(p._id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
                              style={{borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.4)'}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor='#FFCCD6';e.currentTarget.style.color='#E89830';e.currentTarget.style.background='#FFF5EC';}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(212,118,10,0.12)';e.currentTarget.style.color='rgba(61,43,53,0.4)';e.currentTarget.style.background='transparent';}}>
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 px-5 py-4 border-t" style={{borderColor:'rgba(212,118,10,0.12)'}}>
              {[...Array(totalPages)].map((_,i) => (
                <button key={i} onClick={() => setPage(i+1)}
                  className="w-9 h-9 text-xs font-dm font-medium rounded-full border transition-all"
                  style={page===i+1
                    ? {background:'linear-gradient(135deg,#D4760A,#E89830)', color:'white', border:'none', boxShadow:'0 4px 12px rgba(201,79,109,0.25)'}
                    : {borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.5)'}}>
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT MODAL ─────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-plum/20 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="relative rounded-4xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lifted border"
            style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b sticky top-0 z-10"
              style={{background:'white', borderColor:'rgba(212,118,10,0.12)'}}>
              <div>
                <h2 className="font-playfair text-2xl text-[#2D1810] italic" style={{fontFamily:'Playfair Display,serif'}}>
                  {editProduct ? 'Edit Product ✏️' : 'Add New Product 🌸'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-[rgba(212,118,10,0.04)]"
                style={{borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.5)'}}>
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-7 py-6 space-y-5">

              {/* Name + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                    className="input-soft w-full px-4 py-3 text-sm" required />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}
                    className="input-soft w-full px-4 py-3 text-sm">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                  rows={3} className="input-soft w-full px-4 py-3 text-sm resize-none" required />

                {/* ✦ AI Power Tools */}
                <div className="mt-3 rounded-2xl overflow-hidden border" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                  <div className="flex items-center gap-2 px-4 py-2.5" style={{background:'linear-gradient(135deg,#FFF3E6,#FFF5EC)'}}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                      style={{background:'linear-gradient(135deg,#D4760A,#C68B2C)'}}>✦</div>
                    <p className="font-dm text-[10px] tracking-[0.2em] uppercase font-bold text-[#2D1810]/60">AI Admin Tools</p>
                  </div>
                  <div className="px-4 py-3 flex flex-wrap gap-2" style={{background:'#FFFBF9'}}>
                    {[
                      { tool:'description', label:'✍️ Write Description', desc:'Luxury copy from name + fabric' },
                      { tool:'seo',         label:'🔍 Generate SEO Tags', desc:'Smart tags for search visibility' },
                      { tool:'caption',     label:'📱 Instagram Caption', desc:'Copy-ready social caption' },
                    ].map(({ tool, label, desc }) => (
                      <button key={tool} type="button"
                        onClick={() => runAiTool(tool)}
                        disabled={!!aiLoading}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-dm font-semibold border transition-all hover:shadow-sm disabled:opacity-50"
                        style={{borderColor:'rgba(212,118,10,0.18)', color:'#D4760A', background:'white'}}>
                        {aiLoading === tool
                          ? <div className="w-3 h-3 border-2 border-[rgba(212,118,10,0.18)] border-t-[#D4760A] rounded-full animate-spin" />
                          : null}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Price (PKR) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))}
                    className="input-soft w-full px-4 py-3 text-sm" required min="0" />
                </div>
                <div>
                  <label className="form-label">Original Price</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f=>({...f,originalPrice:e.target.value}))}
                    className="input-soft w-full px-4 py-3 text-sm" min="0" />
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))}
                    className="input-soft w-full px-4 py-3 text-sm" min="0" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="form-label">Image URLs</label>
                {form.images.map((img,i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={img}
                      onChange={e => { const imgs=[...form.images]; imgs[i]=e.target.value; setForm(f=>({...f,images:imgs})); }}
                      placeholder="https://images.unsplash.com/..."
                      className="input-soft flex-1 px-4 py-2.5 text-sm" />
                    {i > 0 && (
                      <button type="button"
                        onClick={() => setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-rose-50"
                        style={{borderColor:'rgba(212,118,10,0.12)', color:'#E89830'}}>
                        <FiX size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button"
                  onClick={() => setForm(f=>({...f,images:[...f.images,'']}))}
                  className="font-dm text-xs font-medium transition-colors hover:text-rose-600 flex items-center gap-1"
                  style={{color:'#E89830'}}>
                  <FiPlus size={12} /> Add Image URL
                </button>
              </div>

              {/* Sizes */}
              <div>
                <label className="form-label">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className="px-3 py-1.5 text-xs font-dm font-medium border rounded-full transition-all"
                      style={form.sizes.includes(s)
                        ? {background:'#FFF5EC', borderColor:'#E89830', color:'#D4760A', boxShadow:'0 2px 8px rgba(201,79,109,0.15)'}
                        : {borderColor:'rgba(212,118,10,0.12)', color:'rgba(61,43,53,0.45)'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors + Material */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Colors (comma separated)</label>
                  <input value={form.colors.join(', ')}
                    onChange={e => setForm(f=>({...f,colors:e.target.value.split(',').map(c=>c.trim())}))}
                    placeholder="Black, Navy, Emerald"
                    className="input-soft w-full px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="form-label">Material</label>
                  <input value={form.material} onChange={e => setForm(f=>({...f,material:e.target.value}))}
                    placeholder="Korean Nida"
                    className="input-soft w-full px-4 py-3 text-sm" />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(f=>({...f,tags:e.target.value}))}
                  placeholder="luxury, embroidered, bestseller"
                  className="input-soft w-full px-4 py-3 text-sm" />
              </div>

              {/* ── SEO & Meta ─────────────────────────────────────── */}
              <div className="rounded-2xl border overflow-hidden" style={{borderColor:'rgba(212,118,10,0.12)'}}>
                <div className="px-4 py-2.5 flex items-center gap-2" style={{background:'linear-gradient(135deg,#FFF3E6,#FFF5EC)'}}>
                  <span className="text-sm">🔍</span>
                  <p className="font-dm text-[10px] tracking-[0.2em] uppercase font-bold" style={{color:'rgba(61,43,53,0.55)'}}>SEO &amp; Meta Details</p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto" style={{background:'#FFF3E6',color:'#D4760A',border:'1px solid rgba(212,118,10,0.18)'}}>Optional</span>
                </div>
                <div className="px-5 py-4 space-y-4" style={{background:'#FFFBF9'}}>
                  <div>
                    <label className="form-label">Meta Title <span className="text-[#A8907E] font-normal">(max 70 chars)</span></label>
                    <input value={form.metaTitle} onChange={e => setForm(f=>({...f,metaTitle:e.target.value}))}
                      placeholder="Luxury Black Abaya | Gumnam Momina"
                      maxLength={70}
                      className="input-soft w-full px-4 py-3 text-sm" />
                    <p className="text-[10px] mt-1 text-right" style={{color: form.metaTitle.length > 60 ? '#E89830' : '#C4A0A8'}}>{form.metaTitle.length}/70</p>
                  </div>
                  <div>
                    <label className="form-label">Meta Description <span className="text-[#A8907E] font-normal">(max 160 chars)</span></label>
                    <textarea value={form.metaDescription} onChange={e => setForm(f=>({...f,metaDescription:e.target.value}))}
                      placeholder="Shop our premium Korean Nida abaya, handcrafted for the modern Muslim woman..."
                      maxLength={160} rows={2}
                      className="input-soft w-full px-4 py-3 text-sm resize-none" />
                    <p className="text-[10px] mt-1 text-right" style={{color: form.metaDescription.length > 140 ? '#E89830' : '#C4A0A8'}}>{form.metaDescription.length}/160</p>
                  </div>
                  <div>
                    <label className="form-label">Meta Keywords <span className="text-[#A8907E] font-normal">(comma separated)</span></label>
                    <input value={form.metaKeywords} onChange={e => setForm(f=>({...f,metaKeywords:e.target.value}))}
                      placeholder="abaya pakistan, modest fashion, luxury abaya"
                      className="input-soft w-full px-4 py-3 text-sm" />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-5">
                {[
                  { key:'isFeatured',  label:'⭐ Featured'    },
                  { key:'isNewArrival',label:'✨ New Arrival'  },
                  { key:'isAvailable', label:'👁 Visible'      },
                ].map(t => (
                  <label key={t.key} className="flex items-center gap-2.5 cursor-pointer">
                    <button type="button"
                      onClick={() => setForm(f=>({...f,[t.key]:!f[t.key]}))}
                      className="w-11 h-6 rounded-full relative transition-all flex-shrink-0"
                      style={{background: form[t.key] ? 'linear-gradient(135deg,#D4760A,#E89830)' : 'rgba(212,118,10,0.12)'}}>
                      <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                        style={{left: form[t.key] ? '22px' : '2px'}} />
                    </button>
                    <span className="font-dm text-xs font-medium" style={{color:'rgba(61,43,53,0.6)'}}>{t.label}</span>
                  </label>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="btn-outline-rose flex-1 py-3.5 rounded-2xl text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="btn-rose flex-1 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><FiSave size={12}/> {editProduct ? 'Update' : 'Create'} 🌸</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .form-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          font-weight: 600;
          color: #8A6A58;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
      `}</style>
    </div>
  );
}
