import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  Sparkles,
  Phone,
  Flame,
  Clock,
  Heart,
  Tag,
  Smile
} from 'lucide-react';
import { UserSubscription } from '../types';

interface WhatsAppHubProps {
  subscription: UserSubscription;
  onOpenPricing: () => void;
}

const PRESET_MESSAGES = [
  {
    title: '⚡ 24-Hour Flash Sale',
    type: 'Urgency',
    text: `🚨 *FLASH SALE ALERT: 24 HOURS ONLY!* 🚨\n\nHey there! We are running our biggest flash deal of the month at *Sunset Cafe & Grill*:\n\n🔥 *Get 30% OFF all orders placed before 8 PM tonight!*\n\nUse code *FLASH30* or mention this WhatsApp message when ordering.\n\n📍 Visit us or reply *ORDER NOW* right here to claim before stock runs out!`,
  },
  {
    title: '👑 VIP Loyalty Appreciation',
    type: 'Retention',
    text: `🌟 *Exclusive VIP Gift from Studio 44!* 🌟\n\nDear VIP client, thank you for being an amazing part of our journey! ❤️\n\nTo show our appreciation, here is a private gift just for you:\n\n✨ *Enjoy R100 OFF your next appointment of R350 or more!*\n\nSimply reply *YES* with your preferred day this week to lock in your discounted pamper session.\n\n_Valid for the next 7 days only._`,
  },
  {
    title: '🍕 Weekend Special Combo',
    type: 'Weekend',
    text: `🎉 *Weekend Vibes are here at Bella Pizza!* 🎉\n\nDon't cook this Friday! We've got dinner sorted for the whole family:\n\n🍕 *2x Large Gourmet Pizzas*\n🧄 *1x Garlic Cheesy Bread*\n🥤 *1x 2L Soft Drink*\n\n💰 *All for only R240 (Save R80)!*\n\nReply *YES* to place your order for pickup or delivery right away! 🛵`,
  },
  {
    title: '👋 We Miss You Re-engagement',
    type: 'Re-engagement',
    text: `👋 *Hey! It’s been a minute from Apex Fitness!* \n\nWe noticed you haven't dropped by recently, and we'd love to see you back on track! 💪\n\nHere is a little motivation to restart strong:\n\n🎁 *Book a complimentary 1-on-1 coaching session + 1 week free pass on us!*\n\nReply *RESTART* and our head coach will set you up today. No pressure, just pure support! ✨`,
  },
];

export const WhatsAppHub: React.FC<WhatsAppHubProps> = ({
  subscription,
  onOpenPricing,
}) => {
  const [message, setMessage] = useState(PRESET_MESSAGES[0].text);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [businessName, setBusinessName] = useState('My Local Business');
  const [copied, setCopied] = useState(false);

  const insertText = (prefix: string, suffix: string = '') => {
    setMessage((prev) => `${prev} ${prefix}text${suffix}`);
  };

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => `${prev} ${emoji}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const encoded = encodeURIComponent(message);
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              WhatsApp Broadcast Hub
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Draft, format with WhatsApp markup, and launch direct promotions to your customers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Composer & Preset Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Presets */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Proven WhatsApp Broadcast Templates
              </span>
              <span className="text-[11px] text-slate-400">Click to load</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_MESSAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(preset.text)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      {preset.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {preset.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Composer Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Message Content
              </label>
              <span className="text-[11px] text-slate-400">
                {message.length} characters
              </span>
            </div>

            {/* Quick WhatsApp Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-1">
                Format:
              </span>
              <button
                type="button"
                onClick={() => insertText('*', '*')}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded font-bold text-slate-700"
                title="Bold (*text*)"
              >
                B (*bold*)
              </button>
              <button
                type="button"
                onClick={() => insertText('_', '_')}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded italic text-slate-700"
                title="Italics (_text_)"
              >
                I (_italic_)
              </button>
              <button
                type="button"
                onClick={() => insertText('~', '~')}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded line-through text-slate-700"
                title="Strikethrough (~text~)"
              >
                S (~strike~)
              </button>
              <div className="h-4 w-px bg-slate-300 mx-1" />
              {['🔥', '🎉', '💰', '📍', '⏰', '⚡', '🛍️', '✨', '👇'].map(
                (emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-1 hover:bg-slate-200 rounded text-sm transition-colors"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>

            {/* Message Textarea */}
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-300 font-sans text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed"
              placeholder="Type your WhatsApp broadcast message here..."
            />

            {/* Direct Send Setup: Optional Phone Number */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Recipient Phone (Optional - leave blank to choose in WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="e.g. +27821234567 or 0821234567"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Launch WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Phone Simulator Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] rounded-[40px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3" />

            {/* WhatsApp App Screen */}
            <div className="rounded-[30px] overflow-hidden bg-[#efeae2] border border-slate-700 flex flex-col min-h-[500px]">
              {/* WhatsApp App Top Bar */}
              <div className="bg-[#075e54] text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                    PP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      PromoPilot Business
                    </h4>
                    <p className="text-[10px] text-emerald-200">online</p>
                  </div>
                </div>
              </div>

              {/* Chat Canvas with Wallpaper */}
              <div className="flex-1 p-3 space-y-3 flex flex-col justify-end">
                {/* Simulated Date Stamp */}
                <div className="text-center">
                  <span className="px-2 py-0.5 rounded-md bg-white/80 text-[10px] text-slate-600 font-medium shadow-xs">
                    TODAY
                  </span>
                </div>

                {/* Sent Bubble */}
                <div className="max-w-[92%] ml-auto bg-[#dcf8c6] rounded-2xl rounded-tr-xs p-3 shadow-xs space-y-1.5 border border-emerald-200/60">
                  <div className="text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans break-words">
                    {message}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 font-mono">
                    <span>12:45 PM</span>
                    <span className="text-sky-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Fake WhatsApp Input bar */}
              <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-slate-200">
                <div className="flex-1 bg-white rounded-full px-3 py-1 text-[11px] text-slate-400">
                  Message...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Accurate preview of how bold formatting and spacing looks on customer phones.
          </p>
        </div>
      </div>
    </div>
  );
};
