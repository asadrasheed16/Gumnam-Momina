"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

export default function CartPage() {
  const { cart, cartTotal, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const shipping = cartTotal >= 5000 ? 0 : 200;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen pb-20" style={{ background: "#FFF9F2" }}>
      <div
        className="py-14 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#FFF5EC,#FFF9F2,#FFF3E6)",
        }}
      >
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative">
          <p
            className="font-dm text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "#B8862C" }}
          >
            {cart.length} items
          </p>
          <h1
            className="font-playfair text-4xl md:text-6xl text-[#2D1810] italic"
            style={{ fontFamily: "Playfair Display,serif" }}
          >
            Your Bag 🛍️
          </h1>
          <div className="lace-divider max-w-48 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center py-32 text-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#FFF5EC,rgba(212,118,10,0.12))" }}
            >
              <FiShoppingBag size={36} style={{ color: "#F5C6D0" }} />
            </div>
            <div>
              <p
                className="font-playfair text-3xl text-[#2D1810]/40 italic mb-2"
                style={{ fontFamily: "Playfair Display,serif" }}
              >
                Your bag is empty
              </p>
              <p
                className="font-dm text-xs tracking-wider uppercase"
                style={{ color: "#B8862C" }}
              >
                Discover something beautiful ✨
              </p>
            </div>
            <Link
              href="/products"
              className="btn-rose px-10 py-4 rounded-full text-xs tracking-widest"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2">
              {cart.map((item) => {
                const p = item.product;
                if (!p) return null;
                return (
                  <div
                    key={item._id}
                    className="flex gap-4 py-6 border-b group"
                    style={{ borderColor: "rgba(212,118,10,0.12)" }}
                  >
                    <Link href={`/products/${p._id}`} className="flex-shrink-0">
                      <div
                        className="w-24 h-28 relative rounded-2xl overflow-hidden border img-zoom"
                        style={{ borderColor: "rgba(212,118,10,0.12)" }}
                      >
                        <Image
                          src={
                            p.images?.[0] || "https://via.placeholder.com/96"
                          }
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-dm text-[10px] tracking-widest uppercase font-medium mb-0.5"
                        style={{ color: "#D4A030" }}
                      >
                        {p.category}
                      </p>
                      <h3
                        className="font-playfair text-lg text-[#2D1810] italic"
                        style={{ fontFamily: "Playfair Display,serif" }}
                      >
                        {p.name}
                      </h3>
                      {(item.size || item.color) && (
                        <p
                          className="font-dm text-[11px] tracking-wider mt-0.5"
                          style={{ color: "#8A6A58" }}
                        >
                          {item.size && item.size}
                          {item.color && ` · ${item.color}`}
                        </p>
                      )}
                      <p
                        className="font-playfair font-semibold mt-2"
                        style={{
                          color: "#D4760A",
                          fontFamily: "Playfair Display,serif",
                        }}
                      >
                        PKR {(p.price * item.quantity).toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div
                          className="flex items-center border rounded-full"
                          style={{ borderColor: "rgba(212,118,10,0.12)" }}
                        >
                          <button
                            onClick={() =>
                              updateItem(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[rgba(212,118,10,0.04)] rounded-full"
                            style={{ color: "rgba(61,43,53,0.5)" }}
                          >
                            <FiMinus size={10} />
                          </button>
                          <span className="w-8 text-center font-dm text-sm text-[#2D1810] font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItem(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[rgba(212,118,10,0.04)] rounded-full"
                            style={{ color: "rgba(61,43,53,0.5)" }}
                          >
                            <FiPlus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[10px] font-dm uppercase tracking-wider hover:text-rose-500"
                          style={{ color: "rgba(155,123,132,0.5)" }}
                        >
                          <FiTrash2 size={11} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/products"
                className="flex items-center gap-2 mt-6 text-xs font-dm uppercase tracking-wider transition-colors hover:text-rose-500"
                style={{ color: "rgba(61,43,53,0.4)" }}
              >
                <FiArrowLeft size={12} /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div>
              <div className="panel-soft rounded-3xl p-7 border sticky top-28 shadow-soft">
                <h2
                  className="font-playfair text-2xl text-[#2D1810] italic mb-6"
                  style={{ fontFamily: "Playfair Display,serif" }}
                >
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 text-xs font-dm">
                  <div className="flex justify-between">
                    <span
                      className="uppercase tracking-wider"
                      style={{ color: "#8A6A58" }}
                    >
                      Subtotal
                    </span>
                    <span className="text-[#2D1810] font-medium">
                      PKR {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="uppercase tracking-wider"
                      style={{ color: "#8A6A58" }}
                    >
                      Shipping
                    </span>
                    <span
                      className={
                        shipping === 0
                          ? "font-semibold"
                          : "text-[#2D1810] font-medium"
                      }
                      style={shipping === 0 ? { color: "#7AA364" } : {}}
                    >
                      {shipping === 0 ? "🎉 FREE" : `PKR ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p
                      className="text-[10px] rounded-2xl p-2.5 text-center tracking-wide"
                      style={{ background: "#FFF5EC", color: "#D4760A" }}
                    >
                      Add PKR {(5000 - cartTotal).toLocaleString()} for free
                      shipping 🌸
                    </p>
                  )}
                  <div className="lace-divider" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold uppercase tracking-wider text-sm text-[#2D1810]">
                      Total
                    </span>
                    <span
                      className="font-playfair font-semibold text-2xl"
                      style={{
                        color: "#D4760A",
                        fontFamily: "Playfair Display,serif",
                      }}
                    >
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {user ? (
                  <Link
                    href="/checkout"
                    className="btn-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                  >
                    Checkout <FiArrowRight size={13} />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="btn-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                  >
                    Sign In to Checkout
                  </Link>
                )}

                <div
                  className="mt-6 pt-5 border-t space-y-2.5"
                  style={{ borderColor: "rgba(212,118,10,0.12)" }}
                >
                  {[
                    "🔒 Secure checkout",
                    "🚚 Free shipping PKR 5,000+",
                    "💝 Handcrafted with love",
                    "↩️ Easy 7-day returns",
                  ].map((b) => (
                    <p
                      key={b}
                      className="font-dm text-[10px] tracking-wide"
                      style={{ color: "rgba(155,123,132,0.6)" }}
                    >
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
