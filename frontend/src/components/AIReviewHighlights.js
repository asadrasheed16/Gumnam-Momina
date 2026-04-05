'use client';
import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';

const SENTIMENT_STYLE = {
  positive: { bg: '#F0FDF8', border: '#99F5D9', color: '#10B981' },
  mixed: { bg: '#FFFBF0', border: '#FAE27C', color: '#EAB308' },
  neutral: { bg: '#FFF5EC', border: '#FFECD6', color: '#C68B2C' },
};

export default function AIReviewHighlights({ reviews, productName }) {
  const [highlights, setHighlights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!reviews || reviews.length < 2 || fetched) return;
    setFetched(true);
    setLoading(true);
    fetch('/api/ai/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews, productName }),
    })
      .then(r => r.json())
      .then(d => { if (d.highlights) setHighlights(d.highlights); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reviews, productName, fetched]);

  if (!reviews || reviews.length < 2) return null;

  return (
    <div className="rounded-3xl border border-[rgba(212,118,10,0.08)] overflow-hidden mb-8"
      style={{ background: 'linear-gradient(135deg, #FFF9F5, #FFF0F5)' }}>
      <div className="px-5 py-4 border-b border-[rgba(212,118,10,0.08)] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'linear-gradient(135deg, #F5C97A, #FFECD6)' }}>✦</div>
        <p className="font-dm font-bold text-[#2D1810] text-sm">AI Review Summary</p>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose/10 text-rose border border-rose/20 font-dm tracking-wider">AI</span>
      </div>

      {loading && (
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
          <p className="text-xs font-dm text-[#8A6A58]/60 italic">Analysing {reviews.length} reviews…</p>
        </div>
      )}

      {highlights && (
        <div className="px-5 py-5">
          {/* Summary */}
          <p className="text-xs font-dm text-[#8A6A58] italic mb-4 leading-relaxed">"{highlights.summary}"</p>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {highlights.highlights?.map((h, i) => {
              const s = SENTIMENT_STYLE[h.sentiment] || SENTIMENT_STYLE.neutral;
              return (
                <div key={i} className="rounded-2xl p-3 border"
                  style={{ background: s.bg, borderColor: s.border }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{h.icon}</span>
                    <p className="font-dm font-bold text-[#2D1810] text-[11px]">{h.label}</p>
                  </div>
                  <p className="text-[10px] font-dm text-[#2D1810]/60 leading-relaxed">{h.detail}</p>
                </div>
              );
            })}
          </div>

          {/* Recommend % */}
          {highlights.recommendPercent && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[rgba(212,118,10,0.08)] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose to-mint transition-all duration-1000"
                  style={{ width: `${highlights.recommendPercent}%` }} />
              </div>
              <p className="text-xs font-dm font-bold text-[#2D1810]/60 flex-shrink-0">
                <span className="text-[#6B4A3A]">{highlights.recommendPercent}%</span> recommend
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
