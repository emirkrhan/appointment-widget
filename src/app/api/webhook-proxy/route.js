export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Debug: Gelen verileri konsola bas
    console.log('=== WEBHOOK PROXY - GELEN VERİ ===');
    console.log('Input:', body.input);
    console.log('DbName:', body.dbName);
    console.log('ConversationId:', body.conversationId);
    console.log('WidgetId:', body.widgetId);
    console.log('Timestamp:', body.timestamp);
    console.log('=====================================');
    
    // Mastra Cloud API endpoint'i
    const mastraApiUrl = 'https://white-screeching-school.mastra.cloud/api/agents/myAgent/generate';

    // Mastra Cloud API'ye gönderilecek data formatı
    const requestData = {
      input: body.input,
      conversationId: body.conversationId || "default_conversation",
      // Mastra Cloud API'nin beklediği diğer parametreler varsa buraya ekleyin
    };

    // Debug: Mastra API'ye gönderilen veriyi bas
    console.log('=== MASTRA API\'YE GÖNDERİLEN VERİ ===');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('URL:', mastraApiUrl);
    console.log('====================================');

    const response = await fetch(mastraApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Mastra Cloud API için gerekli auth header'ları varsa buraya ekleyin
        // 'Authorization': 'Bearer YOUR_API_KEY',
      },
      body: JSON.stringify(requestData),
    });

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    };

    if (!response.ok) {
      console.error('Mastra API response error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Mastra API\'sine bağlanılamadı' }),
        { status: response.status, headers }
      );
    }

    // Mastra API'den gelen yanıt
    const responseData = await response.json();
    
    // Debug: Mastra API'den gelen cevabı bas
    console.log('=== MASTRA API\'DEN GELEN CEVAP ===');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('==================================');
    
    // Mastra API'den gelen yanıtı widget'a uygun formata dönüştür
    const widgetResponse = {
      response: responseData.text || responseData.response || responseData.message || 'Yanıt alındı',
      // Mastra API'den gelen diğer veriler varsa buraya ekleyin
      data: responseData
    };
    
    return new Response(JSON.stringify(widgetResponse), { status: 200, headers });
    
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Bir hata oluştu' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}