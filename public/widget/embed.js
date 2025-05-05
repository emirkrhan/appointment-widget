;(function () {
  const defaultConfig = {
    widgetId: 'default',
    baseUrl: 'https://appointment-widget-umber.vercel.app', // Next.js domain
  };

  let config = {};
  if (window.ChatWidgetConfig) {
    config = Object.assign({}, defaultConfig, window.ChatWidgetConfig);
  } else {
    config = defaultConfig;
  }

  function mountWidget() {
    if (document.getElementById('chat-widget-iframe')) return;

    const iframe = document.createElement('iframe');
    iframe.id = 'chat-widget-iframe';
    iframe.src = `${config.baseUrl}/widget/chat?widgetId=${config.widgetId}`;

    // Temiz iframe: dışarıdan hiçbir stil yok
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '350px';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.outline = 'none';
    iframe.style.background = 'transparent'; // Bazı tarayıcılarda emin olmak için

    document.body.appendChild(iframe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();
changed