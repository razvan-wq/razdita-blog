'use client';

import { trackLeadMagnetDownload, appendUTM } from '../lib/tracking';

interface LeadMagnetCTAProps {
  postSlug: string;
  title: string;
  description: string;
  downloadUrl: string;
  leadMagnetId?: string;
}

export default function LeadMagnetCTA({
  postSlug,
  title,
  description,
  downloadUrl,
  leadMagnetId,
}: LeadMagnetCTAProps) {
  const handleClick = () => {
    trackLeadMagnetDownload(postSlug, leadMagnetId ?? postSlug, title);
    window.open(appendUTM(downloadUrl, postSlug, 'lead_magnet'), '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="my-10 rounded-xl border p-8"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, white)',
        borderColor: 'color-mix(in srgb, var(--color-primary) 20%, white)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, white)' }}
        >
          <svg
            className="h-6 w-6"
            style={{ color: 'var(--color-primary)' }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          <button
            onClick={handleClick}
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Download Free Resource
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
