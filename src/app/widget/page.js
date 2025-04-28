'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Widget = dynamic(() => import('../../components/Widget'), { ssr: false });

export default function WidgetPage() {
  useEffect(() => {
    window.initWidget = () => {
      const widgetContainer = document.createElement('div');
      document.body.appendChild(widgetContainer);
      import('react-dom').then((ReactDOM) => {
        ReactDOM.render(<Widget />, widgetContainer);
      });
    };

    window.widgetConfig = {
      businessId: document.currentScript?.getAttribute('data-business-id') || 'default',
    };

    window.initWidget();
  }, []);

  return null;
}