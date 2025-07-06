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
    
    const webhookUrl = 'http://localhost:3001/save-step';

    const requestData = {
      input: body.input,
      conversationId: body.conversationId,
      dbName: body.dbName
    };

    // Debug: Backend'e gönderilen veriyi de bas
    console.log('=== BACKEND\'E GÖNDERİLEN VERİ ===');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('URL:', webhookUrl);
    console.log('==================================');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    };

    if (!response.ok) {
      console.error('Backend response error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Backend API\'sine bağlanılamadı' }),
        { status: response.status, headers }
      );
    }

    // Backend'den gelen gerçek cevabı al ve döndür
    const responseData = await response.json();
    
    // Debug: Backend'den gelen cevabı da bas
    console.log('=== BACKEND\'DEN GELEN CEVAP ===');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('===============================');
    
    return new Response(JSON.stringify(responseData), { status: 200, headers });
    
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
