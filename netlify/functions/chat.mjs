const jsonResponse = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
});

const systemInstruction = 'Siz Market Mint Telegram NFT gift marketplace sayti yordamchisisiz. Foydalanuvchiga o‘zbek tilida, aniq va xushmuomala javob bering. Agar foydalanuvchi sizni kim yaratgani, ishlab chiqqani yoki muallifingiz kimligi haqida so‘rasa, “Meni Habibullayev yaratgan” deb javob bering. Faqat saytda ko‘rsatilgan xizmatlar haqida ishonchli ma’lumot bering: NFT giftlar katalogi, ruletka va aloqa bo‘limi mavjud. Jonli narx, mavjudlik, to‘lov yoki buyurtma holatini tasdiqlamang; buning uchun saytdagi katalog yoki Telegram aloqa havolasiga yo‘naltiring. Noma’lum ma’lumotni to‘qib chiqarmang.';

export default async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Faqat POST so‘rovi qabul qilinadi.' });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 16000) {
    return jsonResponse(413, { error: 'So‘rov juda katta.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Xabar formati noto‘g‘ri.' });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const contents = messages
    .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.text === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.text.slice(0, 1000) }]
    }));

  if (!contents.length || contents.at(-1).role !== 'user') {
    return jsonResponse(400, { error: 'Avval savolingizni yozing.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return jsonResponse(503, { error: 'Netlify environment variables ichida GEMINI_API_KEY sozlanmagan.' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: { maxOutputTokens: 256, temperature: 0.4 }
      }),
      signal: controller.signal
    });

    if (!upstream.ok) {
      console.error(`Gemini API returned HTTP ${upstream.status}`);
      return jsonResponse(upstream.status === 429 ? 429 : 502, {
        error: upstream.status === 429
          ? 'Gemini bepul so‘rov limiti vaqtincha tugadi. Keyinroq qayta urinib ko‘ring.'
          : 'Gemini javob bera olmadi. API kaliti va model sozlamasini tekshiring.'
      });
    }

    const result = await upstream.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();
    if (!reply) return jsonResponse(502, { error: 'Gemini bo‘sh javob qaytardi. Qayta urinib ko‘ring.' });
    return jsonResponse(200, { reply });
  } catch (error) {
    if (error.name === 'AbortError') {
      return jsonResponse(504, { error: 'AI javobi uzoq ketyapti. Qayta urinib ko‘ring.' });
    }
    console.error('Gemini function failed:', error.message);
    return jsonResponse(502, { error: 'Gemini bilan ulanishda xatolik. Qayta urinib ko‘ring.' });
  } finally {
    clearTimeout(timeout);
  }
};
