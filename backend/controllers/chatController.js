// backend/controllers/chatController.js
import { Conversation } from '../models/conversation.js'; // make sure your model exports Conversation
// If you used default export in your model use: import Conversation from '../models/conversation.js';

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

function clamp(n, min, max) {
  const num = Number(n);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

export const chat = async (req, res) => {
  const { message, sessionId: incomingSessionId, model = 'openrouter/auto', temperature = 0.7, maxTokens = 1024 } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  const sessionId = incomingSessionId || generateSessionId();

  try {
    // load or create conversation in MongoDB
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({ sessionId, messages: [] });
    }

    conversation.messages.push({ role: 'user', content: message });
    await conversation.save();

    const recentMessages = conversation.messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

    // call OpenRouter (or other LLM endpoint)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:9002',
        'X-Title': 'ChatBot',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
          ...recentMessages,
        ],
        temperature: clamp(temperature, 0, 2),
        max_tokens: Math.min(Number(maxTokens) || 1024, 4096),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error', response.status, errorData);
      return res.status(response.status).json({ error: errorData.error?.message || 'Failed to get response from AI model' });
    }

    const data = await response.json();

    // robust extraction of assistant text
    const assistantMessage =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      String(data);

    conversation.messages.push({ role: 'assistant', content: assistantMessage });
    await conversation.save();

    return res.json({
      sessionId,
      message: assistantMessage,
      usage: data.usage ?? null,
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? String(err) : undefined });
  }
};

export const streamChat = async (req, res) => {
  const { message, sessionId: incomingSessionId, model = 'openrouter/auto', temperature = 0.7, maxTokens = 1024 } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  const sessionId = incomingSessionId || generateSessionId();

  try {
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({ sessionId, messages: [] });
    }
    conversation.messages.push({ role: 'user', content: message });
    await conversation.save();

    const recentMessages = conversation.messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // warm up the stream
    res.write(':ok\n\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:9002',
        'X-Title': 'ChatBot',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
          ...recentMessages,
        ],
        temperature: clamp(temperature, 0, 2),
        max_tokens: Math.min(Number(maxTokens) || 1024, 4096),
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const errBody = await response.text().catch(() => '');
      console.error('OpenRouter stream error', response.status, errBody);
      res.write(`data: ${JSON.stringify({ error: 'Failed to connect to AI model' })}\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // parse streaming lines (OpenRouter often emits "data: {...}\n\n")
        const lines = chunk.split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          // ignore sentinel
          if (trimmed === 'data: [DONE]' || trimmed === '[DONE]') continue;

          let jsonStr = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed?.choices?.[0]?.delta?.content ?? parsed?.choices?.[0]?.message?.content ?? parsed?.choices?.[0]?.text;
            if (deltaContent) {
              fullMessage += deltaContent;
              res.write(`data: ${JSON.stringify({ content: deltaContent })}\n\n`);
            }
          } catch (parseErr) {
            // fallback: forward raw chunk
            fullMessage += jsonStr;
            res.write(`data: ${JSON.stringify({ content: jsonStr })}\n\n`);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    conversation.messages.push({ role: 'assistant', content: fullMessage });
    await conversation.save();

    res.write(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`);
    return res.end();
  } catch (err) {
    console.error('Stream endpoint error:', err);
    try {
      res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
      res.end();
    } catch (_) {}
  }
};
