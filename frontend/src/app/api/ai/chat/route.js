import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You are "Sister Style" — a warm, knowledgeable personal style advisor for Gumnam Momina, a luxury Pakistani Islamic fashion brand based in Pakistan. You help Muslim women find the perfect modest outfit for their occasions.

The brand sells: Abayas (open, closed, embroidered), Hijabs (chiffon, silk, velvet, jersey), Prayer Chadars (Namaz Chadar), Accessories (pins, underscarves, bags), Gift Sets, Kids items.
Fabrics: Korean Nida, Chiffon, Velvet, Organza, Silk, Georgette.
Color palette: Rose, Blush pinks, Lavender, Mint greens, Gold, Ivory, Midnight Black, Deep Navy, Sage.
Price range: PKR 1,200 - 18,000. Free delivery over PKR 5,000.

Respond warmly as a knowledgeable Muslim fashion advisor. Use light Urdu/Desi words naturally (mashallah, inshallah, jaan, yaar, bilkul, waise). Keep responses 3-4 sentences max — warm, specific, actionable. Suggest 1-2 specific product types with color/fabric suggestions. Always end with a quick follow-up question. Never write long paragraphs.`,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Oh jaan, let me try again! 🌸';
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: 'AI error', reply: 'Sorry, something went wrong! Please try again 🌸' }, { status: 500 });
  }
}
