import { siteConfig } from '@/config/site';

export type AnalyticsEventName =
  | 'quote_inquiry'
  | 'viewer_open'
  | 'viewer_close'
  | 'color_change'
  | 'lighting_toggle'
  | 'customizer_step'
  | 'customizer_preset'
  | 'cart_add'
  | 'cart_remove'
  | 'cart_clear'
  | 'cart_open'
  | 'compare_add'
  | 'compare_remove'
  | 'compare_open'
  | 'share_click'
  | 'fabric_macro_view'
  | 'brand_crest_view';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  timestamp: number;
  payload: Record<string, unknown>;
}

type AnalyticsListener = (event: AnalyticsEvent) => void;

class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private listeners: Set<AnalyticsListener> = new Set();
  private maxHistory = 100;

  /**
   * Dispatches a structured analytics event.
   */
  public track(name: AnalyticsEventName, payload: Record<string, unknown> = {}): void {
    if (!siteConfig.enableAnalytics) return;

    const event: AnalyticsEvent = {
      name,
      timestamp: Date.now(),
      payload,
    };

    // Keep bounded history
    this.events.push(event);
    if (this.events.length > this.maxHistory) {
      this.events.shift();
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.warn('[Analytics] Listener error:', err);
      }
    });

    // Forward to window.dataLayer if available (Google Analytics 4 / GTM)
    if (typeof window !== 'undefined' && Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer)) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: name,
        ...payload,
      });
    }

    // Dev logging
    if (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      console.debug(`[Analytics 📊] ${name}`, payload);
    }
  }

  /**
   * Subscribes a listener to analytics events.
   * Returns an unsubscribe callback.
   */
  public subscribe(listener: AnalyticsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Retrieves recent recorded event history.
   */
  public getHistory(): readonly AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clears event history (useful for test isolation).
   */
  public clear(): void {
    this.events = [];
    this.listeners.clear();
  }
}

export const analytics = new AnalyticsManager();

export const trackEvent = (name: AnalyticsEventName, payload?: Record<string, unknown>): void => {
  analytics.track(name, payload);
};
