"use client";
import { useState } from "react";
import { FiX, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const OCCASIONS = [
  "Eid",
  "Walima",
  "Nikah",
  "Umrah / Hajj",
  "Daily Wear",
  "Office",
  "Gift for Sister",
  "Gift for Mom",
  "Casual Outing",
];
const SEASONS = ["Summer", "Winter", "Spring / Fall", "All-season"];
const BUDGETS = [
  "Under PKR 5,000",
  "PKR 5,000 – 10,000",
  "PKR 10,000 – 20,000",
  "PKR 20,000+",
];

const CATEGORY_COLOR = {
  Abaya: { bg: "#FFF3E6", color: "#D4760A" },
  Hijab: { bg: "#FFF5EC", color: "#C68B2C" },
  "Prayer Chadar": { bg: "#F0FDF8", color: "#10B981" },
  "Namaz Chadar": { bg: "#F0FDF8", color: "#10B981" },
  Accessories: { bg: "#FFF7F0", color: "#FF9B52" },
  "Gift Sets": { bg: "#FFFBF0", color: "#EAB308" },
};

export default function AIBundleBuilder({ onClose }) {
  const [step, setStep] = useState(1); // 1: form, 2: result
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [budget, setBudget] = useState("");
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);

  const build = async () => {
    if (!occasion || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, season, budget }),
      });
      const data = await res.json();
      setBundle(data.bundle);
      setStep(2);
    } catch {
      setBundle(null);
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1);
    setBundle(null);
    setOccasion("");
    setSeason("");
    setBudget("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(45,27,37,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-float"
        style={{
          background:
            "linear-gradient(180deg, #FFFBF9, #FFF3E6 55%, #FFF5EC 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-6 pb-4 text-center"
          style={{ background: "linear-gradient(135deg, #FFF3E6, #FFF5EC)" }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-[#2D1810]/50 hover:text-[#6B4A3A] transition-colors"
            style={{ background: "rgba(255,255,255,0.76)" }}
          >
            <FiX size={16} />
          </button>
          <div className="text-3xl mb-2">✨</div>
          <h2 className="font-playfair text-2xl text-[#2D1810] italic font-semibold">
            AI Bundle Builder
          </h2>
          <p className="text-xs font-dm text-[#A8907E] mt-1">
            Tell me your occasion — I'll curate your perfect look
          </p>
        </div>

        <div className="px-6 py-6">
          {step === 1 && (
            <>
              {/* Occasion */}
              <div className="mb-5">
                <p className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold mb-3">
                  Occasion *
                </p>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`px-3 py-2 rounded-full text-xs font-dm font-semibold border-2 transition-all ${occasion === o ? "border-rose bg-[rgba(212,118,10,0.08)] text-[#6B4A3A]" : "border-[rgba(212,118,10,0.18)] text-[#2D1810]/50 hover:border-[rgba(212,118,10,0.30)]"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="mb-5">
                <p className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold mb-3">
                  Season
                </p>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeason(s === season ? "" : s)}
                      className={`px-3 py-2 rounded-full text-xs font-dm font-semibold border-2 transition-all ${season === s ? "border-lavender bg-lavender/10 text-lavender" : "border-[rgba(212,118,10,0.18)] text-[#2D1810]/50 hover:border-lavender/50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <p className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold mb-3">
                  Budget
                </p>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b === budget ? "" : b)}
                      className={`px-3 py-2 rounded-full text-xs font-dm font-semibold border-2 transition-all ${budget === b ? "border-mint bg-[#1A7A6D]/10 text-mint" : "border-[rgba(212,118,10,0.18)] text-[#2D1810]/50 hover:border-mint/50"}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={build}
                disabled={!occasion || loading}
                className="btn-rose w-full py-4 rounded-2xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Curating your look…
                  </>
                ) : (
                  "✦ Build My Bundle"
                )}
              </button>
            </>
          )}

          {step === 2 && bundle && (
            <>
              {/* Result */}
              <div className="text-center mb-5">
                <p className="font-playfair text-xl text-[#2D1810] italic font-semibold">
                  {bundle.title}
                </p>
                <p className="text-xs font-dm text-lavender mt-1 italic">
                  {bundle.tagline}
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                {bundle.items?.map((item, i) => {
                  const c = CATEGORY_COLOR[item.type] || {
                    bg: "#FFF3E6",
                    color: "#D4760A",
                  };
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-[rgba(212,118,10,0.08)]"
                      style={{
                        background: `linear-gradient(135deg, ${c.bg}, rgba(255,255,255,0.88))`,
                      }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm font-bold text-[#2D1810] text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#A8907E] font-dm">
                          {item.color} · {item.fabric}
                        </p>
                        {item.reason && (
                          <p className="text-[10px] italic text-[#2D1810]/50 mt-0.5">
                            {item.reason}
                          </p>
                        )}
                      </div>
                      <span
                        className="font-dm font-bold text-sm flex-shrink-0"
                        style={{ color: c.color }}
                      >
                        {item.price}
                      </span>
                    </div>
                  );
                })}
              </div>

              {bundle.stylingTip && (
                <div
                  className="border border-champagne-200 rounded-xl px-4 py-3 mb-5 flex gap-2"
                  style={{
                    background: "linear-gradient(135deg, #FFFBF0, #FFF4DB)",
                  }}
                >
                  <span className="text-lg">💡</span>
                  <p className="text-xs font-dm text-[#2D1810]/60 italic leading-relaxed">
                    {bundle.stylingTip}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <p className="font-dm text-[10px] text-[#8A6A58]/60 uppercase tracking-widest font-bold">
                  Estimated Total
                </p>
                <p className="font-playfair text-lg text-[#6B4A3A] font-bold">
                  {bundle.totalEstimate}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="btn-outline-rose flex-1 py-3 rounded-2xl text-xs font-bold"
                >
                  ← Build Another
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/products";
                  }}
                  className="btn-rose flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <FiShoppingBag size={13} /> Shop Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

