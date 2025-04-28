(function() {
  function loadCSS() {
    if (document.getElementById('chat-widget-style')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://appointment-widget-umber.vercel.app/widget/widget.css'; // kendi vercel url'ini yaz
    link.id = 'chat-widget-style';
    document.head.appendChild(link);
  }

  function loadReactAndMount() {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
      console.error('React veya ReactDOM yüklü değil.');
      return;
    }

    if (!document.getElementById('chat-widget-container')) {
      const container = document.createElement('div');
      container.id = 'chat-widget-container';
      document.body.appendChild(container);

      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement('div', null,
          React.createElement('button', {
            id: 'chat-widget-button',
            onClick: function() {
              alert('Chat açıldı!');
            }
          }, '💬')
        )
      );
    }
  }

  function loadScript(src, onLoad) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = onLoad;
    script.async = true;
    document.head.appendChild(script);
  }

  loadCSS();

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
