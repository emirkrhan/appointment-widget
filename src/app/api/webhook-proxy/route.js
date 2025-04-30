export async function POST(request) {
  try {
    // İstek gövdesini al
    const body = await request.json();
    
    // Webhook URL
    const webhookUrl = 'https://meftofficial2.app.n8n.cloud/webhook/f198089d-ee62-4f30-bf20-c870f5ce185f';
    
    // Webhook'a istek gönder
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Yanıtı kontrol et
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Webhook isteği başarısız oldu' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Başarılı yanıt
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook proxy hatası:', error);
    
    // Hata yanıtı
    return new Response(
      JSON.stringify({ error: error.message || 'Bir hata oluştu' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
