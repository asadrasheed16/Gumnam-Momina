import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { reviews, productName } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ highlights: null });
    }

    const reviewText = reviews.map((r, i) => `Review ${i + 1} (${r.rating}/5): "${r.comment}"`).join('\n');

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
        system: `You analyze customer reviews for a Pakistani luxury Islamic fashion store (Gumnam Momina) and extract the most useful insights. Respond ONLY with valid JSON — no markdown, no backticks.

JSON schema:
{
  "summary": "one warm sentence summarizing overall customer sentiment",
  "highlights": [
    { "icon": "emoji", "label": "short label (2-3 words)", "detail": "one concise sentence insight", "sentiment": "positive|mixed|neutral" },
    { "icon": "emoji", "label": "short label (2-3 words)", "detail": "one concise sentence insight", "sentiment": "positive|mixed|neutral" },
    { "icon": "emoji", "label": "short label (2-3 words)", "detail": "one concise sentence insight", "sentiment": "positive|mixed|neutral" }
  ],
  "recommendPercent": number (0-100, estimated % who would recommend)
}

Focus on: fabric quality, fit/sizing, packaging/presentation, delivery speed, value for money, color accuracy.`,
        messages: [{
          role: 'user',
          content: `Product: ${productName}\n\nReviews:\n${reviewText}`,
        }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    const highlights = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json({ highlights });
  } catch (err) {
    return NextResponse.json({ highlights: null });
  }
}
