'use client';

import { useEffect } from 'react';
import { mountChatWidget } from '@/lib/mountWidget';

export default function WidgetPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mountChatWidget = mountChatWidget;
    }
  }, []);

  return null;
}
