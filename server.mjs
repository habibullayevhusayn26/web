import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.tgs', 'application/gzip'],
  ['.woff2', 'font/woff2']
]);
const requestBuckets = new Map();

function loadEnvFile() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(body));
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16000) throw new Error('So‘rov juda katta.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function isRateLimited(request) {
  const now = Date.now();
  const address = request.socket.remoteAddress || 'unknown';
  const bucket = requestBuckets.get(address) || { startedAt: now, count: 0 };
  if (now - bucket.startedAt >= 60000) {
    bucket.startedAt = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  requestBuckets.set(address, bucket);
  return bucket.count > 20;
}

async function handleChat(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Faqat POST so‘rovi qabul qilinadi.' });
  }
  if (isRateLimited(request)) {
    return sendJson(response, 429, { error: 'So‘rovlar limiti tugadi. Bir daqiqadan keyin qayta urinib ko‘ring.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return sendJson(response, 503, { error: 'Gemini API kaliti sozlanmagan. .env fayliga GEMINI_API_KEY kiriting.' });
  }

  try {
    const body = await readRequestBody(request);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const contents = messages
      .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.text === 'string')
      .map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.text.slice(0, 1000) }]
      }));

    if (!contents.length || contents.at(-1).role !== 'user') {
      return sendJson(response, 400, { error: 'Avval savolingizni yozing.' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let upstream;
    try {
      upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'Siz Market Mint Telegram NFT gift marketplace sayti yordamchisisiz. Foydalanuvchiga o‘zbek tilida, aniq va xushmuomala javob bering. Agar foydalanuvchi sizni kim yaratgani, ishlab chiqqani yoki muallifingiz kimligi haqida so‘rasa, “Meni Habibullayev yaratgan” deb javob bering. Faqat saytda ko‘rsatilgan xizmatlar haqida ishonchli ma’lumot bering: NFT giftlar katalogi, ruletka va aloqa bo‘limi mavjud. Jonli narx, mavjudlik, to‘lov yoki buyurtma holatini tasdiqlamang; buning uchun saytdagi katalog yoki Telegram aloqa havolasiga yo‘naltiring. Noma’lum ma’lumotni to‘qib chiqarmang.' }]
          },
          contents,
          generationConfig: { maxOutputTokens: 256, temperature: 0.4 }
        }),
        signal: controller.signal
      });
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }

    if (!upstream.ok) {
      clearTimeout(timeout);
      console.error(`Gemini API returned HTTP ${upstream.status}`);
      return sendJson(response, upstream.status === 429 ? 429 : 502, {
        error: upstream.status === 429
          ? 'Gemini bepul so‘rov limiti vaqtincha tugadi. Keyinroq qayta urinib ko‘ring.'
          : 'Gemini javob bera olmadi. API kalitini tekshirib, qayta urinib ko‘ring.'
      });
    }
    if (!upstream.body) {
      clearTimeout(timeout);
      return sendJson(response, 502, { error: 'Gemini oqimli javob qaytarmadi.' });
    }

    response.writeHead(200, {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'X-Content-Type-Options': 'nosniff'
    });

    const decoder = new TextDecoder();
    let pending = '';
    let hasReply = false;
    const writeEvent = (event) => {
      const data = event.split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('\n');
      if (!data || data === '[DONE]') return;

      try {
        const payload = JSON.parse(data);
        const text = payload.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || '')
          .join('');
        if (text) {
          hasReply = true;
          response.write(`${JSON.stringify({ text })}\n`);
        }
      } catch (error) {
        if (error instanceof SyntaxError) return;
        throw error;
      }
    };

    try {
      for await (const chunk of upstream.body) {
        pending += decoder.decode(chunk, { stream: true });
        const events = pending.split(/\r?\n\r?\n/);
        pending = events.pop() || '';
        events.forEach(writeEvent);
      }
      pending += decoder.decode();
      if (pending.trim()) writeEvent(pending);
      if (!hasReply) response.write(`${JSON.stringify({ error: 'Gemini bo‘sh javob qaytardi. Qayta urinib ko‘ring.' })}\n`);
      response.end();
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (response.headersSent) {
      response.end();
      return;
    }
    if (error.name === 'AbortError') {
      return sendJson(response, 504, { error: 'AI javobi uzoq ketyapti. Iltimos, qayta urinib ko‘ring.' });
    }
    if (error instanceof SyntaxError) {
      return sendJson(response, 400, { error: 'Xabar formati noto‘g‘ri.' });
    }
    if (error.message === 'So‘rov juda katta.') {
      return sendJson(response, 413, { error: error.message });
    }
    console.error('Chat request failed:', error.message);
    return sendJson(response, 500, { error: 'Serverda xatolik yuz berdi. Qayta urinib ko‘ring.' });
  }
}

function serveStatic(pathname, response) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const relativePath = decodedPath === '/' ? '/index.html' : decodedPath;
  if (relativePath.split('/').some((part) => part.startsWith('.'))) {
    response.writeHead(404).end('Not found');
    return;
  }

  const filePath = resolve(root, `.${relativePath}`);
  if (!filePath.startsWith(`${root}${sep}`) || !mimeTypes.has(extname(filePath).toLowerCase())) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    if (!statSync(filePath).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes.get(extname(filePath).toLowerCase()),
    'X-Content-Type-Options': 'nosniff'
  });
  createReadStream(filePath).pipe(response);
}

loadEnvFile();
createServer((request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost');
  if (requestUrl.pathname === '/api/chat') {
    handleChat(request, response);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }
  serveStatic(requestUrl.pathname, response);
}).listen(port, () => {
  console.log(`Market Mint is running at http://localhost:${port}`);
});
