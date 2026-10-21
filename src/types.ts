export type IndustryId =
  | 'food'
  | 'salon'
  | 'retail'
  | 'fitness'
  | 'trades'
  | 'automotive'
  | 'realestate'
  | 'professional'
  | 'crafts'
  | 'events';

export interface IndustryConfig {
  id: IndustryId;
  name: string;
  icon: string;
  description: string;
  sampleOffers: string[];
  suggestedTones: string[];
  targetAudiences: string[];
  defaultHashtags: string[];
}

export interface GeneratedCampaign {
  id: string;
  timestamp: number;
  businessName: string;
  industry: string;
  offer: string;
  caption: {
    hook: string;
    body: string;
    hashtags: string[];
    cta: string;
    suggestedPlatform: string;
  };
  ad: {
    headline: string;
    primaryText: string;
    valueProps: string[];
    cta: string;
  };
  poster: {
    badgeText: string;
    mainHeadline: string;
    subHeadline: string;
    highlightOffer: string;
    terms: string;
    ctaText: string;
    themeSuggestion: string;
  };
  whatsapp: {
    message: string;
    previewSnippet: string;
    sendActionText: string;
  };
}

export type PlanType = 'free' | 'pro' | 'growth';

export interface UserSubscription {
  plan: PlanType;
  creditsUsed: number;
  creditsLimit: number; // 5 for free, 60 for pro, -1 for unlimited (growth)
  brandKit?: {
    businessName: string;
    whatsappNumber: string;
    primaryColor: string;
    tagline: string;
  };
}

export type PosterThemeId =
  | 'midnight-cyber'
  | 'sunset-blaze'
  | 'emerald-gold'
  | 'ocean-vibe'
  | 'berry-punch'
  | 'clean-minimal'
  | 'sunshine-yellow';

export interface PosterTheme {
  id: PosterThemeId;
  name: string;
  bgGradient: [string, string];
  accentColor: string;
  badgeBg: string;
  badgeTextColor: string;
  headlineColor: string;
  highlightColor: string;
  cardBg: string;
  borderStyle: string;
}

export interface PosterConfig {
  badgeText: string;
  businessName: string;
  mainHeadline: string;
  highlightOffer: string;
  subHeadline: string;
  terms: string;
  contactInfo: string;
  theme: PosterThemeId;
  aspectRatio: '1:1' | '9:16' | '16:9';
  showQrPlaceholder: boolean;
  watermark: boolean;
}

export interface PromoTemplate {
  id: string;
  title: string;
  category: string;
  industry: IndustryId | 'all';
  description: string;
  badge: string;
  headline: string;
  offer: string;
  subtext: string;
  whatsappMessage: string;
  tags: string[];
}
