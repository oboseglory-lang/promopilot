import React from 'react';
import {
  Rocket,
  Palette,
  MessageSquare,
  Sparkles,
  Bookmark,
  Zap,
  FolderOpen,
  Crown
} from 'lucide-react';
import { UserSubscription } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
  currency: 'ZAR' | 'USD';
  setCurrency: (c: 'ZAR' | 'USD') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
  currency,
  setCurrency,
  savedCount,
}) => {
  const isUnlimited = subscription.creditsLimit === -1;
  const remainingCredits = isUnlimited
    ? '∞'
    : Math.max(0, subscription.creditsLimit - subscription.creditsUsed);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('studio')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                    PromoPilot
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Smart marketing content for small business
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Campaign Studio
            </button>

            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'poster'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-4 h-4 text-emerald-400" />
              Poster Studio
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'whatsapp'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-green-400" />
              WhatsApp Hub
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-sky-400" />
              Templates
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-purple-400" />
              Saved
              {savedCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Controls: Currency, Credits & Plan Badge */}
          <div className="flex items-center gap-2.5">
            {/* Currency toggle */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setCurrency('ZAR')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  currency === 'ZAR'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="South African Rand (ZAR)"
              >
                R (ZAR)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  currency === 'USD'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="US Dollar"
              >
                $ (USD)
              </button>
            </div>

            {/* Quota / Credits Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">
                {isUnlimited ? (
                  <span className="text-emerald-400 font-bold">Unlimited AI</span>
                ) : (
                  <>
                    <strong className="text-white">{remainingCredits}</strong> of{' '}
                    {subscription.creditsLimit} credits left
                  </>
                )}
              </span>
            </div>

            {/* Current Plan Badge & Upgrade Trigger */}
            {subscription.plan === 'free' ? (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade (From R99/mo)</span>
              </button>
            ) : (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {subscription.plan === 'growth' ? 'Growth Pilot' : 'Pro Pilot'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2 border-t border-slate-800/80 gap-2 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('poster')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'poster'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400'
            }`}
          >
            Poster Studio
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400'
            }`}
          >
            WhatsApp Hub
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400'
            }`}
          >
            Saved ({savedCount})
          </button>
        </div>
      </div>
    </header>
  );
};
