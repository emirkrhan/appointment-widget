;(function () {
  const defaultConfig = {
    widgetId: 'default',
    baseUrl: window.location.hostname === 'localhost' 
      ? 'http://localhost:3002' 
      : 'https://appointment-widget-umber.vercel.app',
    dbName: 'default_db',
    title: 'AI Asistan',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?'
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
    
    // URL parametrelerine dbName ve diğer config değerlerini ekle
    const urlParams = new URLSearchParams({
      widgetId: config.widgetId,
      dbName: config.dbName,
      title: config.title,
      welcomeMessage: config.welcomeMessage
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
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';

    // Mobile responsive
    if (window.innerWidth <= 768) {
      iframe.style.width = '90vw';
      iframe.style.height = '70vh';
      iframe.style.right = '5vw';
      iframe.style.bottom = '10px';
    }

    // Resize event listener for mobile
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 768) {
        iframe.style.width = '90vw';
        iframe.style.height = '70vh';
        iframe.style.right = '5vw';
        iframe.style.bottom = '10px';
      } else {
        iframe.style.width = '350px';
        iframe.style.height = '500px';
        iframe.style.right = '20px';
        iframe.style.bottom = '20px';
      }
    });

    document.body.appendChild(iframe);

    // Global API for widget control
    window.ChatWidget = {
      open: function() {
        iframe.style.display = 'block';
      },
      close: function() {
        iframe.style.display = 'none';
      },
      toggle: function() {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
      },
      setConfig: function(newConfig) {
        config = Object.assign({}, config, newConfig);
        // Reload iframe with new config
        const urlParams = new URLSearchParams({
          widgetId: config.widgetId,
          dbName: config.dbName,
          title: config.title,
          welcomeMessage: config.welcomeMessage
        });
        iframe.src = `${config.baseUrl}/widget/chat?${urlParams.toString()}`;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();