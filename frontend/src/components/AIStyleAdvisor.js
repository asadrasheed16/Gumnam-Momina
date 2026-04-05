"use client";
import { useState, useEffect, useRef } from "react";
import { FiX, FiSend, FiMessageCircle } from "react-icons/fi";

const SUGGESTIONS = [
  "What to wear for Eid? 🌙",
  "Need a gift for my sister",
  "Best abaya under PKR 5,000?",
  "Summer hijab styles?",
  "Outfit for a walima?",
];

export default function AIStyleAdvisor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Assalamu Alaikum! 🌸 I'm Sister Style — your personal fashion advisor at Gumnam Momina. Tell me about your occasion and I'll curate the perfect modest look for you, inshallah!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Oh no jaan, something went wrong! Try again? 🌸",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && pulse && (
          <div
            className="shadow-float rounded-2xl rounded-br-sm px-3 py-2 text-xs font-dm max-w-[160px] text-right animate-fade-up"
            style={{
              background: "rgba(255,249,242,0.96)",
              border: "1px solid rgba(212,118,10,0.18)",
              color: "#4A2E20",
            }}
          >
            Need styling help? 🌸
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="relative w-14 h-14 rounded-full shadow-float flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)", boxShadow: "0 6px 24px rgba(212,118,10,0.35)" }}
          aria-label="Open style advisor"
        >
          {open ? (
            <FiX size={22} className="text-white" />
          ) : (
            <FiMessageCircle size={22} className="text-white" />
          )}
          {!open && pulse && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-40"
              style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)" }}
            />
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-3xl overflow-hidden shadow-float"
          style={{
            height: "480px",
            background: "linear-gradient(180deg, #FFF9F2, #FFF3E6 55%, #FFF7EE 100%)",
            border: "1px solid rgba(212,118,10,0.14)",
            boxShadow: "0 12px 50px rgba(212,118,10,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: "linear-gradient(135deg, rgba(212,118,10,0.08), rgba(198,139,44,0.06), rgba(26,122,109,0.04))",
              borderBottom: "1px solid rgba(212,118,10,0.10)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F5C97A, #E89830)" }}
            >
              ✿
            </div>
            <div>
              <p className="font-dm font-bold text-sm" style={{ color: "#2D1810" }}>
                Sister Style ✦
              </p>
              <p className="text-[10px] font-dm" style={{ color: "#8A6A58" }}>
                AI Style Advisor · Gumnam Momina
              </p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#1A7A6D" }} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {m.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 self-end"
                    style={{ background: "linear-gradient(135deg, #F5C97A, #E89830)" }}
                  >
                    ✿
                  </div>
                )}
                <div
                  className="max-w-[82%] px-3 py-2.5 rounded-2xl text-xs font-dm leading-relaxed"
                  style={{
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, #D4760A, #C68B2C)"
                        : "rgba(255,255,255,0.88)",
                    color: m.role === "user" ? "white" : "#2D1810",
                    border:
                      m.role === "assistant" ? "1px solid rgba(212,118,10,0.12)" : "none",
                    boxShadow: "0 2px 8px rgba(212,118,10,0.06)",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg, #F5C97A, #E89830)" }}
                >
                  ✿
                </div>
                <div
                  className="rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(212,118,10,0.10)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "#E89830", animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[10px] font-dm font-semibold px-2.5 py-1.5 rounded-full transition-colors"
                    style={{
                      border: "1px solid rgba(212,118,10,0.22)",
                      color: "#6B4A3A",
                      background: "rgba(212,118,10,0.05)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 flex gap-2"
            style={{
              background: "linear-gradient(180deg, rgba(255,249,242,0.98), rgba(255,243,230,0.95))",
              borderTop: "1px solid rgba(212,118,10,0.10)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about any outfit or occasion…"
              className="flex-1 px-3 py-2 text-xs font-dm rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(212,118,10,0.18)",
                color: "#2D1810",
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #D4760A, #C68B2C)" }}
            >
              <FiSend size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
