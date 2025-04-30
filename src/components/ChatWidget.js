'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget({ config = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // API proxy URL (kendi sunucumuz üzerinden webhook'a istek göndereceğiz)

  // Mesajları en sona kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Kendi API proxy'miz üzerinden webhook'a mesajı gönder
      const proxyUrl = '/api/webhook-proxy';

      const data = {
        message: userMessage.text,
        timestamp: userMessage.timestamp,
        widgetId: config.widgetId || 'default',
        metadata: config.metadata || {}
      };

      // API proxy'ye istek gönder
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setIsLoading(false);

      if (!response.ok) {
        throw new Error('Webhook isteği başarısız oldu');
      }

      // Webhook yanıtını ekle (opsiyonel)
      // const data = await response.json();
      // if (data.reply) {
      //   const botMessage = {
      //     id: Date.now() + 1,
      //     text: data.reply,
      //     sender: 'bot',
      //     timestamp: new Date().toISOString()
      //   };
      //   setMessages(prev => [...prev, botMessage]);
      // }

    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      setIsLoading(false);

      // Hata mesajını ekle
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.',
        sender: 'system',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  return (
    <div className='widgetContainer'>
      <button
        onClick={toggleWidget}
        className='widgetButton'
        aria-label="Chat'i aç/kapat"
      >
        💬
      </button>

      {isOpen && (
        <div className='chatBox'>
          <div className='chatHeader'>
            <h3 className='chatTitle'>{config.title || 'Chat Desteği'}</h3>
            <button
              onClick={toggleWidget}
              className='closeButton'
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>

          <div className='messagesContainer'>
            {messages.length === 0 ? (
              <div className='welcomeMessage'>
                <p>{config.welcomeMessage || 'Merhaba! Size nasıl yardımcı olabiliriz?'}</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender}Message`}
                >
                  <div className='messageContent'>
                    {msg.text}
                  </div>
                  <div className='messageTime'>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className='message systemMessage'>
                <div className='loadingIndicator'>
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className='messageForm'>
            <input
              type="text"
              placeholder="Mesajınızı yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='chatInput'
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className='submitButton'
              disabled={isLoading}
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
