'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { FiArrowRight, FiStar, FiHeart, FiPackage, FiShield, FiTruck } from 'react-icons/fi';

const CATEGORIES = [
  { name:'Abayas',         key:'Abaya',        emoji:'🖤', color:'#D4760A', glow:'rgba(212,118,10,0.10)' },
  { name:'Hijabs',         key:'Hijab',         emoji:'✨', color:'#7A2E3A', glow:'rgba(122,46,58,0.08)' },
  { name:'Prayer Chadars', key:'Namaz Chadar',  emoji:'🌙', color:'#1A7A6D', glow:'rgba(26,122,109,0.08)' },
  { name:'Accessories',    key:'Accessories',   emoji:'📿', color:'#C68B2C', glow:'rgba(198,139,44,0.08)' },
  { name:'Gift Sets',      key:'Gift Sets',     emoji:'🎁', color:'#D4760A', glow:'rgba(212,118,10,0.08)' },
  { name:'Kids',           key:'Kids',          emoji:'💕', color:'#7A2E3A', glow:'rgba(122,46,58,0.08)' },
];

const TESTIMONIALS = [
  { name:'Fatima R.',  city:'Lahore',     rating:5, text:'The quality is unreal! I have gotten so many compliments on my abaya 🌸', color:'#D4760A', initial:'F' },
  { name:'Ayesha K.',  city:'Karachi',    rating:5, text:'The gift packaging was so beautiful, she cried happy tears. 10/10!', color:'#7A2E3A', initial:'A' },
  { name:'Zainab M.',  city:'Islamabad',  rating:5, text:'Third purchase and honestly just keeps getting better mashallah!', color:'#1A7A6D', initial:'Z' },
];

const PROMISES = [
  { icon:<FiPackage size={22}/>, emoji:'🧵', title:'Premium Fabrics',  desc:'Korean nida, chiffon, velvet — only the finest.',  color:'#D4760A' },
  { icon:<FiHeart size={22}/>,   emoji:'💝', title:'Made with Love',   desc:'Every stitch crafted with care and intention.',     color:'#7A2E3A' },
  { icon:<FiShield size={22}/>,  emoji:'🌸', title:'Modest & Elegant', desc:'Faith meets fashion in every design.',              color:'#1A7A6D' },
  { icon:<FiTruck size={22}/>,   emoji:'🚚', title:'Swift Delivery',   desc:'Across Pakistan in 3–5 days. Free on PKR 5,000+.', color:'#C68B2C' },
];

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}</span>;
}

