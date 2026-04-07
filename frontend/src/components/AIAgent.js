"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiX, FiSend, FiMessageCircle, FiPackage, FiShoppingBag,
  FiSearch, FiHelpCircle, FiStar, FiChevronRight, FiShoppingCart,
  FiTruck, FiCreditCard, FiRefreshCw, FiHeart, FiLogIn,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// ─── Quick Action Chips ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "What's trending? ✨", icon: <FiStar size={11} /> },
  { label: "Show me abayas", icon: <FiSearch size={11} /> },
  { label: "Track my order 📦", icon: <FiPackage size={11} /> },
  { label: "Hijabs under 2000", icon: <FiShoppingBag size={11} /> },
  { label: "Shipping info 🚚", icon: <FiTruck size={11} /> },
  { label: "Gift ideas 🎁", icon: <FiHeart size={11} /> },
];

// ─── Product Card Component ──────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product._id}`} className="agent-product-card group">
      <div className="agent-product-img">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="agent-product-placeholder">🧕</div>
        )}
        {discount > 0 && <span className="agent-product-badge">-{discount}%</span>}
      </div>
      <div className="agent-product-info">
        <p className="agent-product-name">{product.name}</p>
        <p className="agent-product-category">{product.category}</p>
        <div className="agent-product-price-row">
          <span className="agent-product-price">PKR {product.price?.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="agent-product-original">PKR {product.originalPrice?.toLocaleString()}</span>
          )}
        </div>
      </div>
      {onAddToCart && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
          className="agent-product-cart-btn"
          title="Add to cart"
        >
          <FiShoppingCart size={11} />
        </button>
      )}
    </Link>
  );
}

