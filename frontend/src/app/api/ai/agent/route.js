import { NextResponse } from "next/server";

// ─── FAQ Knowledge Base ──────────────────────────────────────────────────────
const FAQ_KB = {
  shipping: {
    answer:
      "We deliver across Pakistan in 3–5 business days! 🚚 Orders over PKR 5,000 get FREE delivery. Under that, it's just PKR 200. We ship via TCS/Leopards for safe, tracked delivery.",
    category: "Shipping",
  },
  returns: {
    answer:
      "We have a 7-day return policy for unused items in original packaging. Just reach out to us within 7 days of delivery and we'll guide you through the process, inshallah! Exchange is also available for size/color issues. 🌸",
    category: "Returns",
  },
  payment: {
    answer:
      "We accept: 💳 Cash on Delivery (COD) — most popular! 🏦 Bank Transfer 📱 EasyPaisa 📱 JazzCash. Payment is confirmed before shipping for digital methods.",
    category: "Payment",
  },
  sizing: {
    answer:
      "Our abayas come in XS to XXL. Most are loose-fitting for comfort. Hijabs are Free Size. Kids sizes range from 4Y to 12Y. We recommend ordering your usual size — our fits are generous, mashallah! If you need help, tell me your height and I'll suggest a size. 📏",
    category: "Sizing",
  },
  contact: {
    answer:
      "You can reach us on WhatsApp or through our social media. We're based in Pakistan and typically reply within a few hours during business hours (10 AM - 8 PM PKT). 💌",
    category: "Contact",
  },
  care: {
    answer:
      "Most of our pieces are hand-wash or gentle machine wash in cold water. Hang dry in shade. Velvet items should be dry-cleaned. Chiffon hijabs — gentle hand wash only. Iron on low heat. Your piece will last beautifully with proper care, inshallah! 🧵",
    category: "Care",
  },
  gift: {
    answer:
      "Yes, we offer beautiful gift wrapping! Our Gift Sets come in luxury packaging. You can also add a personalized Dua card with your order — use our AI Dua Card Generator on the website! 🎁💝",
    category: "Gifting",
  },
};

// ─── Claude Tool Definitions ─────────────────────────────────────────────────
const TOOLS = [
  {
    name: "search_products",
    description:
      "Search for products in the Gumnam Momina catalog. Use when the user asks about products, wants to browse, or needs specific items. Can filter by category, price range, and sort order.",
    input_schema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Product category. One of: Abaya, Hijab, Namaz Chadar, Accessories, Gift Sets, Kids. Leave empty for all categories.",
        },
        minPrice: { type: "number", description: "Minimum price in PKR" },
        maxPrice: { type: "number", description: "Maximum price in PKR" },
        sort: {
          type: "string",
          enum: ["newest", "price_asc", "price_desc", "popular"],
          description: "Sort order",
        },
        featured: {
          type: "boolean",
          description: "Only show featured products",
        },
        newArrival: { type: "boolean", description: "Only show new arrivals" },
        search: { type: "string", description: "Free text search query" },
      },
      required: [],
    },
  },
  {
    name: "get_product_details",
    description:
      "Get detailed information about a specific product by its ID. Use when the user asks about a specific product or wants more details.",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The MongoDB product ID" },
      },
      required: ["productId"],
    },
  },
  {
    name: "track_order",
    description:
      'Track an order status. Use when the user asks "where is my order" or wants to check order status. Requires authentication. If no orderId is provided, returns the most recent order.',
    input_schema: {
      type: "object",
      properties: {
        orderId: {
          type: "string",
          description:
            "The order ID to track. Leave empty for most recent order.",
        },
      },
      required: [],
    },
  },
  {
    name: "manage_cart",
    description:
      "Manage the user's shopping cart. Can view cart, add items, remove items, or clear cart. Requires authentication.",
    input_schema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["view", "add", "remove", "clear"],
          description: "Cart action to perform",
        },
        productId: {
          type: "string",
          description: "Product ID for add/remove actions",
        },
        quantity: {
          type: "number",
          description: "Quantity to add (default 1)",
        },
        size: { type: "string", description: "Size of the product" },
        color: { type: "string", description: "Color of the product" },
        itemId: {
          type: "string",
          description: "Cart item ID for remove action",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "get_recommendations",
    description:
      'Get personalized product recommendations based on category, occasion, or budget. Use when user asks for suggestions, "what should I buy", or needs help choosing.',
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Preferred category" },
        occasion: {
          type: "string",
          description: "Occasion like Eid, Walima, Daily Wear, Umrah, etc.",
        },
        budget: {
          type: "string",
          description: 'Budget range like "under 5000" or "5000-10000"',
        },
      },
      required: [],
    },
  },
  {
    name: "answer_faq",
    description:
      "Answer frequently asked questions about shipping, returns, payment, sizing, contact info, garment care, or gifting. Use when user asks about policies, how things work, or general store info.",
    input_schema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          enum: [
            "shipping",
            "returns",
            "payment",
            "sizing",
            "contact",
            "care",
            "gift",
          ],
          description: "The FAQ topic",
        },
      },
      required: ["topic"],
    },
  },
];

