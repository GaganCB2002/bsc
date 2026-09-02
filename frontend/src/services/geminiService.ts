const GEMINI_API_KEY = 'AIzaSyDwZIwJW3DH2zOITMzBv9YgZnDzmMpxfTc';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are BSC Exclusive's AI assistant. You help customers with:

1. PRODUCT RECOMMENDATIONS - Suggest silk sarees, kanchipuram silks, banarasi silks, ethnic wear based on occasion, budget, and preferences
2. CUSTOMER SUPPORT - Answer questions about shipping, returns, exchanges, size guide, care instructions, order tracking
3. STORE INFORMATION - Our stores are in Davangere (Medical College Rd), Belgaum (Tilakwadi), and Shivamogga (B.H. Road)
4. CONTACT - Phone: +91 8192 272180, Email: hello@bscexclusive.com
5. BRAND STORY - BSC Exclusive has been serving customers since 1938 with authentic handloom silk sarees

Be helpful, friendly, and knowledgeable about Indian silk sarees and ethnic wear. Keep responses concise. If you don't know something specific, direct them to contact customer service.`;

export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser: ' + message }] },
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request. Please try again.';
  } catch {
    return 'Sorry, I am having trouble connecting. Please contact us at +91 8192 272180 or hello@bscexclusive.com for assistance.';
  }
}
