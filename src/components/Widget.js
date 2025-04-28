import { useState } from 'react';

export default function Widget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', date: '', time: '' });

  const toggleWidget = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessId = window?.widgetConfig?.businessId || 'default';
    try {
      const response = await fetch('https://your-backend.com/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, businessId }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Randevunuz alındı! ${result.aiMessage || 'Teşekkürler!'}`);
        setFormData({ name: '', date: '', time: '' });
        setIsOpen(false);
      } else {
        alert('Hata oluştu.');
      }
    } catch (error) {
      alert('Bağlantı hatası.');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={toggleWidget}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Randevu Al
      </button>
      {isOpen && (
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            marginTop: '10px',
            width: '300px',
          }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#007bff',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Randevu Oluştur
            </button>
          </form>
        </div>
      )}
    </div>
  );
}