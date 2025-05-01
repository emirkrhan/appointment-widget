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
    const webhookUrl = 'https://meftofficial2.app.n8n.cloud/webhook/f198089d-ee62-4f30-bf20-c870f5ce185f';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    };

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Webhook isteği başarısız oldu' }),
        { status: response.status, headers }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (error) {
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
