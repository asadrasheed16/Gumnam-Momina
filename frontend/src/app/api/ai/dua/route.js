import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { recipientName, occasion, senderName } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );

    const SYSTEM = `Generate a personalized Islamic gift card for a luxury Pakistani fashion gift. Respond ONLY with valid JSON — no markdown, no backticks, no extra text.

JSON schema:
{
  "arabicVerse": "a short relevant Quranic verse or hadith in Arabic (4-7 words)",
  "transliteration": "romanized transliteration",
  "translation": "English translation",
  "personalMessage": "2-3 warm, heartfelt sentences for the recipient. Use their name naturally. Mix light Urdu words (jaan, mashallah, dua, khushi, mohabbat). Make it feel handwritten and genuine.",
  "duaLine": "a beautiful short dua for the recipient in English",
  "colorTheme": "one of: rose, gold, mint, lavender"
}

Match the Arabic verse and dua to the occasion. Keep the personal message warm and authentic — not corporate or generic.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Recipient: ${recipientName}, Occasion: ${occasion}${senderName ? `, From: ${senderName}` : ""}`,
          },
        ],
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "{}";
    const card = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json({ card });
  } catch (err) {
    return NextResponse.json({
      card: {
        arabicVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillahir Rahmanir Raheem",
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful",
        personalMessage: `Dearest ${recipientName || "Sister"}, may this gift bring a smile to your beautiful face and warmth to your heart. Wishing you all the khushi and blessings this special occasion brings, mashallah!`,
        duaLine:
          "May Allah fill your days with light, love, and endless blessings. Ameen 🤲",
        colorTheme: "rose",
      },
    });
  }
}
