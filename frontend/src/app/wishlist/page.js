'use client';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, toggle } = useWishlist();
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF9F2' }}>
      <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
    </div>
  );

  const handleMoveToCart = (product) => {
    addItem(product._id, 1, product.sizes?.[0], product.colors?.[0]);
    toggle(product._id);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FFF9F2' }}>
      {/* Header */}
      <div className="py-14 text-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#FFF5EC,#FFF9F2,#FFF3E6)' }}>
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative">
          <p className="font-dm text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#B8862C' }}>My Account</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#2D1810] italic" style={{ fontFamily: 'Playfair Display,serif' }}>
            My Wishlist 💕
          </h1>
          <p className="font-dm text-xs mt-3" style={{ color: '#8A6A58' }}>{wishlist.length} saved piece{wishlist.length !== 1 ? 's' : ''}</p>
          <div className="lace-divider max-w-48 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        {wishlist.length === 0 ? (
          <div className="text-center py-28 rounded-3xl border" style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#FFF5EC' }}>
              <FiHeart size={32} style={{ color: '#F5C6D0' }} />
            </div>
            <p className="font-playfair text-3xl text-[#2D1810]/40 italic mb-3" style={{ fontFamily: 'Playfair Display,serif' }}>
              Your wishlist is empty
            </p>
            <p className="font-dm text-xs tracking-wider mb-8 uppercase" style={{ color: '#B8862C' }}>
              Save pieces you love ✨
            </p>
            <Link href="/products" className="btn-rose px-8 py-3 rounded-full text-xs">
              Browse Collection 🌸
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((product) => {
              if (!product?._id) return null;
              const discount = product.originalPrice
                ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
              return (
                <div key={product._id} className="group rounded-2xl overflow-hidden border shadow-soft"
                  style={{ background: 'white', borderColor: 'rgba(212,118,10,0.12)' }}>
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-[rgba(212,118,10,0.04)] overflow-hidden">
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
                        alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
                    </Link>
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 badge-rose">-{discount}%</span>
                    )}
                    {/* Remove button */}
                    <button onClick={() => toggle(product._id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-rose hover:bg-white transition-all shadow-sm">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="section-label text-[9px] mb-1">{product.category}</p>
                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-playfair text-[#2D1810] text-sm leading-snug line-clamp-1 font-semibold hover:text-[#6B4A3A] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5 mb-3">
                      <span className="text-[#6B4A3A] font-dm font-bold text-sm">
                        PKR {product.price?.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[#A8907E] text-xs line-through font-dm">
                          PKR {product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}
                      className="btn-rose w-full py-2 text-[10px] rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <FiShoppingBag size={11} />
                      {product.stock === 0 ? 'Out of Stock' : 'Move to Bag'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
