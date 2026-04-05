"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const shipping = cartTotal >= 5000 ? 0 : 200;

  return (
    <>
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ background: "rgba(45,24,16,0.35)" }}
          onClick={() => setCartOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-500 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, rgba(255,249,242,0.99), rgba(255,243,230,0.99))",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(212,118,10,0.12)",
          boxShadow: "-12px 0 40px rgba(212,118,10,0.10)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{
            background: "linear-gradient(135deg, rgba(212,118,10,0.08), rgba(198,139,44,0.05))",
            borderBottom: "1px solid rgba(212,118,10,0.12)",
          }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,118,10,0.10)", border: "1px solid rgba(212,118,10,0.20)" }}>
              <FiShoppingBag size={15} style={{ color: "#D4760A" }} />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-semibold" style={{ color: "#2D1810" }}>
                Your Bag ✦
              </h2>
              <p className="text-[10px] font-dm" style={{ color: "#8A6A58" }}>
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(212,118,10,0.06)", color: "#6B4A3A", border: "1px solid rgba(212,118,10,0.12)" }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(212,118,10,0.07)", border: "1px solid rgba(212,118,10,0.12)" }}>
                <span className="text-4xl">🛍️</span>
              </div>
              <div>
                <p className="font-playfair text-xl italic" style={{ color: "#6B4A3A" }}>
                  Your bag is empty
                </p>
                <p className="text-xs font-dm mt-1" style={{ color: "#8A6A58" }}>
                  Add something beautiful ✦
                </p>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="btn-outline-rose px-6 py-2.5 text-xs rounded-full">
                <Link href="/products">Shop Now</Link>
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item._id} className="flex gap-3 py-3"
                  style={{ borderBottom: "1px solid rgba(212,118,10,0.08)" }}>
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden img-zoom"
                    style={{ width: 72, height: 88, background: "#FFECD6" }}>
                    <Image
                      src={product.images?.[0] || "https://via.placeholder.com/72x88"}
                      alt={product.name} fill className="object-cover" sizes="72px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-playfair text-sm font-semibold line-clamp-1"
                      style={{ color: "#2D1810" }}>
                      {product.name}
                    </h4>
                    {(item.size || item.color) && (
                      <p className="text-[10px] font-dm mt-0.5" style={{ color: "#8A6A58" }}>
                        {item.size && `Size: ${item.size}`}{" "}
                        {item.color && `· ${item.color}`}
                      </p>
                    )}
                    <p className="text-sm font-dm font-bold mt-1" style={{ color: "#D4760A" }}>
                      PKR {(product.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 rounded-full px-1"
                        style={{ border: "1px solid rgba(212,118,10,0.18)" }}>
                        <button onClick={() => updateItem(item._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                          style={{ color: "#6B4A3A" }}>
                          <FiMinus size={10} />
                        </button>
                        <span className="text-sm font-dm font-bold w-4 text-center" style={{ color: "#2D1810" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateItem(item._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                          style={{ color: "#6B4A3A" }}>
                          <FiPlus size={10} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item._id)}
                        className="transition-colors"
                        style={{ color: "#A8907E" }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-5 space-y-4"
            style={{
              background: "linear-gradient(180deg, rgba(212,118,10,0.05), rgba(255,249,242,0.98))",
              borderTop: "1px solid rgba(212,118,10,0.12)",
            }}>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-dm">
                <span style={{ color: "#6B4A3A" }} className="font-semibold">Subtotal</span>
                <span style={{ color: "#2D1810" }} className="font-bold">PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-dm">
                <span style={{ color: "#6B4A3A" }} className="font-semibold">Shipping</span>
                <span className="font-bold" style={{ color: shipping === 0 ? "#1A7A6D" : "#2D1810" }}>
                  {shipping === 0 ? "FREE 🎉" : `PKR ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] font-dm px-3 py-1.5 rounded-full text-center"
                  style={{ color: "#D4760A", background: "rgba(212,118,10,0.06)", border: "1px solid rgba(212,118,10,0.12)" }}>
                  Add PKR {(5000 - cartTotal).toLocaleString()} more for free shipping ✦
                </p>
              )}
              <div className="soft-line" />
              <div className="flex justify-between">
                <span className="font-dm font-bold" style={{ color: "#2D1810" }}>Total</span>
                <span className="font-playfair text-xl font-bold" style={{ color: "#D4760A" }}>
                  PKR {(cartTotal + shipping).toLocaleString()}
                </span>
              </div>
            </div>
            {user ? (
              <Link href="/checkout" onClick={() => setCartOpen(false)}
                className="btn-primary w-full py-3.5 text-xs rounded-xl block text-center font-bold tracking-wider">
                Proceed to Checkout ✦
              </Link>
            ) : (
              <Link href="/login" onClick={() => setCartOpen(false)}
                className="btn-primary w-full py-3.5 text-xs rounded-xl block text-center font-bold tracking-wider">
                Sign In to Checkout
              </Link>
            )}
            <Link href="/products" onClick={() => setCartOpen(false)}
              className="block text-center text-[10px] font-dm transition-colors"
              style={{ color: "#8A6A58" }}>
              Continue Shopping →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
