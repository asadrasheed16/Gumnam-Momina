'use client';
import { useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

const COLOR_THEMES = {
  rose: { bg: 'linear-gradient(135deg, #1a0a12, #2d0e1a)', accent: '#D4760A', accentLight: '#F5C97A' },
  gold: { bg: 'linear-gradient(135deg, #4A2E18, #6B4A2A)', accent: '#D4760A', accentLight: '#F5C97A' },
  mint: { bg: 'linear-gradient(135deg, #001a0f, #002010)', accent: '#10B981', accentLight: '#99F5D9' },
  lavender: { bg: 'linear-gradient(135deg, #0a0515, #140a20)', accent: '#C68B2C', accentLight: '#FFECD6' },
};

const OCCASIONS = ['Eid', 'Walima / Wedding', 'Birthday', 'New Baby', 'Graduation', 'Ramadan', 'Umrah Gift', 'Just Because 💕'];

export default function DuaCardGenerator({ onClose, onCardGenerated }) {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [occasion, setOccasion] = useState('Eid');
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!recipientName.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/dua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName: recipientName.trim(), senderName: senderName.trim(), occasion }),
      });
      const data = await res.json();
      setCard(data.card);
      if (onCardGenerated) onCardGenerated(data.card);
    } catch {
      setCard(null);
    }
    setLoading(false);
  };

  const theme = card ? (COLOR_THEMES[card.colorTheme] || COLOR_THEMES.rose) : COLOR_THEMES.rose;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45,27,37,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-float"
        style={{ background: '#FFFBF9', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 text-center"
          style={{ background: 'linear-gradient(135deg, #FFFBF0, #FFF3E6)' }}>
          <button onClick={onClose} className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#2D1810]/50 hover:text-[#6B4A3A]">
            <FiX size={16} />
          </button>
          <div className="text-3xl mb-2">🤲</div>
          <h2 className="font-playfair text-2xl text-[#2D1810] italic font-semibold">Personalized Dua Card</h2>
          <p className="text-xs font-dm text-[#A8907E] mt-1">A handcrafted Islamic message included in your gift packaging</p>
        </div>

        <div className="px-6 py-5">
          {!card ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold block mb-2">For *</label>
                  <input value={recipientName} onChange={e => setRecipientName(e.target.value)}
                    placeholder="Recipient's name"
                    className="w-full px-3 py-2.5 text-xs font-dm rounded-xl border border-[rgba(212,118,10,0.15)] outline-none focus:border-[rgba(212,118,10,0.30)] bg-white text-[#2D1810]" />
                </div>
                <div>
                  <label className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold block mb-2">From (optional)</label>
                  <input value={senderName} onChange={e => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 text-xs font-dm rounded-xl border border-[rgba(212,118,10,0.15)] outline-none focus:border-[rgba(212,118,10,0.30)] bg-white text-[#2D1810]" />
                </div>
              </div>

              <div className="mb-6">
                <label className="font-dm text-[10px] tracking-[0.25em] text-[#6B4A3A] uppercase font-bold block mb-3">Occasion *</label>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map(o => (
                    <button key={o} onClick={() => setOccasion(o)}
                      className={`px-3 py-2 rounded-full text-xs font-dm font-semibold border-2 transition-all ${occasion === o ? 'border-rose bg-[rgba(212,118,10,0.08)] text-[#6B4A3A]' : 'border-[rgba(212,118,10,0.18)] text-[#2D1810]/50 hover:border-rose/40'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generate} disabled={!recipientName.trim() || loading}
                className="btn-rose w-full py-4 rounded-2xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #D4760A, #C68B2C)' }}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Crafting your card…</>
                ) : '✦ Generate Dua Card'}
              </button>
            </>
          ) : (
            <>
              {/* Dua Card Preview */}
              <div className="rounded-2xl overflow-hidden mb-5 relative"
                style={{ background: theme.bg, padding: '28px 24px' }}>
                {/* Islamic pattern */}
                <div className="absolute inset-0 opacity-[0.04]">
                  <svg width="100%" height="100%">
                    <pattern id="dp" width="35" height="35" patternUnits="userSpaceOnUse">
                      <polygon points="17.5,1 33,9 33,26 17.5,34 2,26 2,9" fill="none" stroke="#fff" strokeWidth="0.8"/>
                      <circle cx="17.5" cy="17.5" r="3.5" fill="none" stroke="#fff" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dp)"/>
                  </svg>
                </div>

                <div className="relative text-center">
                  {/* Arabic verse */}
                  <p className="text-xl mb-1 font-bold tracking-wide" style={{ color: theme.accent, fontFamily: 'serif', direction: 'rtl' }}>
                    {card.arabicVerse}
                  </p>
                  <p className="text-[10px] italic mb-0.5" style={{ color: theme.accentLight + 'bb' }}>{card.transliteration}</p>
                  <p className="text-[10px] mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{card.translation}</p>

                  {/* Divider */}
                  <div className="h-px my-4" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}44, transparent)` }} />

                  {/* Personal message */}
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                    {card.personalMessage}
                  </p>

                  {/* Dua */}
                  <p className="text-xs" style={{ color: theme.accentLight + 'cc', fontStyle: 'italic' }}>🤲 {card.duaLine}</p>

                  {/* Footer */}
                  <div className="h-px mt-4 mb-3" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}44, transparent)` }} />
                  <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: theme.accent + '66' }}>GUMNAM MOMINA ✦</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setCard(null)}
                  className="btn-outline-rose flex-1 py-3 rounded-2xl text-xs font-bold">
                  ← Regenerate
                </button>
                <button onClick={onClose}
                  className="btn-rose flex-1 py-3 rounded-2xl text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #D4760A, #C68B2C)' }}>
                  ✓ Add to Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

