import { NextResponse } from 'next/server';

async function callClaude(system, userContent, maxTokens = 500) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

export async function POST(req) {
  try {
    const { tool, name, category, material, colors, price, tags } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
    }

    const productInfo = `Name: ${name || 'Unnamed Product'}, Category: ${category || 'Abaya'}, Fabric: ${material || 'premium fabric'}, Colors: ${Array.isArray(colors) ? colors.join(', ') : colors || 'classic'}, Price: PKR ${price || ''}`;

    if (tool === 'description') {
      const system = `You write luxury product descriptions for Gumnam Momina, a high-end Pakistani Islamic fashion brand.
Brand voice: elegant, warm, modest, aspirational. Use sensory language about fabric feel, occasion suitability, and modest beauty.
Write 2–3 flowing sentences. No bullet points. No "stunning" or "beautiful" — use refined synonyms.
Occasionally weave in a soft Urdu or Arabic word naturally.`;
      const text = await callClaude(system, `Write a product description for: ${productInfo}`);
      return NextResponse.json({ description: text.trim() });
    }

    if (tool === 'seo') {
      const system = `You generate SEO tags for a luxury Pakistani Islamic fashion store (Gumnam Momina).
Respond ONLY with a JSON array of 5–7 short keyword strings — no markdown, no backticks, no extra text.
Example: ["luxury abaya pakistan","korean nida abaya","modest fashion pk"]
Include Pakistan/Pakistani, the product category, and relevant modest-fashion keywords.`;
      const text = await callClaude(system, `Generate SEO tags for: ${productInfo}`);
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return NextResponse.json({ tags: Array.isArray(parsed) ? parsed.join(', ') : '' });
    }

    if (tool === 'caption') {
      const system = `You write Instagram captions for Gumnam Momina, a luxury Pakistani Islamic fashion brand.
Respond ONLY with valid JSON — no markdown, no backticks:
{"short":"1-2 line caption with emojis + 3 hashtags","medium":"3-4 line caption with emojis + 5 hashtags","urdu":"Urdu/English mix caption with emojis + 3 hashtags"}
Keep it aspirational, modest, and warm.`;
      const text = await callClaude(system, `Write captions for: ${productInfo}`);
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      // Return all 3 options concatenated for clipboard
      const fullCaption = `✨ SHORT:\n${parsed.short}\n\n📝 MEDIUM:\n${parsed.medium}\n\n🌙 URDU MIX:\n${parsed.urdu}`;
      return NextResponse.json({ caption: fullCaption, options: parsed });
    }

    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 });
  } catch (err) {
    console.error('Admin AI error:', err);
    return NextResponse.json({ error: 'AI tool failed: ' + err.message }, { status: 500 });
  }
}
