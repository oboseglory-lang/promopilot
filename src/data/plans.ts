export interface PricingPlan {
  id: 'free' | 'pro' | 'growth';
  name: string;
  badge?: string;
  monthlyPriceZAR: number;
  annualPriceMonthlyZAR: number;
  monthlyPriceUSD: number;
  description: string;
  creditsPerMonth: number | 'Unlimited';
  features: string[];
  recommended?: boolean;
  ctaText: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter Pilot',
    monthlyPriceZAR: 0,
    annualPriceMonthlyZAR: 0,
    monthlyPriceUSD: 0,
    description: 'Essential marketing tools for side-hustlers and new local startups.',
    creditsPerMonth: 5,
    features: [
      '5 AI Campaign Generations / month',
      'Ready-Made Promotional Templates',
      'Social Media Captions (IG, FB, TikTok)',
      'Basic Poster Studio (with small watermark)',
      'Standard WhatsApp Message Composer',
      'South African & Global Currency Support'
    ],
    ctaText: 'Current Plan'
  },
  {
    id: 'pro',
    name: 'Pro Pilot',
    badge: 'MOST POPULAR',
    monthlyPriceZAR: 99,
    annualPriceMonthlyZAR: 79,
    monthlyPriceUSD: 6,
    description: 'Perfect for retail stores, salons, cafes, and trades looking to attract regular customers.',
    creditsPerMonth: 60,
    recommended: true,
    features: [
      '60 AI Campaign Generations / month',
      '✨ NO Watermarks on Posters',
      'Full HD 1080p Poster & Flyer Downloads',
      'WhatsApp Broadcast Formatter & Direct wa.me Link',
      'Meta & Google Ads Copy Generator',
      'All 10+ Local Industry Presets & Tones',
      'Saved Campaign Library & Quick Remix'
    ],
    ctaText: 'Upgrade to Pro'
  },
  {
    id: 'growth',
    name: 'Growth Pilot',
    badge: 'BEST VALUE',
    monthlyPriceZAR: 249,
    annualPriceMonthlyZAR: 199,
    monthlyPriceUSD: 14,
    description: 'For busy retailers, multi-service companies and boutique agencies managing heavy campaigns.',
    creditsPerMonth: 'Unlimited',
    features: [
      '⚡ UNLIMITED AI Campaign Generations',
      'Ultra HD & 4K Print-Ready Poster Exports',
      'Custom Brand Kit (Logo, Colors & WhatsApp badge)',
      'Multi-Channel Campaign Bundles in 1-Click',
      'High-converting A/B Ad variations',
      'Priority Gemini 3.8 Flash Generation Speed',
      'Early access to new marketing templates'
    ],
    ctaText: 'Upgrade to Growth'
  }
];
