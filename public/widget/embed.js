(function() {
    function loadReactAndMount() {
      if (!window.React || !window.ReactDOM || !window.ReactDOM.createRoot) {
        console.error('React veya ReactDOM yüklü değil.');
        return;
      }
  
      import('/_next/static/chunks/app/widget/page.js').then(() => {
        // Sayfanın JS chunk'ı yüklendikten sonra mount işlemi
        if (window.mountChatWidget) {
          const projectId = document.currentScript.getAttribute('data-project-id') || 'default';
          window.mountChatWidget({ projectId });
        } else {
          console.error('mountChatWidget bulunamadı.');
        }
      });
    }
  
    if (document.readyState === 'complete') {
      loadReactAndMount();
    } else {
      window.addEventListener('load', loadReactAndMount);
    }
  })();
  