// ─── Tool Executor ───────────────────────────────────────────────────────────
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function executeTool(toolName, toolInput, authToken) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  try {
    switch (toolName) {
      case "search_products": {
        const res = await fetch(`${BACKEND_URL}/chatbot/search`, {
          method: "POST",
          headers,
          body: JSON.stringify(toolInput),
        });
        return await res.json();
      }

      case "get_product_details": {
        const res = await fetch(
          `${BACKEND_URL}/chatbot/product/${toolInput.productId}`,
          { headers },
        );
        return await res.json();
      }

      case "track_order": {
        if (!authToken)
          return {
            error: "AUTH_REQUIRED",
            message: "Please log in to track your order",
          };
        const res = await fetch(`${BACKEND_URL}/chatbot/track-order`, {
          method: "POST",
          headers,
          body: JSON.stringify({ orderId: toolInput.orderId }),
        });
        return await res.json();
      }

      case "manage_cart": {
        if (!authToken)
          return {
            error: "AUTH_REQUIRED",
            message: "Please log in to manage your cart",
          };
        const res = await fetch(`${BACKEND_URL}/chatbot/cart`, {
          method: "POST",
          headers,
          body: JSON.stringify(toolInput),
        });
        return await res.json();
      }

      case "get_recommendations": {
        const res = await fetch(`${BACKEND_URL}/chatbot/recommendations`, {
          method: "POST",
          headers,
          body: JSON.stringify(toolInput),
        });
        return await res.json();
      }

      case "answer_faq": {
        const faq = FAQ_KB[toolInput.topic];
        if (faq) return faq;
        return {
          answer:
            "Hmm, I don't have info on that right now. You can reach out to our team for help! 💌",
          category: "General",
        };
      }

      default:
        return { error: "Unknown tool" };
    }
  } catch (err) {
    return { error: "TOOL_ERROR", message: err.message };
  }
}

// ─── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "Momina" — the warm, knowledgeable AI shopping assistant for Gumnam Momina, a luxury Pakistani Islamic fashion brand. You help Muslim women find the perfect modest outfits, track orders, manage carts, and answer questions.

PERSONALITY:
- Warm, sisterly, and enthusiastic — like chatting with a fashionable best friend
- Use light Urdu/Desi words naturally: mashallah, inshallah, jaan, bilkul, bohut, pyari, khoobsurat
- Keep responses 2-4 sentences max. Be specific and actionable
- Use occasional emojis: 🌸 ✨ 💕 🌙 ☽ 💝 🧕

BRAND CONTEXT:
- Store: Gumnam Momina — luxury Pakistani Islamic fashion
- Products: Abayas, Hijabs, Prayer Chadars (Namaz Chadar), Accessories, Gift Sets, Kids items
- Fabrics: Korean Nida, Chiffon, Velvet, Organza, Silk, Georgette, Crepe
- Colors: Rose, Blush, Lavender, Mint, Gold, Ivory, Black, Navy, Sage
- Price range: PKR 1,200 – 18,000
- Free delivery over PKR 5,000 across Pakistan
- Payment: COD, Bank Transfer, EasyPaisa, JazzCash

