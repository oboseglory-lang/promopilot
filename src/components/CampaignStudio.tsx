import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Zap,
  Palette,
  MessageSquare,
  Flame,
  Tag,
  Share2
} from 'lucide-react';
import { GeneratedCampaign, IndustryId, UserSubscription } from '../types';
import { INDUSTRIES } from '../data/industries';

interface CampaignStudioProps {
  subscription: UserSubscription;
  onUseCredit: () => boolean;
  onOpenPricing: () => void;
  onSaveCampaign: (campaign: GeneratedCampaign) => void;
  onOpenInPosterStudio: (campaign: GeneratedCampaign) => void;
  currency: 'ZAR' | 'USD';
  prefilledOffer?: string;
  prefilledIndustry?: IndustryId;
}

export const CampaignStudio: React.FC<CampaignStudioProps> = ({
  subscription,
  onUseCredit,
  onOpenPricing,
  onSaveCampaign,
  onOpenInPosterStudio,
  currency,
  prefilledOffer,
  prefilledIndustry,
}) => {
  const [industryId, setIndustryId] = useState<IndustryId>(
    prefilledIndustry || 'food'
  );
  const [businessName, setBusinessName] = useState('Sunset Cafe & Grill');
  const [offer, setOffer] = useState(
    prefilledOffer || 'Buy 1 Large Pizza, Get 2nd Half Price this Tuesday'
  );
  const [tone, setTone] = useState('Mouth-watering & Casual');
  const [targetAudience, setTargetAudience] = useState('Local foodies & families');
  const [customDetails, setCustomDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<GeneratedCampaign | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'all' | 'caption' | 'ad' | 'poster' | 'whatsapp'>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedIndustry =
    INDUSTRIES.find((ind) => ind.id === industryId) || INDUSTRIES[0];

  const currencySymbol = currency === 'ZAR' ? 'R' : '$';

  const handleIndustryChange = (newId: IndustryId) => {
    setIndustryId(newId);
    const ind = INDUSTRIES.find((i) => i.id === newId);
    if (ind) {
      if (ind.sampleOffers.length > 0) {
        setOffer(ind.sampleOffers[0]);
      }
      if (ind.suggestedTones.length > 0) {
        setTone(ind.suggestedTones[0]);
      }
      if (ind.targetAudiences.length > 0) {
        setTargetAudience(ind.targetAudiences[0]);
      }
    }
  };

  const handleGenerate = async () => {
    if (!businessName.trim() || !offer.trim()) return;

    // Check credits
    const canProceed = onUseCredit();
    if (!canProceed) {
      onOpenPricing();
      return;
    }

    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'all',
          businessName,
          industry: selectedIndustry.name,
          offer,
          targetAudience,
          tone,
          currencySymbol,
          customDetails,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        const newCampaign: GeneratedCampaign = {
          id: 'camp-' + Date.now(),
          timestamp: Date.now(),
          businessName,
          industry: selectedIndustry.name,
          offer,
          caption: result.data.caption,
          ad: result.data.ad,
          poster: result.data.poster,
          whatsapp: result.data.whatsapp,
        };
        setCurrentCampaign(newCampaign);
      }
    } catch (err) {
      console.error('Error generating campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSave = () => {
    if (!currentCampaign) return;
    onSaveCampaign(currentCampaign);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            AI Marketing Generator for Small & Local Businesses
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            High-converting promotions in seconds, not hours.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Generate Facebook & Instagram captions, Meta/Google ads, ready-to-print posters, and WhatsApp broadcast messages tuned specifically to your industry.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Promotion Blueprint
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure your business and special offer
            </p>
          </div>

          <div className="space-y-4">
            {/* Industry Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Industry / Business Type
              </label>
              <select
                value={industryId}
                onChange={(e) => handleIndustryChange(e.target.value as IndustryId)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bella Mia Salon or Cape Town Auto Tech"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Offer / Promotion */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Primary Offer or Deal
                </label>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  What customers get
                </span>
              </div>
              <textarea
                rows={2}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g. 25% off all services this Friday, or Buy 1 Burger Get 1 Free"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />

              {/* Sample Offers Chips */}
              <div className="mt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-500" />
                  Quick sample deals for {selectedIndustry.name}:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIndustry.sampleOffers.slice(0, 3).map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOffer(sample)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-left truncate max-w-full"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Working moms, college students, gym regulars"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {selectedIndustry.suggestedTones.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
                <option value="Urgent Flash Sale (High Scarcity)">
                  ⚡ Urgent Flash Sale (High Scarcity)
                </option>
                <option value="Friendly, Warm & Local Neighbor">
                  🤝 Friendly, Warm & Local Neighbor
                </option>
                <option value="Exclusive Luxury & Premium VIP">
                  ✨ Exclusive Luxury & Premium VIP
                </option>
                <option value="Direct, Clear & Value-Driven">
                  🎯 Direct, Clear & Value-Driven
                </option>
              </select>
            </div>

            {/* Additional details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Additional Details (Optional)
              </label>
              <input
                type="text"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="e.g. Promo code: SAVE25, Valid until Sunday, Phone: 082 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !businessName.trim() || !offer.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Crafting High-Converting Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Multi-Channel Campaign</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>⚡ Uses 1 AI Generation credit</span>
                {subscription.plan === 'free' && (
                  <button
                    onClick={onOpenPricing}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Need more? Upgrade to Pro (R99/mo)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentCampaign ? (
            <div className="space-y-6">
              {/* Header Bar with Action & Filter */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveOutputTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeOutputTab === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Channels
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('caption')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeOutputTab === 'caption'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📸 Social Caption
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('ad')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeOutputTab === 'ad'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📢 Paid Ad Copy
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('poster')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeOutputTab === 'poster'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🎨 Poster Layout
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('whatsapp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeOutputTab === 'whatsapp'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    💬 WhatsApp Message
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      savedSuccess
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                        Save Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SECTION 1: Social Media Caption */}
              {(activeOutputTab === 'all' || activeOutputTab === 'caption') && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center font-bold text-sm">
                        📸
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Social Media Caption
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Optimized for {currentCampaign.caption.suggestedPlatform}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${currentCampaign.caption.hook}\n\n${currentCampaign.caption.body}\n\n${currentCampaign.caption.hashtags.join(' ')}`,
                          'caption'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      {copiedSection === 'caption' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 font-sans">
                    <p className="font-bold text-slate-900 text-sm">
                      {currentCampaign.caption.hook}
                    </p>
                    <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                      {currentCampaign.caption.body}
                    </p>
                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-xs text-indigo-700 font-semibold mb-1">
                        Call to action: {currentCampaign.caption.cta}
                      </p>
                      <div className="flex flex-wrap gap-1 text-xs text-slate-500">
                        {currentCampaign.caption.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono text-[11px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: WhatsApp Marketing Message */}
              {(activeOutputTab === 'all' || activeOutputTab === 'whatsapp') && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        💬
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          WhatsApp Marketing Message
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Direct broadcast, status update or VIP alert
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(currentCampaign.whatsapp.message, 'whatsapp')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        {copiedSection === 'whatsapp' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>Copy</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          currentCampaign.whatsapp.message
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Chat Preview Bubble */}
                  <div className="bg-[#efeae2] p-4 rounded-xl border border-slate-200/80 relative">
                    <div className="max-w-md bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm space-y-2 border border-slate-200/60 text-sm">
                      <p className="text-slate-900 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                        {currentCampaign.whatsapp.message}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                        <span>Just now</span>
                        <span className="text-sky-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: Paid Advertisement Copy */}
              {(activeOutputTab === 'all' || activeOutputTab === 'ad') && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                        📢
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Paid Advertisement Copy
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Ready for Meta Ads (Facebook & Instagram) & Google Ads
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Headline: ${currentCampaign.ad.headline}\n\nPrimary Text:\n${currentCampaign.ad.primaryText}\n\nKey Benefits:\n${currentCampaign.ad.valueProps.join('\n')}\n\nCTA: ${currentCampaign.ad.cta}`,
                          'ad'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      {copiedSection === 'ad' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Ad Pack</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Ad Headline
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        {currentCampaign.ad.headline}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Primary Ad Text
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {currentCampaign.ad.primaryText}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Value Propositions & CTA Button
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 mb-2">
                        {currentCampaign.ad.valueProps.map((prop, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-emerald-500">✓</span> {prop}
                          </li>
                        ))}
                      </ul>
                      <div className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
                        CTA: {currentCampaign.ad.cta}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: Poster & Flyer Layout */}
              {(activeOutputTab === 'all' || activeOutputTab === 'poster') && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                        🎨
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Promotional Poster & Visual Flyer
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          High-resolution visual design with customizable themes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenInPosterStudio(currentCampaign)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Customize & Download in Poster Studio</span>
                    </button>
                  </div>

                  {/* Visual Snapshot Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-slate-800 space-y-4 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase">
                      {currentCampaign.poster.badgeText}
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                        {currentCampaign.poster.mainHeadline}
                      </h4>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300 my-2">
                        {currentCampaign.poster.highlightOffer}
                      </div>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {currentCampaign.poster.subHeadline}
                      </p>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-400">
                      {currentCampaign.poster.terms}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State / Prompt to Generate */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to launch your next promotion?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose your business type on the left, enter your offer, and click{' '}
                  <strong className="text-indigo-600">Generate Multi-Channel Campaign</strong>{' '}
                  to create high-converting captions, ads, posters, and WhatsApp messages simultaneously.
                </p>
              </div>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  📸 Social Captions & Hashtags
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  📢 Meta & Google Ads
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  🎨 High-Res Posters & Flyers
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  💬 WhatsApp Broadcasts
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
