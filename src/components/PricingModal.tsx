import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanType, UserSubscription } from '../types';
import { PRICING_PLANS } from '../data/plans';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgradePlan: (newPlan: PlanType) => void;
  currency: 'ZAR' | 'USD';
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgradePlan,
  currency,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === subscription.plan) return;
    if (planId === 'free') {
      onUpgradePlan('free');
      return;
    }
    setSelectedPlanForCheckout(planId);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlanForCheckout) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onUpgradePlan(selectedPlanForCheckout);
      setSelectedPlanForCheckout(null);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-indigo-50/70 to-white px-6 sm:px-12 pt-10 pb-6 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            Flexible Plans for Small Businesses
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Supercharge Your Marketing for Less Than a Cup of Coffee a Day
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Create un-watermarked 1080p posters, unlimited WhatsApp promotions, and high-converting advertisements tailored for your business.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Annual (Save 20%)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                SAVE
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = subscription.plan === plan.id;
            const price =
              currency === 'ZAR'
                ? billingCycle === 'annual'
                  ? plan.annualPriceMonthlyZAR
                  : plan.monthlyPriceZAR
                : billingCycle === 'annual'
                ? Math.round(plan.monthlyPriceUSD * 0.8)
                : plan.monthlyPriceUSD;

            const currencySymbol = currency === 'ZAR' ? 'R' : '$';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  plan.recommended
                    ? 'border-2 border-indigo-600 bg-indigo-50/20 shadow-xl shadow-indigo-500/10'
                    : 'border border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {currencySymbol}
                        {price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        / month
                      </span>
                    </div>
                    {billingCycle === 'annual' && plan.monthlyPriceZAR > 0 && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        Billed annually (Save 20%)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Includes:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-6">
                  {isCurrent ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 text-center text-xs font-bold border border-slate-200">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                        plan.recommended
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {plan.id === 'free' ? (
                        'Downgrade to Free'
                      ) : (
                        <>
                          <span>{plan.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cancel or change your subscription anytime with zero penalty</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🇿🇦 Local SA Rand & Global Cards Accepted</span>
            <span>⚡ Instant Activation</span>
          </div>
        </div>

        {/* Simulated Checkout Drawer / Modal Layer */}
        {selectedPlanForCheckout && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Confirm Upgrade
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>
                    {selectedPlanForCheckout === 'growth'
                      ? 'Growth Pilot Plan'
                      : 'Pro Pilot Plan'}
                  </span>
                  <span className="text-indigo-700">
                    {currency === 'ZAR' ? 'R' : '$'}
                    {selectedPlanForCheckout === 'growth'
                      ? billingCycle === 'annual'
                        ? 199
                        : 249
                      : billingCycle === 'annual'
                      ? 79
                      : 99}
                    /mo
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Instant access to watermark-free posters, extended AI credits, and full WhatsApp broadcasting features.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Simulated test checkout — no real charge required.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Confetti & instant plan activation.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <span>Activating Plan...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Activate Plan Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