RULES:
1. ALWAYS use a tool when the user asks about products, orders, cart, or FAQ topics. Never make up product details.
2. When showing products from search results, mention the product names, prices, and key details naturally.
3. For auth-required actions (cart, orders), if the tool returns AUTH_REQUIRED, warmly suggest the user log in first.
4. Always end with a relevant follow-up question to keep the conversation going.
5. When the user wants to add something to cart, use the manage_cart tool with action "add".
6. When recommending products, ALWAYS include the product's _id in your response so users can view or add them.
7. Include a product_cards field in your response when showing products — format: [{_id, name, price, image, category}]
8. If the user asks something unrelated to fashion/shopping, gently redirect to how you can help with their shopping.`;

// ─── Smart Tool Executor (Intent-based) ──────────────────────────────────────
async function smartExecuteTools(userMessage, authToken) {
  const msg = userMessage.toLowerCase();
  const toolResults = {};

  // Detect intent and execute relevant tools
  if (
    msg.includes("product") ||
    msg.includes("abaya") ||
    msg.includes("hijab") ||
    msg.includes("show") ||
    msg.includes("find") ||
    msg.includes("look") ||
    msg.includes("search")
  ) {
    // Extract any specific product type/budget mentioned
    let search = { search: userMessage };
    if (msg.includes("abaya")) search.category = "Abaya";
    if (msg.includes("hijab")) search.category = "Hijab";
    if (msg.includes("namaz") || msg.includes("chadar"))
      search.category = "Namaz Chadar";
    if (msg.includes("accessories")) search.category = "Accessories";
    if (msg.includes("gift")) search.category = "Gift Sets";
    if (msg.includes("kids")) search.category = "Kids";

    if (
      msg.includes("under") ||
      msg.includes("2000") ||
      msg.includes("3000") ||
      msg.includes("5000")
    ) {
      search.maxPrice = parseInt(msg.match(/\d+/)?.[0]) || 5000;
    }

    const result = await executeTool("search_products", search, authToken);
    if (result.products) toolResults.products = result.products;
  }

  if (msg.includes("order") || msg.includes("track") || msg.includes("where")) {
    const result = await executeTool("track_order", {}, authToken);
    if (result.error === "AUTH_REQUIRED") {
      toolResults.authRequired = true;
    } else if (result.order) {
      toolResults.order = result.order;
    }
  }

  if (msg.includes("cart") || msg.includes("add") || msg.includes("remove")) {
    const result = await executeTool(
      "manage_cart",
      { action: "view" },
      authToken,
    );
    if (result.error === "AUTH_REQUIRED") {
      toolResults.authRequired = true;
    } else if (result.items) {
      toolResults.cart = result;
    }
  }

  if (
    msg.includes("shipping") ||
    msg.includes("deliver") ||
    msg.includes("ship")
  ) {
    const result = await executeTool(
      "answer_faq",
      { topic: "shipping" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (msg.includes("return") || msg.includes("exchange")) {
    const result = await executeTool(
      "answer_faq",
      { topic: "returns" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (msg.includes("payment") || msg.includes("pay")) {
    const result = await executeTool(
      "answer_faq",
      { topic: "payment" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (msg.includes("size") || msg.includes("fit")) {
    const result = await executeTool(
      "answer_faq",
      { topic: "sizing" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (
    msg.includes("contact") ||
    msg.includes("reach") ||
    msg.includes("whatsapp")
  ) {
    const result = await executeTool(
      "answer_faq",
      { topic: "contact" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (msg.includes("care") || msg.includes("wash") || msg.includes("clean")) {
    const result = await executeTool(
      "answer_faq",
      { topic: "care" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  if (msg.includes("gift") || msg.includes("wrap")) {
    const result = await executeTool(
      "answer_faq",
      { topic: "gift" },
      authToken,
    );
    if (result.answer) toolResults.faqAnswer = result.answer;
  }

  return toolResults;
}

// ─── Main API Route ──────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { messages, authToken } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "gsk_your_groq_key_here") {
      return NextResponse.json({
        reply:
          "I'm not fully set up yet jaan! The store owner needs to add the Groq API key. But feel free to browse our collections! 🌸",
        type: "text",
      });
    }

    // Get the last user message for intent detection
    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // Execute tools based on user intent
    const toolResults = await smartExecuteTools(lastUserMessage, authToken);

    // Build context from tool results
    let contextToAdd = "";
    let extras = {};

    if (toolResults.products) {
      contextToAdd += `\n\n[PRODUCTS FOUND]: ${JSON.stringify(toolResults.products.slice(0, 3))}`;
      extras.products = toolResults.products;
    }

    if (toolResults.order) {
      contextToAdd += `\n\n[ORDER INFO]: ${JSON.stringify(toolResults.order)}`;
      extras.order = toolResults.order;
    }

    if (toolResults.cart) {
      contextToAdd += `\n\n[CART INFO]: ${JSON.stringify(toolResults.cart)}`;
      extras.cart = toolResults.cart;
    }

    if (toolResults.faqAnswer) {
      contextToAdd += `\n\n[FAQ ANSWER]: ${toolResults.faqAnswer}`;
    }

    if (toolResults.authRequired) {
      extras.authRequired = true;
    }

    // Call Groq with context
    const groqMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Add tool context as system message if tools were executed
    if (contextToAdd) {
      groqMessages[groqMessages.length - 1].content += contextToAdd;
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...groqMessages,
          ],
        }),
      },
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Let me check on that for you, jaan! 🌸";

    return NextResponse.json({
      reply,
      type: extras.products
        ? "products"
        : extras.order
          ? "order"
          : extras.cart
            ? "cart"
            : extras.authRequired
              ? "auth_required"
              : "text",
      ...extras,
    });
  } catch (err) {
    console.error("AI Agent error:", err);
    return NextResponse.json(
      {
        reply:
          "Oh no jaan, something went wrong on my end! Please try again in a moment 🌸",
        type: "error",
      },
      { status: 500 },
    );
  }
}
