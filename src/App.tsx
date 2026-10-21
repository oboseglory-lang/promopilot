import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CampaignStudio } from './components/CampaignStudio';
import { PosterStudio } from './components/PosterStudio';
import { WhatsAppHub } from './components/WhatsAppHub';
import { TemplatesLibrary } from './components/TemplatesLibrary';
import { SavedLibrary } from './components/SavedLibrary';
import { GmailMarketingHub } from './components/GmailMarketingHub';
import { PricingModal } from './components/PricingModal';
import {
  GeneratedCampaign,
  IndustryId,
  PlanType,
  PosterConfig,
  PromoTemplate,
  UserSubscription
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR');
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // User subscription state with localStorage persistence
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('promopilot_subscription');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      plan: 'free',
      creditsUsed: 1,
      creditsLimit: 5,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('promopilot_subscription', JSON.stringify(subscription));
    } catch (e) {
      // ignore
    }
  }, [subscription]);

  // Saved campaigns with localStorage persistence
  const [savedCampaigns, setSavedCampaigns] = useState<GeneratedCampaign[]>(() => {
    try {
      const saved = localStorage.getItem('promopilot_saved_campaigns');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'promopilot_saved_campaigns',
        JSON.stringify(savedCampaigns)
      );
    } catch (e) {
      // ignore
    }
  }, [savedCampaigns]);

  // Poster studio initial config state (when bridging from studio or templates)
  const [posterConfig, setPosterConfig] = useState<Partial<PosterConfig>>({
    badgeText: '⚡ SPECIAL OFFER',
    businessName: 'MY LOCAL BUSINESS',
    mainHeadline: 'BIGGEST DEALS THIS WEEK',
    highlightOffer: 'BUY 1 GET 2ND 50% OFF',
    subHeadline: 'Visit us this week or order via WhatsApp to claim before stock runs out.',
    terms: 'Valid while stocks last. T&Cs apply.',
    contactInfo: 'WhatsApp to order: 082 123 4567',
    aspectRatio: '1:1',
    theme: 'midnight-cyber',
  });

  // Active campaign state for Gmail & Poster
  const [activeCampaign, setActiveCampaign] = useState<GeneratedCampaign | null>(null);

  // Prefill state for Campaign Studio
  const [studioPrefill, setStudioPrefill] = useState<{
    offer: string;
    industry: IndustryId;
  }>({
    offer: 'Buy 1 Large Pizza, Get 2nd Half Price this Tuesday',
    industry: 'food',
  });

  // Credit checking logic
  const handleUseCredit = (): boolean => {
    if (subscription.creditsLimit === -1) {
      // Unlimited on growth
      return true;
    }
    if (subscription.creditsUsed < subscription.creditsLimit) {
      setSubscription((prev) => ({
        ...prev,
        creditsUsed: prev.creditsUsed + 1,
      }));
      return true;
    }
    return false;
  };

  const handleUpgradePlan = (newPlan: PlanType) => {
    let limit = 5;
    if (newPlan === 'pro') limit = 60;
    if (newPlan === 'growth') limit = -1;

    setSubscription({
      plan: newPlan,
      creditsUsed: 0,
      creditsLimit: limit,
    });
  };

  // Actions bridging between tabs
  const handleOpenInPosterStudioFromCampaign = (campaign: GeneratedCampaign) => {
    setPosterConfig({
      badgeText: campaign.poster.badgeText,
      businessName: campaign.businessName.toUpperCase(),
      mainHeadline: campaign.poster.mainHeadline,
      highlightOffer: campaign.poster.highlightOffer,
      subHeadline: campaign.poster.subHeadline,
      terms: campaign.poster.terms,
      contactInfo: `WhatsApp to order: 082 123 4567`,
      aspectRatio: '1:1',
    });
    setActiveTab('poster');
  };

  const handleSelectTemplateForStudio = (template: PromoTemplate) => {
    setStudioPrefill({
      offer: template.offer,
      industry: (template.industry === 'all' ? 'retail' : template.industry) as IndustryId,
    });
    setActiveTab('studio');
  };

  const handleOpenTemplateInPoster = (template: PromoTemplate) => {
    setPosterConfig({
      badgeText: template.badge,
      businessName: 'MY LOCAL BUSINESS',
      mainHeadline: template.headline,
      highlightOffer: template.offer,
      subHeadline: template.subtext,
      terms: 'Limited time offer. T&Cs apply.',
      contactInfo: 'WhatsApp to order: 082 123 4567',
      aspectRatio: '1:1',
    });
    setActiveTab('poster');
  };

  const handleSaveCampaign = (campaign: GeneratedCampaign) => {
    setSavedCampaigns((prev) => {
      const exists = prev.some((c) => c.id === campaign.id);
      if (exists) return prev;
      return [campaign, ...prev];
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setSavedCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        onOpenPricing={() => setIsPricingOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        savedCount={savedCampaigns.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' && (
          <CampaignStudio
            subscription={subscription}
            onUseCredit={handleUseCredit}
            onOpenPricing={() => setIsPricingOpen(true)}
            onSaveCampaign={handleSaveCampaign}
            onOpenInPosterStudio={handleOpenInPosterStudioFromCampaign}
            onOpenInGmail={(camp) => {
              setActiveCampaign(camp);
              setActiveTab('gmail');
            }}
            currency={currency}
            prefilledOffer={studioPrefill.offer}
            prefilledIndustry={studioPrefill.industry}
          />
        )}

        {activeTab === 'poster' && (
          <PosterStudio
            subscription={subscription}
            onOpenPricing={() => setIsPricingOpen(true)}
            initialConfig={posterConfig}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppHub
            subscription={subscription}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeTab === 'gmail' && (
          <GmailMarketingHub
            subscription={subscription}
            currentCampaign={activeCampaign}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesLibrary
            onSelectTemplate={handleSelectTemplateForStudio}
            onOpenInPoster={handleOpenTemplateInPoster}
          />
        )}

        {activeTab === 'saved' && (
          <SavedLibrary
            savedCampaigns={savedCampaigns}
            onDeleteCampaign={handleDeleteCampaign}
            onOpenInPoster={handleOpenInPosterStudioFromCampaign}
            onOpenInStudio={(camp) => {
              setStudioPrefill({
                offer: camp.offer,
                industry: 'food',
              });
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* Pricing Upgrade Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        subscription={subscription}
        onUpgradePlan={handleUpgradePlan}
        currency={currency}
      />

      {/* Subtle Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PromoPilot — Built for Small Business Growth</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              Plans (R99–R249/mo)
            </button>
            <span>•</span>
            <span>Instagram, Facebook, Ads & WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
