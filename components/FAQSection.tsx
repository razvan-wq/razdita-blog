'use client';

import { useState } from 'react';

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
  postTitle: string;
}

export default function FAQSection({ faqs, postTitle }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={openIndex === index}
            >
              <span className="text-base font-medium text-gray-900 pr-4">{faq.question}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
