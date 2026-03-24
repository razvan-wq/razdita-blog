'use client';

import { siteConfig } from '@/site.config';
import { trackCTAClick, appendUTM } from '../lib/tracking';

interface CTABlockProps {
  slug?: string;
}

export default function CTABlock({ slug }: CTABlockProps) {
  const ctaUrl = slug
    ? appendUTM(siteConfig.cta.url, slug, 'cta')
    : siteConfig.cta.url;

  const handleClick = () => {
    if (slug) {
      trackCTAClick(slug, 'primary_cta', siteConfig.cta.url);
    }
  };

  return (
    <section className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-12 text-center">
      <h2 className="text-2xl font-bold text-white">{siteConfig.cta.text}</h2>
      <p className="mx-auto mt-3 max-w-lg text-gray-300">
        {siteConfig.description}
      </p>
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {siteConfig.cta.text}
      </a>
    </section>
  );
}
