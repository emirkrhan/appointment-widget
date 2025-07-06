'use client'

import { useState, useRef, useEffect, use } from 'react'

export default function ChatWidget ({ searchParams }) {
  const resolvedSearchParams = use(searchParams)
  const widgetId = resolvedSearchParams?.widgetId || 'default'
  const dbName = resolvedSearchParams?.dbName || 'default_db'
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage (e) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userMessage.text,
          conversationId: "389JWDIJ89AWIODOAWDA",
          dbName: dbName,
          widgetId: widgetId,
          timestamp: userMessage.timestamp
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Mesaj gönderilemedi')

      // API'den gelen gerçek cevabı kullan
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || data.message || 'Mesajınız alındı! 🎉',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          text: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
          sender: 'system',
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#4A90E2',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999
        }}
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '300px',
            height: '400px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999
          }}
        >
          {/* Başlık */}
          <div
            style={{
              backgroundColor: '#4A90E2',
              color: '#fff',
              padding: '12px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Destek
          </div>

          {/* Mesajlar */}
          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              background: '#f9f9f9'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '8px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '16px',
                    backgroundColor:
                      msg.sender === 'user'
                        ? '#4A90E2'
                        : msg.sender === 'bot'
                        ? '#e0e0e0'
                        : '#ffcccc',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    fontSize: '14px'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <p>Yükleniyor...</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            style={{
              display: 'flex',
              borderTop: '1px solid #ddd'
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Mesajınızı yazın...'
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                fontSize: '14px'
              }}
              required
            />
            <button
              type='submit'
              style={{
                background: '#4A90E2',
                color: '#fff',
                border: 'none',
                padding: '0 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
