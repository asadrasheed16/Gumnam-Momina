'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import AISearch from '@/components/AISearch';
import AIBundleBuilder from '@/components/AIBundleBuilder';
import { FiFilter, FiX, FiChevronDown, FiZap, FiPackage } from 'react-icons/fi';

const CATEGORIES = ['Abaya','Hijab','Namaz Chadar','Accessories','Gift Sets','Kids'];
const SORT_OPTIONS = [
  { value:'newest',    label:'Newest First' },
  { value:'price_asc', label:'Price: Low → High' },
  { value:'price_desc',label:'Price: High → Low' },
  { value:'popular',   label:'Most Popular' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);

  const category   = searchParams.get('category')   || '';
  const featured   = searchParams.get('featured')   || '';
  const newArrival = searchParams.get('newArrival') || '';
  const sort       = searchParams.get('sort')       || 'newest';
  const page       = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    getProducts({ category, featured, newArrival, sort, page, limit:12 })
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [category, featured, newArrival, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };
  const clearFilters = () => router.push('/products');
  const hasFilters = category || featured || newArrival;
  const pageTitle = category ? `${category}s` : featured ? 'Featured Collection' : newArrival ? 'New Arrivals' : 'All Products';

  return (
    <div className="min-h-screen pt-6 pb-20">
      {/* Page header */}
      <div className="py-12 px-6 text-center dot-pattern"
        style={{ background: 'linear-gradient(180deg, rgba(212,118,10,0.06), rgba(255,249,242,0.5))', borderBottom: '1px solid rgba(212,118,10,0.08)' }}>
        <p className="section-label mb-3">Shop</p>
        <h1 className="font-playfair text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>{pageTitle}</h1>
        <div className="text-xl mt-3" style={{ color: 'rgba(212,118,10,0.30)' }}>✦ ☽ ✦</div>
        <p className="font-dm text-xs mt-2" style={{ color: '#6B4A3A' }}>{total} pieces available</p>

        <div className="max-w-2xl mx-auto mt-6">
          <AISearch />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 btn-outline-rose px-4 py-2 text-xs rounded-full md:hidden">
            <FiFilter size={12}/> Filters
          </button>

          <button
            onClick={() => setBundleOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-dm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #D4760A, #1A7A6D)', color: 'white', boxShadow: '0 4px 16px rgba(212,118,10,0.25)' }}
          >
            <FiPackage size={12} /> ✦ Build My Outfit
          </button>

          <div className="relative ml-auto">
            <select value={sort} onChange={e => updateParam('sort', e.target.value)}
              className="input-soft px-4 py-2 text-xs font-dm font-semibold rounded-full pr-8 cursor-pointer appearance-none">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8862C' }}/>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="sticky top-28 space-y-7">
              <div>
                <h3 className="font-dm text-[10px] tracking-[0.3em] uppercase font-bold mb-4" style={{ color: '#D4760A' }}>Category ✦</h3>
                <div className="space-y-1.5">
                  <button onClick={() => updateParam('category','')}
                    className="block w-full text-left text-xs font-dm font-semibold py-1.5 px-2 rounded-lg transition-all"
                    style={{ color: !category ? '#D4760A' : '#6B4A3A', background: !category ? 'rgba(212,118,10,0.08)' : 'transparent' }}>
                    All Categories
                  </button>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => updateParam('category', cat)}
                      className="block w-full text-left text-xs font-dm font-semibold py-1.5 px-2 rounded-lg transition-all"
                      style={{ color: category === cat ? '#D4760A' : '#6B4A3A', background: category === cat ? 'rgba(212,118,10,0.08)' : 'transparent' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-dm text-[10px] tracking-[0.3em] uppercase font-bold mb-4" style={{ color: '#D4760A' }}>Filter ✦</h3>
                {[{key:'featured',label:'Featured',val:featured},{key:'newArrival',label:'New Arrivals',val:newArrival}].map(f => (
                  <button key={f.key} onClick={() => updateParam(f.key, f.val ? '' : 'true')}
                    className="flex items-center gap-2 w-full text-xs font-dm font-semibold py-1.5 px-2 rounded-lg transition-all mb-1.5"
                    style={{ color: f.val ? '#D4760A' : '#6B4A3A', background: f.val ? 'rgba(212,118,10,0.08)' : 'transparent' }}>
                    <div className="w-3.5 h-3.5 border-2 rounded transition-all flex items-center justify-center"
                      style={{ borderColor: f.val ? '#D4760A' : 'rgba(212,118,10,0.22)', background: f.val ? '#D4760A' : 'transparent' }}>
                      {f.val && <span className="text-[8px]" style={{ color: 'white' }}>✓</span>}
                    </div>
                    {f.label}
                  </button>
                ))}
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-[10px] font-dm font-bold tracking-wider uppercase"
                  style={{ color: '#7A2E3A' }}>
                  <FiX size={10}/> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Mobile filter */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(45,24,16,0.30)' }} onClick={() => setFilterOpen(false)}/>
              <div className="absolute bottom-0 left-0 right-0 p-6 rounded-t-3xl"
                style={{ background: 'rgba(255,249,242,0.99)', border: '1px solid rgba(212,118,10,0.12)', boxShadow: '0 -12px 40px rgba(212,118,10,0.10)' }}>
                <div className="flex justify-between mb-5">
                  <h3 className="font-playfair text-2xl italic" style={{ color: '#2D1810' }}>Filters ✦</h3>
                  <button onClick={() => setFilterOpen(false)} style={{ color: '#6B4A3A' }}><FiX/></button>
                </div>
                <p className="font-dm text-[10px] tracking-widest uppercase font-bold mb-3" style={{ color: '#D4760A' }}>Category</p>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { updateParam('category', cat); setFilterOpen(false); }}
                    className="block w-full text-left text-sm font-dm font-semibold py-2.5 transition-colors"
                    style={{ color: category === cat ? '#D4760A' : '#6B4A3A', borderBottom: '1px solid rgba(212,118,10,0.06)' }}>
                    {cat}
                  </button>
                ))}
                {hasFilters && <button onClick={() => { clearFilters(); setFilterOpen(false); }} className="text-xs font-dm font-bold mt-4" style={{ color: '#7A2E3A' }}>Clear All</button>}
                <button
                  onClick={() => { setFilterOpen(false); setBundleOpen(true); }}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-dm font-bold"
                  style={{ background: 'linear-gradient(135deg, #D4760A, #1A7A6D)', color: 'white' }}
                >
                  <FiPackage size={12} /> ✦ Build My Outfit Bundle
                </button>
              </div>
            </div>
          )}

          {bundleOpen && <AIBundleBuilder onClose={() => setBundleOpen(false)} />}

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_,i) => <div key={i} className="aspect-[3/4] skeleton rounded-2xl"/>)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">☽</div>
                <p className="font-playfair text-3xl italic mb-4" style={{ color: '#6B4A3A' }}>No products found</p>
                <button onClick={clearFilters} className="btn-outline-rose px-6 py-2.5 text-xs rounded-full font-bold">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(p => <ProductCard key={p._id} product={p}/>)}
                </div>
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(pages)].map((_,i) => (
                      <button key={i} onClick={() => updateParam('page', String(i+1))}
                        className="w-9 h-9 text-xs font-dm font-bold rounded-full transition-all"
                        style={{
                          background: page===i+1 ? 'linear-gradient(135deg, #D4760A, #E89830)' : 'transparent',
                          color: page===i+1 ? 'white' : '#6B4A3A',
                          border: page===i+1 ? 'none' : '1px solid rgba(212,118,10,0.18)',
                          boxShadow: page===i+1 ? '0 4px 16px rgba(212,118,10,0.28)' : 'none',
                        }}>
                        {i+1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-5xl float-anim" style={{ color: '#D4760A' }}>✦</div></div>}>
      <ProductsContent/>
    </Suspense>
  );
}
