;(function () {
  const defaultConfig = {
    widgetId: 'default',
    baseUrl: window.location.hostname === 'localhost' 
      ? 'http://localhost:3002' 
      : 'https://appointment-widget-umber.vercel.app',
    dbName: 'default_db'
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
    
    // URL parametrelerine dbName'i de ekle
    const urlParams = new URLSearchParams({
      widgetId: config.widgetId,
      dbName: config.dbName
    });
    iframe.src = `${config.baseUrl}/widget/chat?${urlParams.toString()}`;

    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '350px';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.outline = 'none';
    iframe.style.background = 'transparent';

    // Mobile responsive
    if (window.innerWidth <= 768) {
      iframe.style.width = '90vw';
      iframe.style.height = '70vh';
      iframe.style.right = '5vw';
      iframe.style.bottom = '10px';
    }

    document.body.appendChild(iframe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();