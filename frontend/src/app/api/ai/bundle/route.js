import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { occasion, season, budget } = await req.json();
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
        max_tokens: 600,
        system: `You are a luxury Islamic fashion curator for Gumnam Momina (Pakistan). Generate a curated outfit bundle. Respond ONLY with valid JSON — no markdown, no backticks, no extra text.

JSON schema:
{
  "title": "evocative bundle name (e.g. 'Eid Dawn Collection')",
  "tagline": "poetic 1-line tagline mixing Urdu/English (e.g. 'Noor aur style — ek saath ✦')",
  "items": [
    {
      "type": "category (Abaya/Hijab/Prayer Chadar/Accessories)",
      "name": "specific product name",
      "color": "specific color name",
      "fabric": "fabric name",
      "price": "PKR XXXX",
      "emoji": "single relevant emoji",
      "reason": "one-line styling reason"
    }
  ],
  "totalEstimate": "PKR X,XXX – X,XXX",
  "stylingTip": "one warm, practical styling tip mixing Urdu words naturally"
}

Rules:
- Include 3-4 items that coordinate beautifully
- Fabric and colors should match the occasion and season
- Be specific (e.g. "Dusty Rose Chiffon Hijab" not just "Hijab")
- Prices should be realistic for Pakistan luxury market`,
        messages: [{ role: 'user', content: `Occasion: ${occasion}, Season: ${season || 'All-season'}, Budget: ${budget || 'Any'} PKR` }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    const bundle = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json({ bundle });
  } catch (err) {
    return NextResponse.json({
      bundle: {
        title: 'Elegant Essentials',
        tagline: 'Grace in every thread ✦',
        items: [
          { type: 'Abaya', name: 'Classic Open Abaya', color: 'Midnight Black', fabric: 'Korean Nida', price: 'PKR 4,500', emoji: '🖤', reason: 'Timeless base for any occasion' },
          { type: 'Hijab', name: 'Chiffon Flow Hijab', color: 'Ivory', fabric: 'Chiffon', price: 'PKR 1,800', emoji: '✨', reason: 'Lightweight contrast that elevates the look' },
        ],
        totalEstimate: 'PKR 6,000 – 8,000',
        stylingTip: 'Pin the hijab loosely at the shoulder for a modern, effortless drape — mashallah it looks stunning!',
      },
    });
  }
}
