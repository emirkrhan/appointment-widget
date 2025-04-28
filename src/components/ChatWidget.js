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
    <div className='widgetContainer'>
      <button
        onClick={toggleWidget}
        className='widgetButton'
      >
        💬
      </button>

      {isOpen && (
        <div className={styles.chatBox}>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Mesajınızı yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='chatInput'
              required
            />
            <button
              type="submit"
              className='submitButton'
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
