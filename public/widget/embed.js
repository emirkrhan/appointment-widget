(function() {
  // Widget yapılandırması
  const defaultConfig = {
    title: 'Chat Desteği',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabiliriz?',
    widgetId: 'default',
    metadata: {},
    baseUrl: 'https://appointment-widget-umber.vercel.app' // Kendi Vercel URL'inizi buraya yazın
  };

  let config = {};

  // Global yapılandırma nesnesini kontrol et
  if (window.ChatWidgetConfig) {
    config = Object.assign({}, defaultConfig, window.ChatWidgetConfig);
  } else {
    config = defaultConfig;
  }

  // CSS yükle
  function loadCSS() {
    if (document.getElementById('chat-widget-style')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${config.baseUrl}/widget/widget.css`;
    link.id = 'chat-widget-style';
    document.head.appendChild(link);
  }

  // API proxy URL'i (kendi sunucumuz üzerinden webhook'a istek göndereceğiz)

  // Widget HTML'ini oluştur
  function createWidgetHTML() {
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.className = 'widgetContainer';

    // Widget buton
    const button = document.createElement('button');
    button.className = 'widgetButton';
    button.setAttribute('aria-label', "Chat'i aç/kapat");
    button.innerHTML = '💬';

    // Chat kutusu (başlangıçta gizli)
    const chatBox = document.createElement('div');
    chatBox.className = 'chatBox';
    chatBox.style.display = 'none';

    // Chat başlık
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chatHeader';

    const chatTitle = document.createElement('h3');
    chatTitle.className = 'chatTitle';
    chatTitle.textContent = config.title;

    const closeButton = document.createElement('button');
    closeButton.className = 'closeButton';
    closeButton.setAttribute('aria-label', 'Kapat');
    closeButton.textContent = '✕';

    chatHeader.appendChild(chatTitle);
    chatHeader.appendChild(closeButton);

    // Mesajlar konteyner
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'messagesContainer';

    // Karşılama mesajı
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcomeMessage';
    welcomeMessage.innerHTML = `<p>${config.welcomeMessage}</p>`;
    messagesContainer.appendChild(welcomeMessage);

    // Mesaj formu
    const messageForm = document.createElement('form');
    messageForm.className = 'messageForm';

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'Mesajınızı yazın...';
    chatInput.className = 'chatInput';
    chatInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submitButton';
    submitButton.textContent = 'Gönder';

    messageForm.appendChild(chatInput);
    messageForm.appendChild(submitButton);

    // Tüm elemanları birleştir
    chatBox.appendChild(chatHeader);
    chatBox.appendChild(messagesContainer);
    chatBox.appendChild(messageForm);

    container.appendChild(button);
    container.appendChild(chatBox);

    return {
      container,
      button,
      chatBox,
      messagesContainer,
      messageForm,
      chatInput,
      submitButton,
      closeButton
    };
  }

  // Widget'ı monte et ve olay dinleyicileri ekle
  function mountWidget() {
    if (document.getElementById('chat-widget-container')) return;

    const elements = createWidgetHTML();
    document.body.appendChild(elements.container);

    // Mesaj geçmişi
    const messages = [];
    let isLoading = false;

    // Widget açma/kapama
    function toggleWidget() {
      const isOpen = elements.chatBox.style.display !== 'none';
      elements.chatBox.style.display = isOpen ? 'none' : 'flex';

      if (!isOpen) {
        // Widget açıldığında input'a odaklan
        setTimeout(() => elements.chatInput.focus(), 100);
      }
    }

    // Mesajları görüntüle
    function renderMessages() {
      // Karşılama mesajını temizle
      if (messages.length > 0) {
        elements.messagesContainer.innerHTML = '';
      }

      // Mesajları ekle
      messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}Message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'messageContent';
        contentDiv.textContent = msg.text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'messageTime';
        timeDiv.textContent = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        elements.messagesContainer.appendChild(messageDiv);
      });

      // Yükleniyor göstergesi
      if (isLoading) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message systemMessage';

        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loadingIndicator';
        loadingIndicator.innerHTML = '<span>●</span><span>●</span><span>●</span>';

        loadingDiv.appendChild(loadingIndicator);
        elements.messagesContainer.appendChild(loadingDiv);
      }

      // Mesajların sonuna kaydır
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }

    // Mesaj gönder
    async function sendMessage(e) {
      e.preventDefault();

      const messageText = elements.chatInput.value.trim();
      if (!messageText || isLoading) return;

      // Kullanıcı mesajını ekle
      const userMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      messages.push(userMessage);
      elements.chatInput.value = '';
      isLoading = true;

      renderMessages();

      try {
        const proxyUrl = `${defaultConfig.baseUrl}/api/webhook-proxy`;

        const data = {
          message: userMessage.text,
          timestamp: userMessage.timestamp,
          widgetId: config.widgetId,
          metadata: config.metadata
        };

        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Webhook isteği başarısız oldu');
        }

        isLoading = false;
        console.log('Mesaj başarıyla gönderildi');

      } catch (error) {
        console.error('Mesaj gönderilemedi:', error);
        isLoading = false;

        // Hata mesajını ekle
        messages.push({
          id: Date.now() + 1,
          text: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.',
          sender: 'system',
          timestamp: new Date().toISOString()
        });
      }

      renderMessages();
    }

    elements.button.addEventListener('click', toggleWidget);
    elements.closeButton.addEventListener('click', toggleWidget);
    elements.messageForm.addEventListener('submit', sendMessage);

    // Dışarıya API aç
    window.ChatWidget = {
      open: function() {
        elements.chatBox.style.display = 'flex';
      },
      close: function() {
        elements.chatBox.style.display = 'none';
      },
      toggle: toggleWidget,
      setConfig: function(newConfig) {
        config = Object.assign({}, config, newConfig);
        if (newConfig.title) {
          elements.chatTitle.textContent = newConfig.title;
        }
      }
    };
  }

  // CSS yükle ve widget'ı monte et
  loadCSS();

  // DOM yüklendikten sonra widget'ı monte et
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();
