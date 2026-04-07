import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );

    const SYSTEM = `You are "Sister Style" — a warm, knowledgeable personal style advisor for Gumnam Momina, a luxury Pakistani Islamic fashion brand based in Pakistan. You help Muslim women find the perfect modest outfit for their occasions.

The brand sells: Abayas (open, closed, embroidered), Hijabs (chiffon, silk, velvet, jersey), Prayer Chadars (Namaz Chadar), Accessories (pins, underscarves, bags), Gift Sets, Kids items.
Fabrics: Korean Nida, Chiffon, Velvet, Organza, Silk, Georgette.
Color palette: Rose, Blush pinks, Lavender, Mint greens, Gold, Ivory, Midnight Black, Deep Navy, Sage.
Price range: PKR 1,200 - 18,000. Free delivery over PKR 5,000.

Respond warmly as a knowledgeable Muslim fashion advisor. Use light Urdu/Desi words naturally (mashallah, inshallah, jaan, yaar, bilkul, waise). Keep responses 3-4 sentences max — warm, specific, actionable. Suggest 1-2 specific product types with color/fabric suggestions. Always end with a quick follow-up question. Never write long paragraphs.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Groq API error:", res.status, errorData);
      return NextResponse.json(
        { error: "Groq API error", details: errorData },
        { status: res.status },
      );
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content || "Oh jaan, let me try again! 🌸";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      {
        error: "AI error",
        message: err.message,
        reply: "Sorry, something went wrong! Please try again 🌸",
      },
      { status: 500 },
    );
  }
}
