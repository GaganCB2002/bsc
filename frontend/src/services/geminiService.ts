// Prefer an environment-injected key (set VITE_GEMINI_API_KEY in .env.local).
// SECURITY: No fallback key — if the env var is missing, the AI chat falls back
// to the built-in smart-reply system. Hardcoding a key in the bundle is a leak:
// anyone can extract it and abuse the quota.
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || '';

const SYSTEM_PROMPT = `You are BSC Exclusive's AI assistant for an Indian silk saree and ethnic wear store since 1938. You help customers with:
- Product recommendations (silk sarees, kanchipuram, banarasi, ethnic wear)
- Shipping, returns, exchanges, size guide, care instructions, order tracking
- Store locations: Davangere (Medical College Rd), Belgaum (Tilakwadi), Shivamogga (B.H. Road)
- Contact: Phone +91 8192 272180, Email hello@bscexclusive.com
Be helpful, friendly, concise. Keep responses under 150 words.`;

const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

async function tryGeminiModels(): Promise<string> {
  // If there's no API key, skip the network call entirely and return empty.
  if (!GEMINI_API_KEY) return '';
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatHistory.slice(-8),
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });

      if (!response.ok) {
        // Don't log the response body in production (it can echo the prompt and key).
        if (import.meta.env.DEV) {
          const errText = await response.text();
          console.warn(`Gemini ${model} failed:`, response.status, errText);
        }
        continue;
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply && reply.trim().length > 0) {
        return reply.trim();
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`Gemini ${model} error:`, err);
      }
    }
  }
  return '';
}

export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    chatHistory.push({ role: 'user', parts: [{ text: message }] });

    const geminiReply = await tryGeminiModels();
    const reply = geminiReply || getSmartReply(message);

    chatHistory.push({ role: 'model', parts: [{ text: reply }] });

    if (chatHistory.length > 16) {
      chatHistory.splice(0, chatHistory.length - 8);
    }

    return reply;
  } catch (err) {
    if (import.meta.env.DEV) console.error('Gemini chat error:', err);
    return getSmartReply(message);
  }
}

function getSmartReply(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('saree') || msg.includes('silk')) {
    return 'We have a beautiful collection of silk sarees! Our bestsellers include Kanchipuram Pure Silk (from ₹3,500), Banarasi Silk (from ₹2,800), and Mysore Silk (from ₹2,200). Would you like me to suggest based on a specific occasion or budget?';
  }
  if (msg.includes('ship') || msg.includes('deliver')) {
    return 'We offer free shipping on orders above ₹5,000! Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for ₹149. All orders are tracked and you will receive updates via SMS and email.';
  }
  if (msg.includes('return') || msg.includes('exchange') || msg.includes('refund')) {
    return 'We have a hassle-free 7-day return/exchange policy. Items must be unused and in original packaging. To initiate, contact us at +91 8192 272180 or email hello@bscexclusive.com with your order ID.';
  }
  if (msg.includes('store') || msg.includes('location') || msg.includes('shop') || msg.includes('visit')) {
    return 'We have 3 stores across Karnataka:\n1. Davangere - Medical College Rd\n2. Belgaum - Tilakwadi\n3. Shivamogga - B.H. Road\n\nVisit us for a personalized shopping experience!';
  }
  if (msg.includes('track') || msg.includes('order')) {
    return 'To track your order, check your email/SMS for the tracking link, or call us at +91 8192 272180 with your order ID. You can also view order status in your account dashboard.';
  }
  if (msg.includes('bridal') || msg.includes('wedding')) {
    return 'For bridal collections, we recommend our Kanchipuram Pure Silk sarees (₹4,500 - ₹25,000) and designer lehengas. Our Davangere store has the largest bridal collection. Book an appointment for personalized assistance!';
  }
  if (msg.includes('price') || msg.includes('budget') || msg.includes('cost')) {
    return 'Our range starts from ₹499 (kids ethnic wear) to ₹50,000+ (premium bridal silks). Best sellers are in the ₹2,000-8,000 range. We also have EMI options available on orders above ₹5,000.';
  }
  if (msg.includes('care') || msg.includes('wash') || msg.includes('maintenance')) {
    return 'Silk care tips: Dry clean only for the first 2-3 washes. After that, hand wash in cold water with mild detergent. Never wring silk. Store in a cotton cloth away from direct sunlight. Iron on low heat with a cloth barrier.';
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return 'Hello! Welcome to BSC Exclusive. I am here to help you find the perfect silk saree or ethnic wear. What are you looking for today?';
  }
  if (msg.includes('thank')) {
    return 'You are welcome! If you need any more help, feel free to ask. Happy shopping at BSC Exclusive!';
  }
  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
    return 'You can reach us at:\nPhone: +91 8192 272180\nEmail: hello@bscexclusive.com\n\nOur stores are open 10 AM - 9 PM, Monday to Sunday.';
  }

  return 'Thank you for your message! I can help you with product recommendations, shipping info, store locations, or order tracking. Could you tell me more about what you are looking for?';
}

export function clearChatHistory() {
  chatHistory.length = 0;
}
