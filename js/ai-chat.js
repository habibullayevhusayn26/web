const chatForm = document.querySelector('[data-chat-form]');
const chatInput = document.querySelector('[data-chat-input]');
const chatMessages = document.querySelector('[data-chat-messages]');
const chatStatus = document.querySelector('[data-chat-status]');
const chatSendButton = document.querySelector('[data-chat-send]');
const chatResetButton = document.querySelector('[data-chat-reset]');
const chatSuggestions = [...document.querySelectorAll('[data-chat-prompt]')];
const chatHistory = [];
const chatGreeting = 'Salom! Market Mint va Telegram NFT giftlari haqida savollaringizga yordam beraman.';

function addChatMessage(text, role) {
  const message = document.createElement('div');
  message.className = `ai-chat-message ai-chat-message-${role}`;

  const label = document.createElement('span');
  label.className = 'ai-chat-message-label';
  label.textContent = role === 'user' ? 'Siz' : 'Market Mint AI';

  const content = document.createElement('p');
  content.textContent = text;
  message.append(label, content);
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function setChatStatus(message, isError = false) {
  chatStatus.textContent = message;
  chatStatus.classList.toggle('is-error', isError);
}

function resetChat() {
  chatHistory.length = 0;
  chatMessages.replaceChildren();
  addChatMessage(chatGreeting, 'assistant');
  setChatStatus('AI javoblari Gemini bepul limitiga bog‘liq.');
  chatInput.focus();
}

async function sendChatMessage(messageText) {
  const message = messageText.trim();
  if (!message || chatSendButton.disabled) return;

  chatSuggestions.forEach((suggestion) => { suggestion.hidden = true; });
  addChatMessage(message, 'user');
  chatHistory.push({ role: 'user', text: message });
  chatInput.value = '';
  chatInput.style.height = '';
  chatSendButton.disabled = true;
  setChatStatus('Gemini javob tayyorlamoqda...');

  const typingMessage = addChatMessage('Javob yozilmoqda', 'assistant');
  typingMessage.classList.add('ai-chat-typing');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-12) })
    });
    if (!response.ok) {
      const errorText = await response.text();
      let result = {};
      try {
        result = JSON.parse(errorText);
      } catch {
        result = {};
      }
      throw new Error(result.error || `AI server HTTP ${response.status} xato qaytardi.`);
    }

    const replyElement = typingMessage.querySelector('p');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let reply = '';
    const readLine = (line) => {
      if (!line.trim()) return;
      const chunk = JSON.parse(line);
      if (chunk.error) throw new Error(chunk.error);
      if (typeof chunk.text !== 'string') return;
      reply += chunk.text;
      typingMessage.classList.remove('ai-chat-typing');
      replyElement.textContent = reply;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    while (true) {
      const { value, done } = await reader.read();
      pending += decoder.decode(value, { stream: !done });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() || '';
      lines.forEach(readLine);
      if (done) break;
    }
    if (pending.trim()) readLine(pending);
    if (!reply) throw new Error('Gemini bo‘sh javob qaytardi. Qayta urinib ko‘ring.');

    chatHistory.push({ role: 'assistant', text: reply });
    setChatStatus('Gemini AI');
  } catch (error) {
    typingMessage.remove();
    chatHistory.pop();
    const errorMessage = error instanceof TypeError
      ? 'AI serverga ulanib bo‘lmadi. Terminalda node server.mjs buyrug‘ini ishga tushiring.'
      : error.message || 'Ulanishda xatolik yuz berdi. Qayta urinib ko‘ring.';
    addChatMessage(errorMessage, 'assistant');
    setChatStatus('Xabar yuborilmadi.', true);
  } finally {
    chatSendButton.disabled = false;
    chatInput.focus();
  }
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendChatMessage(chatInput.value);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
});

chatSuggestions.forEach((suggestion) => {
  suggestion.addEventListener('click', () => sendChatMessage(suggestion.dataset.chatPrompt));
});

chatResetButton.addEventListener('click', resetChat);