export default function HomePage() {
  const [featured, setFeatured]     = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [visible, setVisible]       = useState({});

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, limit: 4 }),
      getProducts({ newArrival: true, limit: 4 }),
    ]).then(([f, n]) => {
      setFeatured(f.data.products);
      setNewArrivals(n.data.products);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true }));
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  const Section = ({ id, children, className = '' }) => (
    <div id={id} data-animate
      className={`transition-all duration-700 ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero">
        {/* Animated background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-8 w-72 h-72 rounded-full float-anim"
            style={{ background: 'radial-gradient(circle, rgba(212,118,10,0.18) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 right-8 w-56 h-56 rounded-full float-anim-slow"
            style={{ background: 'radial-gradient(circle, rgba(122,46,58,0.12) 0%, transparent 70%)', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full float-anim-mid"
            style={{ background: 'radial-gradient(circle, rgba(26,122,109,0.10) 0%, transparent 70%)', animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full float-anim"
            style={{ background: 'radial-gradient(circle, rgba(198,139,44,0.12) 0%, transparent 70%)', animationDelay: '3s' }} />
        </div>

        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-60" />

        {/* Sparkle elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['top-[15%] left-[10%]', 'top-[25%] right-[8%]', 'top-[60%] left-[5%]', 'bottom-[20%] right-[12%]', 'top-[45%] right-[20%]'].map((pos, i) => (
            <span key={i} className={`absolute text-2xl ${pos}`}
              style={{ animation: `sparkle ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, opacity: 0.45, color: '#D4760A' }}>
              ✦
            </span>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Bismillah */}
          <p className="mb-6 fade-in-up" style={{ fontFamily: 'Amiri,serif', fontSize: '22px', color: '#B8862C', animationDelay: '0s' }}>
            ﷽
          </p>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6 fade-in-up delay-1">
            <div className="h-px w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,118,10,0.50))' }} />
            <span className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium" style={{ color: '#D4760A' }}>
              The Modest Luxury Collection
            </span>
            <div className="h-px w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(212,118,10,0.50), transparent)' }} />
          </div>

          {/* Main title */}
          <h1 className="leading-none mb-3 fade-in-up delay-2 text-gold-shimmer"
            style={{ fontFamily: 'Great Vibes, cursive', fontSize: 'clamp(64px,14vw,148px)' }}>
            Gumnam Momina
          </h1>

          {/* Subtitle */}
          <p className="font-playfair italic mb-8 fade-in-up delay-3"
            style={{ fontSize: 'clamp(16px,3vw,24px)', fontFamily: 'Playfair Display, serif', color: '#6B4A3A' }}>
            Where Modesty Meets Elegance ✨
          </p>

          {/* Candy divider */}
          <div className="flex justify-center mb-8 fade-in-up delay-3">
            <div className="candy-divider w-48" />
          </div>

          <p className="font-dm max-w-md mx-auto leading-relaxed mb-10 fade-in-up delay-4"
            style={{ fontSize: '15px', color: '#6B4A3A' }}>
            Handcrafted abayas, prayer chadars &amp; Islamic accessories for the beautiful modern Muslim woman 🌸
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in-up delay-4">
            <Link href="/products" className="btn-primary px-10 py-4 rounded-full text-xs inline-block">
              Explore Collection ✦
            </Link>
            <Link href="/products?featured=true" className="btn-secondary px-10 py-4 rounded-full text-xs inline-block">
              Featured Pieces ☽
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 fade-in-up delay-4">
            {[
              { emoji: '💝', text: '500+ Happy Sisters' },
              { emoji: '🌸', text: 'Handcrafted Quality' },
              { emoji: '🚚', text: 'Pakistan Wide Delivery' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(212,118,10,0.15)', backdropFilter: 'blur(8px)' }}>
                <span className="text-base">{t.emoji}</span>
                <span className="font-dm text-[11px] font-medium" style={{ color: '#4A2E20' }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="font-dm text-[9px] tracking-[0.4em] uppercase" style={{ color: '#D4760A' }}>Scroll</span>
          <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: '2px solid rgba(212,118,10,0.35)' }}>
            <div className="w-1.5 h-2 rounded-full" style={{ background: '#D4760A', animation: 'float 1.4s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(255,236,214,0.7), rgba(255,245,239,0.7), rgba(240,250,247,0.5))', borderTop: '1px solid rgba(212,118,10,0.08)', borderBottom: '1px solid rgba(212,118,10,0.08)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: 500, suffix: '+', label: 'Happy Sisters' },
            { num: 8,   suffix: '+', label: 'Collections' },
            { num: 50,  suffix: '+', label: 'Products' },
            { num: 100, suffix: '%', label: 'Pure Quality' },
          ].map((s, i) => (
            <div key={i} className="hover-lift">
              <p className="font-playfair font-bold" style={{ fontSize: '36px', fontFamily: 'Playfair Display,serif', color: '#D4760A' }}>
                <AnimatedCounter end={s.num} />{s.suffix}
              </p>
              <p className="font-dm text-[11px] uppercase tracking-wider mt-1" style={{ color: '#8A6A58' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24" id="cats" data-animate>
        <Section id="cats-head">
          <div className="text-center mb-14">
            <p className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium mb-3" style={{ color: '#D4760A' }}>Browse By</p>
            <h2 className="font-playfair text-4xl md:text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
              Our Collections
            </h2>
            <div className="flex justify-center mt-4">
              <div className="dot-divider w-48"><span>☽</span></div>
            </div>
          </div>
        </Section>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.key} href={`/products?category=${encodeURIComponent(cat.key)}`}>
              <div className="group relative rounded-3xl p-6 md:p-8 text-center cursor-pointer transition-all duration-400 hover:-translate-y-2 overflow-hidden fade-in-up"
                style={{
                  background: `linear-gradient(135deg, ${cat.glow}, rgba(255,255,255,0.6))`,
                  border: `1px solid rgba(212,118,10,0.12)`,
                  animationDelay: `${i * 0.07}s`,
                  backdropFilter: 'blur(8px)',
                }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(circle at center, ${cat.glow}, transparent 70%)` }} />
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />

                <div className="emoji-hover text-4xl mb-4 inline-block relative z-10">{cat.emoji}</div>
                <h3 className="font-playfair text-xl md:text-2xl italic transition-colors relative z-10"
                  style={{ fontFamily: 'Playfair Display,serif', color: '#3A1F14' }}>
                  {cat.name}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="font-dm text-[10px] uppercase tracking-widest font-semibold" style={{ color: cat.color }}>{`Shop Now`}</span>
                  <FiArrowRight size={10} style={{ color: cat.color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────── */}
      <section className="py-24 section-rose">
        <div className="max-w-7xl mx-auto px-6">
          <Section id="feat-head">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium mb-2" style={{ color: '#D4760A' }}>Curated For You ✨</p>
                <h2 className="font-playfair text-4xl md:text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
                  Featured Pieces
                </h2>
              </div>
              <Link href="/products?featured=true"
                className="group flex items-center gap-2 font-dm text-sm font-medium transition-colors"
                style={{ color: '#D4760A' }}>
                View All <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Section>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featured.map((p, i) => (
                <div key={p._id} className="fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl" style={{ border: '2px dashed rgba(212,118,10,0.20)' }}>
              <p className="text-4xl mb-3">🌸</p>
              <p className="font-playfair text-xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#6B4A3A' }}>
                Products loading soon...
              </p>
              <p className="font-dm text-sm mt-2" style={{ color: '#8A6A58' }}>
                Login as admin → Admin Panel → Seed Products
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── GIFT BANNER ──────────────────────────── */}
      <section className="mx-4 md:mx-auto max-w-7xl md:px-6 my-6">
        <Section id="gift-banner">
          <div className="rounded-4xl overflow-hidden relative py-16 px-8 md:px-16"
            style={{ background: 'linear-gradient(135deg, rgba(212,118,10,0.08), rgba(198,139,44,0.06), rgba(122,46,58,0.04))', border: '1px solid rgba(212,118,10,0.15)' }}>
            <div className="absolute inset-0 stripe-bg" />

            {['top-4 left-8','top-4 right-8','bottom-4 left-16','bottom-4 right-16'].map((pos, i) => (
              <span key={i} className="absolute text-2xl float-anim"
                style={{ top: pos.includes('top') ? '16px' : 'auto', bottom: pos.includes('bottom') ? '16px' : 'auto', left: pos.includes('left') ? (pos.split('left-')[1] === '8' ? '32px' : '64px') : 'auto', right: pos.includes('right') ? (pos.split('right-')[1] === '8' ? '32px' : '64px') : 'auto', animationDelay: `${i * 0.6}s`, opacity: 0.25 }}>
                {['🎁','✨','💝','🌸'][i]}
              </span>
            ))}

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="mb-2" style={{ fontFamily: 'Amiri,serif', fontSize: '24px', color: '#B8862C' }}>
                  هَدِيَّةٌ مُبَارَكَة
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl italic mb-3" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
                  Curated Gift Sets
                </h2>
                <p className="font-dm text-sm max-w-sm" style={{ color: '#6B4A3A' }}>
                  Perfect for Eid, Ramadan &amp; all blessed occasions. Beautifully packaged luxury gift boxes 💝
                </p>
                <div className="flex gap-2 mt-4">
                  {['🕌 Eid Special', '🌙 Ramadan', '💌 Birthdays'].map(tag => (
                    <span key={tag} className="pill-tag text-[10px] py-1 px-3">{tag}</span>
                  ))}
                </div>
              </div>
              <Link href="/products?category=Gift+Sets"
                className="btn-primary px-10 py-4 rounded-full text-xs flex-shrink-0 inline-block">
                Shop Gift Sets 🎁
              </Link>
            </div>
          </div>
        </Section>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Section id="new-head">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium mb-2" style={{ color: '#1A7A6D' }}>Just Dropped 🌿</p>
              <h2 className="font-playfair text-4xl md:text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
                New Arrivals
              </h2>
            </div>
            <Link href="/products?newArrival=true"
              className="group flex items-center gap-2 font-dm text-sm font-medium transition-colors"
              style={{ color: '#1A7A6D' }}>
              View All <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Section>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map((p, i) => (
              <div key={p._id} className="fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl" style={{ border: '2px dashed rgba(26,122,109,0.20)' }}>
            <p className="text-4xl mb-3">🌿</p>
            <p className="font-playfair text-xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#6B4A3A' }}>
              New arrivals coming soon...
            </p>
          </div>
        )}
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-24 section-lav">
        <div className="max-w-7xl mx-auto px-6">
          <Section id="reviews-head">
            <div className="text-center mb-14">
              <p className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium mb-3" style={{ color: '#D4760A' }}>Loved By 💕</p>
              <h2 className="font-playfair text-4xl md:text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
                Our Sisters Say
              </h2>
              <div className="flex justify-center mt-4"><div className="dot-divider w-48"><span>☽</span></div></div>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-cute p-7 fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar key={j} size={14} style={{ color: '#D4760A', fill: '#D4760A' }} />
                  ))}
                </div>
                <p className="font-playfair italic text-lg leading-relaxed mb-5"
                  style={{ color: '#4A2E20', fontFamily: 'Playfair Display,serif' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-dm font-bold"
                    style={{ background: `rgba(${t.color === '#D4760A' ? '212,118,10' : t.color === '#7A2E3A' ? '122,46,58' : '26,122,109'},0.12)`, color: t.color, border: `1px solid ${t.color}33` }}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-dm font-semibold text-sm" style={{ color: '#2D1810' }}>{t.name}</p>
                    <p className="font-dm text-[10px] uppercase tracking-wider" style={{ color: '#8A6A58' }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMISES ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Section id="promise-head">
          <div className="text-center mb-14">
            <p className="font-dm text-[11px] tracking-[0.4em] uppercase font-medium mb-3" style={{ color: '#D4760A' }}>Why Choose Us</p>
            <h2 className="font-playfair text-4xl md:text-5xl italic" style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>
              The Gumnam Promise
            </h2>
          </div>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {PROMISES.map((p, i) => (
            <div key={i} className="card-cute p-7 text-center fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 emoji-hover"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                <span style={{ color: p.color }}>{p.icon}</span>
              </div>
              <h3 className="font-playfair text-lg italic mb-2"
                style={{ fontFamily: 'Playfair Display,serif', color: '#2D1810' }}>{p.title}</h3>
              <p className="font-dm text-xs leading-relaxed" style={{ color: '#6B4A3A' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOIN CTA ──────────────────────────────── */}
      <section className="mx-4 md:mx-auto max-w-7xl md:px-6 mb-16">
        <Section id="cta">
          <div className="rounded-4xl p-12 md:p-16 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,118,10,0.08), rgba(198,139,44,0.06), rgba(122,46,58,0.04))', border: '1px solid rgba(212,118,10,0.14)' }}>
            <div className="absolute inset-0 dot-pattern-lav opacity-40" />
            {['top-4 left-8', 'top-4 right-8', 'bottom-4 left-8', 'bottom-4 right-8'].map((cls, i) => (
              <span key={i} className="absolute text-3xl float-anim opacity-15"
                style={{ inset: cls, animationDelay: `${i * 0.8}s`, color: 'rgba(212,118,10,0.40)' }}>
                {['☽', '✦', '☽', '✦'][i]}
              </span>
            ))}
            <div className="relative">
              <p className="text-5xl md:text-6xl mb-3 text-gold-shimmer"
                style={{ fontFamily: 'Great Vibes, cursive' }}>
                Join the Family
              </p>
              <p className="font-dm text-sm mb-8 max-w-md mx-auto" style={{ color: '#6B4A3A' }}>
                Be the first to know about new arrivals, exclusive collections &amp; special Eid offers ✦
              </p>
              <Link href="/register"
                className="btn-primary px-10 py-4 rounded-full text-xs inline-block">
                Create Your Account ✦
              </Link>
            </div>
          </div>
        </Section>
      </section>

    </div>
  );
}
