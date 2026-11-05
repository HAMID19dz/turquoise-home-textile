import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analytics, trackEvent } from '@/utils/analytics';
import { siteConfig } from '@/config/site';

describe('Milestone M5: Telemetry & Analytics Dispatcher', () => {
  beforeEach(() => {
    analytics.clear();
    siteConfig.enableAnalytics = true;
  });

  it('tracks structured events and appends to in-memory history', () => {
    trackEvent('viewer_open', { productId: 'leather-armchair', color: '#8B4513' });
    trackEvent('color_change', { productId: 'leather-armchair', color: '#1B4332' });

    const history = analytics.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].name).toBe('viewer_open');
    expect(history[0].payload).toEqual({ productId: 'leather-armchair', color: '#8B4513' });
    expect(history[1].name).toBe('color_change');
    expect(history[1].payload).toEqual({ productId: 'leather-armchair', color: '#1B4332' });
  });

  it('delivers events to active subscribers and allows unsubscribing', () => {
    const subscriber = vi.fn();
    const unsubscribe = analytics.subscribe(subscriber);

    trackEvent('quote_inquiry', {
      source: 'product_card',
      productId: 'boucle-sofa',
      phone: '+213556929134',
    });

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'quote_inquiry',
        payload: {
          source: 'product_card',
          productId: 'boucle-sofa',
          phone: '+213556929134',
        },
      })
    );

    unsubscribe();
    trackEvent('cart_add', { productId: 'coffee-table' });
    expect(subscriber).toHaveBeenCalledTimes(1); // Not called again after unsubscribing
  });

  it('respects siteConfig.enableAnalytics when disabled', () => {
    siteConfig.enableAnalytics = false;

    trackEvent('quote_inquiry', { source: 'customizer' });
    expect(analytics.getHistory().length).toBe(0);
  });
});
