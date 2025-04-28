'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createRoot } from 'react-dom/client';

const Widget = dynamic(() => import('../../components/Widget'), { ssr: false });

export default function WidgetPage() {
  useEffect(() => {
    window.initWidget = () => {
      const widgetContainer = document.createElement('div');
      document.body.appendChild(widgetContainer);
      const root = createRoot(widgetContainer);
      root.render(<Widget />);
    };

    window.widgetConfig = {
      businessId: document.currentScript?.getAttribute('data-business-id') || 'default',
    };

    window.initWidget();
  }, []);

  return null;
}