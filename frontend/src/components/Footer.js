"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{
        background: "linear-gradient(180deg, #FFF3E6, #FFF9F2)",
        borderTop: "1px solid rgba(212,118,10,0.12)",
      }}
    >
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,118,10,0.45), rgba(122,46,58,0.35), rgba(26,122,109,0.30), rgba(212,118,10,0.45), transparent)" }} />

      <div className="text-center py-8" style={{ borderBottom: "1px solid rgba(212,118,10,0.08)" }}>
        <p className="text-3xl tracking-widest" style={{ color: "rgba(212,118,10,0.30)" }}>✦ ☽ ✦ ☽ ✦</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="text-3xl mb-1" style={{ fontFamily: "Amiri,serif", color: "#D4760A" }}>
              گمنام مومنہ
            </p>
            <p className="font-dm text-[9px] tracking-[0.5em] uppercase mb-4"
              style={{ color: "#B8862C" }}>
              Gumnam Momina
            </p>
            <p className="text-sm leading-relaxed max-w-xs font-dm"
              style={{ color: "#6B4A3A" }}>
              Crafted for the modern Muslim woman — where modesty blossoms into
              timeless elegance. Every stitch carries a prayer. 🌹
            </p>
            <p className="mt-4 text-2xl" style={{ fontFamily: "Amiri,serif", color: "rgba(212,118,10,0.40)" }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          </div>
          <div>
            <h4 className="font-dm text-[10px] tracking-[0.3em] uppercase mb-5 font-bold"
              style={{ color: "#D4760A" }}>Explore ✦</h4>
            <div className="space-y-2.5">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=Abaya", label: "Abayas" },
                { href: "/products?category=Hijab", label: "Hijabs" },
                { href: "/products?category=Namaz Chadar", label: "Prayer Chadars" },
                { href: "/products?category=Gift Sets", label: "Gift Sets" },
                { href: "/products?category=Kids", label: "Kids" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="block text-xs font-dm font-semibold transition-colors"
                  style={{ color: "#6B4A3A" }}
                  onMouseEnter={(e) => e.target.style.color = "#D4760A"}
                  onMouseLeave={(e) => e.target.style.color = "#6B4A3A"}>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-dm text-[10px] tracking-[0.3em] uppercase mb-5 font-bold"
              style={{ color: "#D4760A" }}>Help ✦</h4>
            <div className="space-y-2.5">
              {["Track Your Order","Create Account","Size Guide","Returns Policy","Contact Us"].map((item) => (
                <Link key={item} href="#"
                  className="block text-xs font-dm font-semibold transition-colors"
                  style={{ color: "#6B4A3A" }}
                  onMouseEnter={(e) => e.target.style.color = "#D4760A"}
                  onMouseLeave={(e) => e.target.style.color = "#6B4A3A"}>{item}</Link>
              ))}
            </div>
            <div className="mt-7 rounded-2xl p-4"
              style={{ background: "rgba(212,118,10,0.06)", border: "1px solid rgba(212,118,10,0.14)" }}>
              <p className="text-[10px] font-dm font-bold tracking-wider mb-1" style={{ color: "#D4760A" }}>Get in Touch 💌</p>
              <p className="text-xs font-dm" style={{ color: "#6B4A3A" }}>+92 300 0000000</p>
              <p className="text-xs font-dm mt-0.5" style={{ color: "#6B4A3A" }}>hello@gumnammomina.pk</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(212,118,10,0.10)" }}>
          <p className="text-[10px] font-dm tracking-widest" style={{ color: "#8A6A58" }}>
            © 2025 GUMNAM MOMINA. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xl" style={{ color: "rgba(212,118,10,0.25)" }}>✦ ☽ ✦</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Shipping"].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-dm transition-colors"
                style={{ color: "#8A6A58" }}
                onMouseEnter={(e) => e.target.style.color = "#D4760A"}
                onMouseLeave={(e) => e.target.style.color = "#8A6A58"}>{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
