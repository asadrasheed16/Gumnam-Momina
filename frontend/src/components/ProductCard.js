"use client";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiStar, FiHeart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggle, isWishlisted } = useWishlist();
  const router = useRouter();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const wishlisted = isWishlisted(product._id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    addItem(product._id, 1, product.sizes?.[0], product.colors?.[0]);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product._id);
  };

  return (
    <Link href={`/products/${product._id}`} className="block group">
      <div className="card-cute rounded-2xl overflow-hidden">
        {/* Image */}
        <div
          className="relative aspect-[3/4] img-zoom"
          style={{ background: "linear-gradient(180deg, #FFECD6, #FFF3E6)" }}
        >
          <Image
            src={product.images?.[0] || "https://via.placeholder.com/400x533"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 50vw, 25vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && <span className="badge-sage">NEW ✦</span>}
            {discount > 0 && <span className="badge-rose">-{discount}%</span>}
            {product.stock === 0 && (
              <span
                className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: "rgba(45,24,16,0.80)", color: "rgba(255,249,242,0.8)", border: "1px solid rgba(212,118,10,0.25)" }}
              >
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            style={{
              color: wishlisted ? "#7A2E3A" : "white",
              background: wishlisted ? "rgba(122,46,58,0.15)" : "rgba(45,24,16,0.50)",
              backdropFilter: "blur(8px)",
              border: "1px solid " + (wishlisted ? "rgba(122,46,58,0.35)" : "rgba(212,118,10,0.20)"),
            }}
          >
            <FiHeart size={13} style={{ fill: wishlisted ? "#7A2E3A" : "transparent" }} />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className="btn-primary w-full py-2.5 text-[11px] rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiShoppingBag size={13} />{" "}
              {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[9px] mb-1 font-dm font-semibold tracking-widest uppercase"
            style={{ color: "#D4760A" }}>{product.category}</p>
          <h3 className="font-playfair text-base leading-snug transition-colors line-clamp-1 font-semibold"
            style={{ color: "#2D1810", fontFamily: "Playfair Display, serif" }}>
            {product.name}
          </h3>

          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={9}
                  style={{
                    fill: i < Math.round(product.ratings.average) ? "#D4760A" : "transparent",
                    color: i < Math.round(product.ratings.average) ? "#D4760A" : "rgba(212,118,10,0.25)",
                  }}
                />
              ))}
              <span className="text-[10px] font-dm ml-0.5" style={{ color: "#8A6A58" }}>
                ({product.ratings.count})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="font-dm font-bold text-sm" style={{ color: "#D4760A" }}>
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through font-dm" style={{ color: "#A8907E" }}>
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
