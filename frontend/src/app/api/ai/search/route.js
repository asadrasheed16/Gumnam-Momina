import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { query } = await req.json();
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
        max_tokens: 300,
        system: `You are a search assistant for Gumnam Momina, a Pakistani luxury Islamic fashion store.

Extract search filters from natural language queries. Respond ONLY with valid JSON — no markdown, no backticks.

Available categories: Abaya, Hijab, Namaz Chadar, Accessories, Gift Sets, Kids
Available sort options: newest, price_asc, price_desc, popular
Max price: 50000 PKR

JSON schema:
{
  "category": "category name or empty string",
  "maxPrice": number or null,
  "minPrice": number or null,
  "sort": "sort option or 'newest'",
  "featured": boolean,
  "newArrival": boolean,
  "searchPhrase": "cleaned short search phrase for display",
  "responseText": "warm 1-sentence response acknowledging the search with slight Urdu flavor"
}

Examples:
- "summer abayas under 5000" → category: "Abaya", maxPrice: 5000
- "eid gift for sister" → category: "Gift Sets", featured: true
- "latest arrivals" → newArrival: true
- "cheapest hijabs" → category: "Hijab", sort: "price_asc"
- "best sellers" → sort: "popular", featured: true`,
        messages: [{ role: 'user', content: query }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    const filters = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json({ filters });
  } catch (err) {
    return NextResponse.json({ filters: { category: '', sort: 'newest', searchPhrase: query, responseText: 'Showing all products for you! 🌸' } });
  }
}