// ─── Order Timeline Component ────────────────────────────────────────────────
function OrderTimeline({ order }) {
  return (
    <div className="agent-order-card">
      <div className="agent-order-header">
        <span className="agent-order-id">Order #{order._id?.slice(-8)}</span>
        <span className="agent-order-total">PKR {order.total?.toLocaleString()}</span>
      </div>
      <div className="agent-timeline">
        {order.timeline?.map((step, i) => (
          <div key={step.step} className={`agent-timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
            <div className="agent-timeline-dot" />
            {i < order.timeline.length - 1 && <div className="agent-timeline-line" />}
            <span className="agent-timeline-label">{step.step}</span>
          </div>
        ))}
      </div>
      <div className="agent-order-items">
        {order.items?.slice(0, 3).map((item, i) => (
          <div key={i} className="agent-order-item">
            <span>{item.name}</span>
            <span>×{item.quantity}</span>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="agent-order-more">+{order.items.length - 3} more items</p>
        )}
      </div>
    </div>
  );
}

// ─── Cart Summary Component ──────────────────────────────────────────────────
function CartSummary({ cart }) {
  return (
    <div className="agent-cart-card">
      <div className="agent-cart-header">
        <FiShoppingCart size={14} />
        <span>Your Cart ({cart.count} items)</span>
      </div>
      {cart.items?.map((item, i) => (
        <div key={i} className="agent-cart-item">
          <div className="agent-cart-item-info">
            <span className="agent-cart-item-name">{item.name}</span>
            {(item.size || item.color) && (
              <span className="agent-cart-item-meta">{[item.size, item.color].filter(Boolean).join(' · ')}</span>
            )}
          </div>
          <span className="agent-cart-item-qty">×{item.quantity}</span>
          <span className="agent-cart-item-price">PKR {(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}
      <div className="agent-cart-total">
        <span>Total</span>
        <span>PKR {cart.total?.toLocaleString()}</span>
      </div>
      <Link href="/cart" className="agent-cart-checkout">
        Proceed to Checkout <FiChevronRight size={12} />
      </Link>
    </div>
  );
}

// ─── Auth Prompt Component ───────────────────────────────────────────────────
function AuthPrompt() {
  return (
    <div className="agent-auth-card">
      <FiLogIn size={20} style={{ color: '#D4760A' }} />
      <p>Please log in to access your cart and orders, jaan! 🌸</p>
      <Link href="/login" className="agent-auth-btn">
        Log In <FiChevronRight size={12} />
      </Link>
    </div>
  );
}

// ─── Main AIAgent Component ──────────────────────────────────────────────────
export default function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Assalamu Alaikum! 🌸 I'm Momina — your personal shopping assistant at Gumnam Momina. I can help you find products, track orders, manage your cart, and answer any questions. Kya dhundh rahi hain aaj? ✨",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, fetchCart } = useCart();

  useEffect(() => {
    if (open) {
      setPulse(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gm_token');
    }
    return null;
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    if (!user) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please log in first to add items to your cart, jaan! 🌸',
        type: 'auth_required',
      }]);
      return;
    }
    try {
      await addItem(product._id, 1, product.sizes?.[0], product.colors?.[0]);
      await fetchCart();
    } catch (err) {
      // toast handles error
    }
  }, [user, addItem, fetchCart]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const chatHistory = updatedMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          authToken: getAuthToken(),
        }),
      });

      const data = await res.json();

      const assistantMsg = {
        role: "assistant",
        content: data.reply || "Let me look into that for you! 🌸",
        type: data.type || "text",
        products: data.products,
        order: data.order,
        cart: data.cart || (data.items ? data : undefined),
        authRequired: data.authRequired,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Refresh cart if cart was modified
      if (data.type === 'cart' || data.cart) {
        fetchCart();
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Oh no jaan, something went wrong! Please try again? 🌸",
        type: "error",
      }]);
    }
    setLoading(false);
  };

  // ─── Render Message Content ──────────────────────────────────────────────
  const renderMessage = (msg, idx) => {
    if (msg.role === "user") {
      return (
        <div key={idx} className="agent-msg-row user">
          <div className="agent-bubble user">{msg.content}</div>
        </div>
      );
    }

    return (
      <div key={idx} className="agent-msg-row assistant">
        <div className="agent-avatar">✿</div>
        <div className="agent-msg-content">
          <div className="agent-bubble assistant">{msg.content}</div>

          {/* Product cards */}
          {msg.products && msg.products.length > 0 && (
            <div className="agent-products-grid">
              {msg.products.slice(0, 6).map((p) => (
                <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}

          {/* Order timeline */}
          {msg.order && <OrderTimeline order={msg.order} />}

          {/* Cart summary */}
          {msg.cart && msg.cart.items && <CartSummary cart={msg.cart} />}

          {/* Auth required */}
          {msg.authRequired && <AuthPrompt />}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Floating Trigger Bubble ────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && pulse && (
          <div className="agent-tooltip">
            Need help shopping? ✨
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="agent-fab"
          aria-label="Open AI shopping assistant"
        >
          {open ? (
            <FiX size={22} className="text-white" />
          ) : (
            <FiMessageCircle size={22} className="text-white" />
          )}
          {!open && pulse && (
            <span className="agent-fab-ping" />
          )}
        </button>
      </div>

      {/* ── Chat Panel ─────────────────────────────────────────── */}
      {open && (
        <div className="agent-panel">
          {/* Header */}
          <div className="agent-header">
            <div className="agent-header-avatar">✿</div>
            <div className="agent-header-info">
              <p className="agent-header-name">Momina AI ✦</p>
              <p className="agent-header-sub">Shopping Assistant · Gumnam Momina</p>
            </div>
            <div className="agent-header-status" />
            <button onClick={() => setOpen(false)} className="agent-header-close" aria-label="Close">
              <FiX size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="agent-messages">
            {messages.map((m, i) => renderMessage(m, i))}

            {/* Typing indicator */}
            {loading && (
              <div className="agent-msg-row assistant">
                <div className="agent-avatar">✿</div>
                <div className="agent-typing">
                  <div className="agent-typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="agent-typing-dot" style={{ animationDelay: '0.15s' }} />
                  <div className="agent-typing-dot" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}

            {/* Quick actions — show only at start */}
            {messages.length === 1 && !loading && (
              <div className="agent-quick-actions">
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.label} onClick={() => send(a.label)} className="agent-chip">
                    {a.icon}
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="agent-input-area">
            <div className="agent-input-row">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask me anything about shopping…"
                className="agent-input"
                disabled={loading}
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="agent-send-btn"
              >
                <FiSend size={14} />
              </button>
            </div>
            <div className="agent-input-footer">
              <span>Powered by AI ✦</span>
              <div className="agent-input-shortcuts">
                <button onClick={() => send("What's in my cart?")} title="View Cart">
                  <FiShoppingCart size={12} />
                </button>
                <button onClick={() => send("Track my order")} title="Track Order">
                  <FiPackage size={12} />
                </button>
                <button onClick={() => send("Shipping info")} title="FAQ">
                  <FiHelpCircle size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
