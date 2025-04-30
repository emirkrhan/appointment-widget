# Chat Widget

Bu proje, herhangi bir web sitesine kolayca entegre edilebilen bir chat widget'ı sağlar. Kullanıcılar, bu widget aracılığıyla mesaj gönderebilir ve webhook entegrasyonu sayesinde bu mesajlar belirtilen bir endpoint'e iletilir.

## Özellikler

- Kolay entegrasyon (tek bir script etiketi ile)
- Özelleştirilebilir arayüz
- Webhook entegrasyonu
- Responsive tasarım
- Saf JavaScript ile çalışır (harici kütüphane gerektirmez)
- Mesaj geçmişi

## Kurulum ve Geliştirme

Bu proje [Next.js](https://nextjs.org) ile geliştirilmiştir. Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak sonucu görebilirsiniz.

## Web Sitenize Entegre Etme

Widget'ı web sitenize entegre etmek için, aşağıdaki kodu sayfanızın `<body>` etiketinin kapanışından hemen önce ekleyin:

```html
<!-- Chat Widget -->
<script>
  window.ChatWidgetConfig = {
    title: 'Destek Hattı',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabiliriz?',
    widgetId: 'my-website',
    metadata: {
      page: window.location.pathname
    }
  };
</script>
<script src="https://appointment-widget-umber.vercel.app/widget/embed.js" async></script>
```

> **Not:** URL'yi kendi Vercel deployment URL'iniz ile değiştirin.

## Özelleştirme

Widget'ı özelleştirmek için `window.ChatWidgetConfig` nesnesini kullanabilirsiniz:

```javascript
window.ChatWidgetConfig = {
  // Widget başlığı
  title: 'Destek Hattı',

  // Karşılama mesajı
  welcomeMessage: 'Merhaba! Size nasıl yardımcı olabiliriz?',

  // Widget kimliği (istatistikler için)
  widgetId: 'my-website',

  // Ek meta veriler (isteğe bağlı)
  metadata: {
    page: window.location.pathname,
    userType: 'visitor'
  }
};
```

## JavaScript API

Widget yüklendikten sonra, JavaScript API'sini kullanarak widget'ı kontrol edebilirsiniz:

```javascript
// Widget'ı aç
ChatWidget.open();

// Widget'ı kapat
ChatWidget.close();

// Widget'ı aç/kapat
ChatWidget.toggle();

// Yapılandırmayı güncelle
ChatWidget.setConfig({
  title: 'Yeni Başlık',
  welcomeMessage: 'Yeni karşılama mesajı'
});
```

## Webhook Entegrasyonu

Widget, kullanıcı mesajlarını aşağıdaki webhook URL'ine gönderir:

```
https://meftofficial2.app.n8n.cloud/webhook/f198089d-ee62-4f30-bf20-c870f5ce185f
```

Gönderilen veri formatı:

```json
{
  "message": "Kullanıcı mesajı",
  "timestamp": "2023-06-15T12:34:56.789Z",
  "widgetId": "my-website",
  "metadata": {
    "page": "/contact",
    "userType": "visitor"
  }
}
```

### CORS Sorunları ve Çözümleri

Widget, farklı bir domain'den webhook'a istek gönderirken CORS (Cross-Origin Resource Sharing) hatalarıyla karşılaşabilir. Bu projede, bu sorunu çözmek için kendi API proxy'mizi kullanıyoruz:

1. **Sunucu Taraflı API Proxy**

   Bu projede, Next.js API route kullanarak kendi proxy sunucumuzu oluşturduk. Bu sayede, client tarafından gelen istekleri sunucu tarafında webhook'a iletiyoruz. Bu yöntem, CORS kısıtlamalarını aşmanın en güvenilir yoludur.

   ```javascript
   // Client tarafında
   const proxyUrl = '/api/webhook-proxy';

   fetch(proxyUrl, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
   });

   // Sunucu tarafında (API route)
   export async function POST(request) {
     const body = await request.json();
     const webhookUrl = 'https://meftofficial2.app.n8n.cloud/webhook/...';

     const response = await fetch(webhookUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body)
     });

     // Yanıtı client'a ilet
     return new Response(JSON.stringify({ success: true }));
   }
   ```

2. **Webhook Sağlayıcısında CORS Ayarlarını Yapılandırma**

   Eğer webhook sağlayıcınızın (n8n.cloud) CORS ayarlarını yapılandırma imkanınız varsa, belirli domain'lerden gelen isteklere izin verebilirsiniz. Genellikle şu ayarları yapmanız gerekir:

   - Access-Control-Allow-Origin: Sizin domain'iniz veya "*" (tüm domainlere izin vermek için)
   - Access-Control-Allow-Methods: POST
   - Access-Control-Allow-Headers: Content-Type

## Örnek

Widget'ın nasıl çalıştığını görmek için `/widget/example.html` sayfasını ziyaret edebilirsiniz.

## Dağıtım

Bu projeyi Vercel'e dağıtmak için:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fchat-widget)

Daha fazla bilgi için [Next.js dağıtım belgelerine](https://nextjs.org/docs/app/building-your-application/deploying) göz atabilirsiniz.
