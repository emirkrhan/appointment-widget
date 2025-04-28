'use client';

import { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // İleride buraya API endpoint'in gelecek
      /*
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      */
      console.log('Mesaj gönderildi:', message);
      setMessage('');
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={toggleWidget}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: '10px',
            width: '300px',
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          <form onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Mesajınızı yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '10px',
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
