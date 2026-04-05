'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, addReview } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiShoppingBag, FiStar, FiArrowLeft, FiShare2, FiHeart, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AIReviewHighlights from '@/components/AIReviewHighlights';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggle, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  // Review form
  const [reviewRating,   setReviewRating]   = useState(5);
  const [reviewComment,  setReviewComment]  = useState('');
  const [submitting,     setSubmitting]     = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    getProduct(id).then(res => {
      setProduct(res.data);
      setSelectedSize(res.data.sizes?.[0] || '');
      setSelectedColor(res.data.colors?.[0] || '');
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { router.push('/login'); return; }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    setAdding(true);
    await addItem(product._id, quantity, selectedSize, selectedColor);
    setAdding(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      await addReview(product._id, { rating: reviewRating, comment: reviewComment.trim() });
      toast.success('Review submitted! JazakAllah 🌸');
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
      // Refresh product to show new review
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center petal-bg">
      <div className="text-6xl float-anim">✿</div>
    </div>
  );
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center petal-bg text-center">
      <div>
        <div className="text-6xl mb-4">🌸</div>
        <p className="font-playfair text-3xl text-[#A8907E] italic mb-4">Product not found</p>
        <Link href="/products" className="btn-outline-rose px-6 py-2.5 text-xs rounded-full font-bold">Back to Collection</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-[#A8907E] hover:text-[#D4760A] text-xs font-dm font-semibold transition-colors">
            <FiArrowLeft size={12}/> Back
          </button>
          <span className="text-mauve/40 text-xs">/</span>
          <Link href="/products" className="text-[#A8907E] hover:text-[#D4760A] text-xs font-dm font-semibold transition-colors">Collection</Link>
          <span className="text-mauve/40 text-xs">/</span>
          <span className="text-rose/60 text-xs font-dm">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden img-zoom bg-[rgba(212,118,10,0.04)] shadow-cream-lg">
              <Image src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x750'} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority/>
              {product.isNewArrival && <div className="absolute top-4 left-4"><span className="badge-sage">NEW ✦</span></div>}
              {discount > 0 && <div className="absolute top-4 right-4"><span className="badge-rose">-{discount}%</span></div>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img,i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage===i ? 'border-[#D4760A] shadow-petal' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="80px"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="section-label mb-2">{product.category}</p>
            <h1 className="font-playfair text-4xl md:text-5xl text-[#2D1810] leading-tight mb-4 font-semibold italic">{product.name}</h1>

            {product.ratings?.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i) => (
                    <FiStar key={i} size={13} style={{fill: i<Math.round(product.ratings.average) ? '#D4878C':'transparent', color: i<Math.round(product.ratings.average) ? '#D4878C':'#E8C8CC'}}/>
                  ))}
                </div>
                <span className="text-mauve/60 text-xs font-dm">{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="font-playfair text-4xl text-[#D4760A] font-bold">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-mauve/50 text-xl line-through font-playfair mb-1">PKR {product.originalPrice.toLocaleString()}</span>}
              {discount > 0 && <span className="badge-rose mb-1">Save {discount}%</span>}
            </div>

            <div className="soft-line mb-5"/>

            <p className="text-[#6B4A3A] font-dm text-sm leading-relaxed tracking-wide mb-6">{product.description}</p>

            {/* Details pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.material && <span className="bg-champagne-50 border border-champagne-200 text-champagne-600 text-[10px] font-dm font-bold px-3 py-1.5 rounded-full">🧵 {product.material}</span>}
              <span className={`text-[10px] font-dm font-bold px-3 py-1.5 rounded-full ${product.stock>0 ? 'bg-sage-100 border border-sage-200 text-sage-600' : 'bg-[rgba(212,118,10,0.08)] border border-[rgba(212,118,10,0.15)] text-[#D4760A]'}`}>
                {product.stock>0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="font-dm text-[10px] tracking-widest text-[#8A6A58] uppercase font-bold mb-3">
                  Color: <span className="text-[#D4760A]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-1.5 border-2 text-xs font-dm font-bold rounded-full transition-all ${selectedColor===color ? 'border-[#D4760A] bg-[rgba(212,118,10,0.08)] text-[#D4760A]' : 'border-[rgba(212,118,10,0.18)] text-[#8A6A58] hover:border-[rgba(212,118,10,0.30)]'}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="font-dm text-[10px] tracking-widest text-[#8A6A58] uppercase font-bold mb-3">
                  Size: <span className="text-[#D4760A]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 border-2 text-xs font-dm font-bold rounded-xl transition-all ${selectedSize===size ? 'border-[#D4760A] bg-[rgba(212,118,10,0.08)] text-[#D4760A]' : 'border-[rgba(212,118,10,0.18)] text-[#8A6A58] hover:border-[rgba(212,118,10,0.30)]'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="font-dm text-[10px] tracking-widest text-[#8A6A58] uppercase font-bold">Qty:</p>
              <div className="flex items-center border-2 border-[rgba(212,118,10,0.18)] rounded-full overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-[#8A6A58] hover:text-[#D4760A] hover:bg-[rgba(212,118,10,0.04)] transition-all text-xl">−</button>
                <span className="w-10 text-center text-[#2D1810] font-dm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} className="w-10 h-10 flex items-center justify-center text-[#8A6A58] hover:text-[#D4760A] hover:bg-[rgba(212,118,10,0.04)] transition-all text-xl">+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={adding || product.stock===0}
                className="btn-rose flex-1 py-4 text-xs rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 font-bold tracking-wider">
                {adding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><FiShoppingBag size={14}/>{product.stock===0 ? 'Out of Stock' : 'Add to Bag ✿'}</>}
              </button>
              <button className="btn-outline-rose w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0"
                onClick={() => toggle(product._id)}
                style={{ color: isWishlisted(product._id) ? '#D4760A' : undefined }}
              >
                <FiHeart size={16} style={{ fill: isWishlisted(product._id) ? '#D4760A' : 'transparent' }}/>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied! ✦'); }}
                className="btn-outline-rose w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0"><FiShare2 size={16}/></button>
            </div>

            {/* Delivery note */}
            <div className="mt-5 bg-champagne-50 border border-champagne-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-[#4A2E20] text-xs font-dm font-semibold">Free delivery on orders over <span className="text-[#D4760A]">PKR 5,000</span></p>
                <p className="text-[#A8907E] text-[10px] font-dm mt-0.5">Delivered across Pakistan in 3–5 business days</p>
              </div>
            </div>

            {product.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-dm text-mauve/60 border border-[rgba(212,118,10,0.15)] px-2.5 py-1 rounded-full bg-[rgba(212,118,10,0.04)]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 border-t border-[rgba(212,118,10,0.15)]/20 pt-12">
          <div className="text-center mb-8">
            <p className="section-label mb-2">Customer Reviews</p>
            <h2 className="font-playfair text-3xl text-[#2D1810] italic">What Our Sisters Say 💕</h2>
            {product.ratings?.count > 0 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i) => (
                    <FiStar key={i} size={16} style={{fill: i<Math.round(product.ratings.average) ? '#D4878C':'transparent', color: i<Math.round(product.ratings.average) ? '#D4878C':'#E8C8CC'}}/>
                  ))}
                </div>
                <span className="font-dm text-sm text-[#6B4A3A]">{product.ratings.average.toFixed(1)} · {product.ratings.count} review{product.ratings.count !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* AI Review Summary */}
          {product.reviews?.length > 0 && (
            <AIReviewHighlights reviews={product.reviews} productName={product.name} />
          )}

          {/* Write a review */}
          <div className="mb-8">
            {!showReviewForm ? (
              <div className="text-center">
                <button
                  onClick={() => { if (!user) { router.push('/login'); return; } setShowReviewForm(true); }}
                  className="btn-outline-rose px-6 py-2.5 text-xs rounded-full font-bold"
                >
                  ✦ Write a Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="fancy-border rounded-3xl p-6 bg-white max-w-xl mx-auto">
                <h3 className="font-playfair text-xl text-[#2D1810] italic mb-4">Share Your Experience 🌸</h3>
                {/* Star rating picker */}
                <div className="mb-4">
                  <p className="font-dm text-[10px] tracking-widest text-[#D4760A] uppercase font-bold mb-2">Your Rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110">
                        <FiStar size={24} style={{
                          fill: star <= reviewRating ? '#D4878C' : 'transparent',
                          color: star <= reviewRating ? '#D4878C' : '#E8C8CC',
                          cursor: 'pointer'
                        }}/>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-dm text-[10px] tracking-widest text-[#D4760A] uppercase font-bold mb-2">Your Review</p>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Tell us about the fabric, fit, delivery… anything that would help a sister decide 💕"
                    rows={3}
                    className="input-soft w-full px-4 py-3 text-sm resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowReviewForm(false)}
                    className="btn-outline-rose flex-1 py-2.5 rounded-xl text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="btn-rose flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                    {submitting
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      : <><FiSend size={12}/> Submit Review</>}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Review cards */}
          {product.reviews?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.slice(0,6).map((review,i) => (
                <div key={i} className="fancy-border rounded-2xl p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{background:'linear-gradient(135deg,#FFB3C1,#D8C3FF)'}}>
                        {review.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <p className="font-dm text-xs text-[#4A2E20] font-bold">{review.name}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_,j) => <FiStar key={j} size={11} style={{fill: j<review.rating ? '#D4878C':'transparent', color: j<review.rating ? '#D4878C':'#E8C8CC'}}/>)}
                    </div>
                  </div>
                  <p className="font-playfair text-[#6B4A3A] text-lg italic">&ldquo;{review.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          {(!product.reviews || product.reviews.length === 0) && !showReviewForm && (
            <div className="text-center py-12 rounded-2xl border border-[rgba(212,118,10,0.15)]/20 bg-white">
              <p className="text-3xl mb-2">💬</p>
              <p className="font-playfair text-xl text-[#A8907E] italic mb-1">No reviews yet</p>
              <p className="font-dm text-xs text-mauve/50">Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
