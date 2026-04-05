"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";

const PROMPTS = [
  "Summer abayas under PKR 5,000 💐",
  "Gift set for Eid 🎁",
  "New arrivals this week ✨",
  "Best seller prayer chadars 🌙",
  "Hijabs for daily wear",
];

export default function AISearch({ className = "" }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);

  const handleSearch = async (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    setResponseText("");
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      const f = data.filters || {};
      setResponseText(f.responseText || "");

      const params = new URLSearchParams();
      if (f.category) params.set("category", f.category);
      if (f.sort && f.sort !== "newest") params.set("sort", f.sort);
      if (f.featured) params.set("featured", "true");
      if (f.newArrival) params.set("newArrival", "true");

      setTimeout(() => {
        router.push(
          `/products${params.toString() ? "?" + params.toString() : ""}`,
        );
        setLoading(false);
        setQuery("");
        setResponseText("");
      }, 900);
    } catch {
      setLoading(false);
      router.push("/products");
    }
  };

  return (
    <div className={`relative ${className}`}>
      {responseText && (
        <div
          className="absolute -top-10 left-0 right-0 text-white text-[10px] font-dm px-3 py-1.5 rounded-xl rounded-bl-sm shadow-float z-10 animate-fade-up"
          style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)" }}
        >
          {responseText}
        </div>
      )}

      <div
        className="relative flex items-center rounded-2xl border-2 overflow-hidden transition-all"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "rgba(212,118,10,0.20)",
          boxShadow: "0 2px 16px rgba(212,118,10,0.06)",
        }}
      >
        <div className="pl-3 pr-1 flex items-center gap-1.5 flex-shrink-0">
          {loading ? (
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(212,118,10,0.25)', borderTopColor: '#D4760A' }} />
          ) : (
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)" }}
            >
              ✦
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search naturally… e.g. 'summer Eid abaya under 6000'"
          className="flex-1 px-2 py-3 text-xs font-dm bg-transparent outline-none"
          style={{ color: '#2D1810' }}
        />

        {query && (
          <button onClick={() => setQuery("")}
            className="p-2 transition-colors" style={{ color: '#A8907E' }}>
            <FiX size={14} />
          </button>
        )}

        <button
          onClick={() => handleSearch()}
          disabled={!query.trim() || loading}
          className="mx-1 px-3 py-2 rounded-xl flex items-center gap-1 text-[10px] font-dm font-bold text-white disabled:opacity-40 transition-all"
          style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)" }}
        >
          <FiSearch size={12} /> Search
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => handleSearch(p)}
            className="text-[10px] font-dm font-semibold px-2.5 py-1.5 rounded-full transition-colors"
            style={{
              border: '1px solid rgba(212,118,10,0.22)',
              color: '#6B4A3A',
              background: 'rgba(212,118,10,0.05)',
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
