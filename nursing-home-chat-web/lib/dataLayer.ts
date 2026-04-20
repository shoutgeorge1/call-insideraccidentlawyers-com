import { PRIMARY_TEL_HREF } from './site';

export function pushDataLayerPayload(data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function pushDataLayerEvent(event: string): void {
  pushDataLayerPayload({ event });
}

/** Matches other Insider LPs: call_clicked + phone_click with number for GTM. */
export function trackTelClick(href: string = PRIMARY_TEL_HREF): void {
  const phone_number = href.replace(/^tel:/i, '');
  pushDataLayerPayload({ event: 'call_clicked' });
  pushDataLayerPayload({ event: 'phone_click', phone_number });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
