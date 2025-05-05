'use client';

import { useState } from 'react';

export default function ChatPage({ searchParams }) {
  const widgetId = searchParams.widgetId || 'default';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          timestamp: userMessage.timestamp,
          widgetId,
          metadata: {},
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Mesaj gönderilemedi');

      // Success mesajını ekleyebilirsin istersen
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
          sender: 'system',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'sans-serif',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ backgroundColor: '#4A90E2', padding: '12px', color: '#fff' }}>
        <strong>Chat Desteği</strong>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#f9f9f9' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '8px',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '16px',
              backgroundColor: msg.sender === 'user' ? '#4A90E2' : '#e0e0e0',
              color: msg.sender === 'user' ? '#fff' : '#000',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <p>Yükleniyor...</p>}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{ flex: 1, padding: '10px', border: 'none' }}
          required
        />
        <button
          type="submit"
          style={{
            background: '#4A90E2',
            color: '#fff',
            border: 'none',
            padding: '0 16px',
            cursor: 'pointer',
          }}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
