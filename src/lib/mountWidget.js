import { createRoot } from 'react-dom/client';
import ChatWidget from '@/components/ChatWidget';

export function mountChatWidget(config = {}) {
  if (document.getElementById('chat-widget-container')) {
    return; // Zaten eklendi
  }

  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ChatWidget config={config} />);
}
