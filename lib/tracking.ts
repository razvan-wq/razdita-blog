'use client';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackCTAClick(postSlug: string, ctaType: string, ctaUrl: string): void {
  window.gtag?.('event', 'cta_click', {
    post_slug: postSlug,
    cta_type: ctaType,
    cta_url: ctaUrl,
  });
}

export function trackLeadMagnetDownload(postSlug: string, leadMagnetId: string, leadMagnetTitle: string): void {
  window.gtag?.('event', 'lead_magnet_download', {
    post_slug: postSlug,
    lead_magnet_id: leadMagnetId,
    lead_magnet_title: leadMagnetTitle,
  });
}

export function trackScrollDepth(postSlug: string, percentage: number): void {
  window.gtag?.('event', 'scroll_depth', {
    post_slug: postSlug,
    depth_percentage: percentage,
  });
}

export function appendUTM(url: string, slug: string, ctaType: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}utm_source=blog&utm_medium=${ctaType}&utm_campaign=${slug}`;
}
