"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiGrid,
  FiHeart,
  FiSettings,
} from "react-icons/fi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/products", label: "Collection" },
    { href: "/products?category=Abaya", label: "Abayas" },
    { href: "/products?category=Namaz Chadar", label: "Prayer" },
    { href: "/products?category=Accessories", label: "Accessories" },
    { href: "/products?category=Gift Sets", label: "Gifts ✦" },
  ];

  return (
    <>
      {/* Promo bar */}
      <div
        className="border-b py-2"
        style={{
          background: "linear-gradient(90deg, rgba(212,118,10,0.08), rgba(198,139,44,0.06), rgba(212,118,10,0.08))",
          borderColor: "rgba(212,118,10,0.12)",
        }}
      >
        <p className="text-center text-[10px] tracking-[0.3em] font-dm uppercase"
          style={{ color: "#A8652A" }}>
          ✦ Free shipping over PKR 5,000 &nbsp;·&nbsp; Handcrafted with Love
          &nbsp;·&nbsp; Premium Quality ✦
        </p>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl shadow-md" : "backdrop-blur-sm"
        }`}
        style={{ borderBottom: "1px solid rgba(212,118,10,0.10)" }}
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: scrolled
              ? "rgba(255,249,242,0.96)"
              : "rgba(255,249,242,0.85)",
            backdropFilter: "blur(20px)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden transition-colors"
              style={{ color: "#6B4A3A" }}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 group"
            >
              <div className="text-center">
                <p
                  className="text-2xl md:text-3xl leading-none"
                  style={{ fontFamily: "Amiri, serif", color: "#D4760A" }}
                >
                  گمنام مومنہ
                </p>
                <p className="font-dm text-[8px] tracking-[0.45em] uppercase mt-0.5"
                  style={{ color: "#B8862C" }}>
                  Gumnam Momina
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-dm text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 relative group font-semibold"
                  style={{ color: "#6B4A3A" }}
                  onMouseEnter={(e) => e.target.style.color = "#D4760A"}
                  onMouseLeave={(e) => e.target.style.color = "#6B4A3A"}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
                    style={{ background: "linear-gradient(90deg, #D4760A, #7A2E3A)" }} />
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {user && (
                <Link
                  href="/wishlist"
                  className="relative transition-colors"
                  style={{ color: "#6B4A3A" }}
                  aria-label="Wishlist"
                >
                  <FiHeart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #D4760A, #E89830)", color: "white" }}>
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={() => setCartOpen(true)}
                className="relative transition-colors"
                style={{ color: "#6B4A3A" }}
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #D4760A, #E89830)", color: "white" }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(212,118,10,0.15), rgba(198,139,44,0.12))", border: "1px solid rgba(212,118,10,0.30)" }}>
                      <span className="text-xs font-bold font-dm" style={{ color: "#D4760A" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-10 w-52 rounded-2xl py-2 z-50"
                      style={{
                        background: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(212,118,10,0.15)",
                        boxShadow: "0 12px 40px rgba(212,118,10,0.12)",
                      }}
                    >
                      <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(212,118,10,0.10)" }}>
                        <p className="text-xs font-dm font-bold truncate" style={{ color: "#2D1810" }}>
                          {user.name}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: "#8A6A58" }}>
                          {user.email}
                        </p>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold"
                        style={{ color: "#6B4A3A" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#D4760A"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#6B4A3A"}>
                        <FiSettings size={13} /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold"
                        style={{ color: "#6B4A3A" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#D4760A"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#6B4A3A"}>
                        <FiPackage size={13} /> My Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold"
                        style={{ color: "#6B4A3A" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#D4760A"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#6B4A3A"}>
                        <FiHeart size={13} /> Wishlist{" "}
                        {wishlist.length > 0 && (
                          <span className="ml-auto text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #D4760A, #E89830)", color: "white" }}>
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                      {user.role === "admin" && (
                        <>
                          <div style={{ borderTop: "1px solid rgba(212,118,10,0.10)", margin: "4px 0" }} />
                          <Link href="/admin/products" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold"
                            style={{ color: "#6B4A3A" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#1A7A6D"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#6B4A3A"}>
                            <FiGrid size={13} /> Products
                          </Link>
                          <Link href="/admin/orders" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold"
                            style={{ color: "#6B4A3A" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#1A7A6D"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#6B4A3A"}>
                            <FiPackage size={13} /> Orders
                          </Link>
                        </>
                      )}
                      <div style={{ borderTop: "1px solid rgba(212,118,10,0.10)", margin: "4px 0" }} />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 transition-colors text-xs font-dm font-semibold w-full"
                        style={{ color: "#7A2E3A" }}
                      >
                        <FiLogOut size={13} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="transition-colors" style={{ color: "#6B4A3A" }}>
                  <FiUser size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-xl flex flex-col pt-24 px-8"
          style={{
            background: "linear-gradient(160deg, rgba(255,249,242,0.98), rgba(255,243,230,0.98), rgba(255,247,238,0.98))",
          }}
        >
          <div className="text-center mb-8">
            <p style={{ fontFamily: "Amiri,serif", color: "#D4760A", fontSize: "28px" }}>
              گمنام مومنہ
            </p>
            <div className="soft-line max-w-32 mx-auto mt-3" />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-playfair text-3xl transition-colors py-3 italic"
              style={{ color: "#4A2E20", borderBottom: "1px solid rgba(212,118,10,0.10)" }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-8 flex gap-3">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="btn-outline-rose px-6 py-2.5 text-xs rounded-full">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="btn-primary px-6 py-2.5 text-xs rounded-full">
                Join Us
              </Link>
            </div>
          )}
          <div className="mt-auto pb-8 text-center">
            <p className="text-2xl" style={{ color: "rgba(212,118,10,0.25)" }}>✦ ☽ ✦</p>
          </div>
        </div>
      )}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
