import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Palette,
  Layout,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
  RefreshCw,
  Crown,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { PosterConfig, PosterThemeId, UserSubscription } from '../types';
import { POSTER_THEMES } from '../data/posterThemes';
import { renderPosterToCanvas, downloadCanvas } from '../utils/canvasRenderer';

interface PosterStudioProps {
  subscription: UserSubscription;
  onOpenPricing: () => void;
  initialConfig?: Partial<PosterConfig>;
}

export const PosterStudio: React.FC<PosterStudioProps> = ({
  subscription,
  onOpenPricing,
  initialConfig,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isFreePlan = subscription.plan === 'free';

  const [config, setConfig] = useState<PosterConfig>({
    badgeText: initialConfig?.badgeText || '⚡ WEEKEND SPECIAL',
    businessName: initialConfig?.businessName || 'SUNSET CAFE & GRILL',
    mainHeadline: initialConfig?.mainHeadline || 'FRESH DEALS THIS WEEK',
    highlightOffer: initialConfig?.highlightOffer || 'BUY 1 GET 2ND 50% OFF',
    subHeadline:
      initialConfig?.subHeadline ||
      'Treat yourself and a friend to our signature gourmet burgers and hand-cut fries.',
    terms: initialConfig?.terms || 'Valid Friday - Sunday while stocks last. T&Cs apply.',
    contactInfo: initialConfig?.contactInfo || 'WhatsApp to order: 082 123 4567',
    theme: (initialConfig?.theme as PosterThemeId) || 'midnight-cyber',
    aspectRatio: initialConfig?.aspectRatio || '1:1',
    showQrPlaceholder: false,
    watermark: isFreePlan, // automatically removed when upgraded to pro or growth
  });

  // Re-sync watermark if subscription changes
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      watermark: subscription.plan === 'free',
    }));
  }, [subscription.plan]);

  // Render to canvas whenever config changes
  useEffect(() => {
    if (canvasRef.current) {
      renderPosterToCanvas(canvasRef.current, config, 1);
    }
  }, [config]);

  const handleDownload = (format: 'image/png' | 'image/jpeg') => {
    if (!canvasRef.current) return;
    const cleanBusiness = config.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const filename = `${cleanBusiness || 'promo'}-poster-${config.aspectRatio}.${ext}`;
    downloadCanvas(canvasRef.current, filename, format);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Poster & Flyer Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              HD Canvas
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Design high-converting promotional graphics ready for Instagram, WhatsApp Status, and print.
          </p>
        </div>

        {/* Plan Watermark Notification */}
        {isFreePlan ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span>Free plan includes subtle watermark.</span>
            <button
              onClick={onOpenPricing}
              className="font-bold underline text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              Remove for R99/mo
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Watermarks Disabled ({subscription.plan.toUpperCase()} Plan)</span>
          </div>
        )}
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Customization Form (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Dimensions / Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, aspectRatio: '1:1' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  config.aspectRatio === '1:1'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>1:1 Square (Feed)</span>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, aspectRatio: '9:16' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  config.aspectRatio === '9:16'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>9:16 Story / Status</span>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, aspectRatio: '16:9' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  config.aspectRatio === '16:9'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>16:9 Landscape</span>
              </button>
            </div>
          </div>

          {/* Theme Palette Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Color Theme & Vibe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POSTER_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setConfig({ ...config, theme: theme.id })}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    config.theme === theme.id
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-inner flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.bgGradient[0]}, ${theme.bgGradient[1]})`,
                    }}
                  />
                  <span className="text-xs font-medium text-slate-800 truncate">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content Fields */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Top Badge */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Top Badge Tag
              </label>
              <input
                type="text"
                value={config.badgeText}
                onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                placeholder="e.g. ⚡ FLASH SALE 24H"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                placeholder="e.g. SUNSET CAFE & GRILL"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={config.mainHeadline}
                onChange={(e) => setConfig({ ...config, mainHeadline: e.target.value })}
                placeholder="e.g. BIGGEST SAVINGS OF THE MONTH"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Focal Highlight Offer */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Focal Offer (Giant Text)
              </label>
              <input
                type="text"
                value={config.highlightOffer}
                onChange={(e) =>
                  setConfig({ ...config, highlightOffer: e.target.value })
                }
                placeholder="e.g. 50% OFF or BUY 1 GET 1"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Subheadline & description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Supporting Subtext
              </label>
              <textarea
                rows={2}
                value={config.subHeadline}
                onChange={(e) => setConfig({ ...config, subHeadline: e.target.value })}
                placeholder="Details of the promotion"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Contact / WhatsApp Pill */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp / Call to Action Pill
              </label>
              <input
                type="text"
                value={config.contactInfo}
                onChange={(e) => setConfig({ ...config, contactInfo: e.target.value })}
                placeholder="e.g. WhatsApp to book: 082 123 4567"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Terms */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Terms of Offer (Footer note)
              </label>
              <input
                type="text"
                value={config.terms}
                onChange={(e) => setConfig({ ...config, terms: e.target.value })}
                placeholder="e.g. Valid until Sunday while stocks last."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Canvas Preview & Download Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live 1080p Canvas Preview
              </span>
              <span>Aspect: {config.aspectRatio}</span>
            </div>

            {/* The Actual Canvas element */}
            <div
              className={`relative overflow-hidden rounded-xl shadow-2xl border border-slate-700 flex items-center justify-center bg-black/50 ${
                config.aspectRatio === '9:16'
                  ? 'max-h-[580px] w-auto aspect-[9/16]'
                  : config.aspectRatio === '16:9'
                  ? 'w-full aspect-[16/9]'
                  : 'w-full max-w-[460px] aspect-square'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Export Buttons */}
            <div className="w-full pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload('image/png')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download HD PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload('image/jpeg')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download JPEG</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Exports at 1080x1080px (Square) or 1080x1920px (Story) for crisp, professional resolution on social media & print.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
