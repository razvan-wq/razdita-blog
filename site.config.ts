export const siteConfig = {
  name: 'Raz Dita',
  description: 'Amazon seller tips, AI ecommerce tools, and business automation strategies. Real systems from a 7-figure Amazon operator.',
  url: 'https://razdita.com',
  author: 'Raz Dita',

  // Navigation
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ],

  // CTA
  cta: {
    text: 'Join the Free Community',
    url: 'https://www.skool.com/ai-ecommerce-systems',
  },

  // Theme colours
  theme: {
    primary: '#F97316',
    secondary: '#1B2B5B',
    accent: '#F59E0B',
  },

  // Social links
  social: {
    twitter: '',
    youtube: 'https://youtube.com/@RazDita',
    linkedin: 'https://linkedin.com/in/razvandita',
  },

  // Analytics
  gscVerification: '',
  gaId: '',
};

export type SiteConfig = typeof siteConfig;
