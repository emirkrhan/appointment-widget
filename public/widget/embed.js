(function() {
    function loadReactAndMount() {
      if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React veya ReactDOM yüklü değil.');
        return;
      }
  
      const container = document.createElement('div');
      container.id = 'my-chat-widget-container';
      document.body.appendChild(container);
  
      const root = ReactDOM.createRoot(container);
  
      root.render(
        React.createElement('div', { style: { position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } },
          React.createElement('button', { onClick: () => alert('Chat açıldı!') }, 'Chat Başlat')
        )
      );
    }
  
    function loadScript(src, onLoad) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onLoad;
      script.async = true;
      document.head.appendChild(script);
    }
  
    if (typeof React === 'undefined') {
      loadScript('https://unpkg.com/react@18/umd/react.production.min.js', () => {
        if (typeof ReactDOM === 'undefined') {
          loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', loadReactAndMount);
        } else {
          loadReactAndMount();
        }
      });
    } else if (typeof ReactDOM === 'undefined') {
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', loadReactAndMount);
    } else {
      loadReactAndMount();
    }
  })();
  