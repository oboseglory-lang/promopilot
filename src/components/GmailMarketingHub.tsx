import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Clock,
  Check,
  Inbox
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken
} from '../services/firebaseAuth';
import {
  fetchGmailProfile,
  sendGmailEmail,
  createGmailDraft,
  listRecentSentMessages,
  GmailProfile,
  GmailMessageSummary
} from '../services/gmailApi';
import { GeneratedCampaign, UserSubscription } from '../types';

interface GmailMarketingHubProps {
  subscription: UserSubscription;
  currentCampaign?: GeneratedCampaign | null;
  onOpenPricing: () => void;
}

export const GmailMarketingHub: React.FC<GmailMarketingHubProps> = ({
  subscription,
  currentCampaign,
  onOpenPricing,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [profile, setProfile] = useState<GmailProfile | null>(null);

  // Email form state
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState(
    currentCampaign
      ? `Special Deal from ${currentCampaign.businessName}: ${currentCampaign.offer}`
      : 'Exclusive Weekend Special Just for You!'
  );
  const [senderName, setSenderName] = useState(
    currentCampaign?.businessName || 'PromoPilot Store'
  );
  const [emailBodyHtml, setEmailBodyHtml] = useState(
    currentCampaign
      ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <h2 style="color: #4f46e5; margin-top: 0;">Special Offer from ${currentCampaign.businessName}</h2>
  <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">${currentCampaign.caption.hook}</p>
  <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
    <h3 style="margin: 0; color: #0f172a; font-size: 18px;">🔥 ${currentCampaign.offer}</h3>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;">${currentCampaign.caption.body.replace(/\n/g, '<br>')}</p>
  </div>
  <p style="font-size: 14px; color: #64748b;">${currentCampaign.poster.terms || 'Limited time offer. T&Cs apply.'}</p>
  <div style="margin-top: 24px; text-align: center;">
    <a href="#" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Claim Offer Now</a>
  </div>
</div>`
      : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <h2 style="color: #4f46e5; margin-top: 0;">VIP Customer Special</h2>
  <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">We have an exciting announcement just for our community!</p>
  <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
    <h3 style="margin: 0; color: #0f172a; font-size: 18px;">✨ Exclusive 20% OFF Everything</h3>
    <p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;">Visit us this weekend or reply to this email to claim your voucher.</p>
  </div>
  <div style="margin-top: 24px; text-align: center;">
    <a href="#" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Visit Store Today</a>
  </div>
</div>`
  );

  // Status & modal states
  const [sentHistory, setSentHistory] = useState<GmailMessageSummary[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Confirmation dialog state (MANDATORY per Workspace Integration Skill)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'send' | 'draft';
  }>({
    isOpen: false,
    type: 'send',
  });

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, authedToken) => {
        setUser(authedUser);
        setToken(authedToken);
        loadProfileAndHistory(authedToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setProfile(null);
        setSentHistory([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadProfileAndHistory = async (accessToken: string) => {
    try {
      const prof = await fetchGmailProfile(accessToken);
      setProfile(prof);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }

    try {
      setIsLoadingHistory(true);
      const history = await listRecentSentMessages(accessToken, 5);
      setSentHistory(history);
    } catch (err) {
      console.error('Failed to load sent history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setActionError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        loadProfileAndHistory(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setActionError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setProfile(null);
    setSentHistory([]);
  };

  // Convert current campaign to rich email HTML
  const handleLoadCurrentCampaign = () => {
    if (!currentCampaign) return;

    setSubject(`Special Deal from ${currentCampaign.businessName}: ${currentCampaign.offer}`);
    setSenderName(currentCampaign.businessName);

    const generatedHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="background-color: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; letter-spacing: 1px;">${currentCampaign.poster.badgeText}</span>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">${currentCampaign.businessName}</h1>
    <p style="color: #64748b; font-size: 14px; margin: 0;">${currentCampaign.industry} Special Announcement</p>
  </div>

  <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; padding: 24px; color: #ffffff; text-align: center; margin-bottom: 24px;">
    <h2 style="font-size: 28px; font-weight: 900; margin: 0 0 8px 0; color: #facc15;">${currentCampaign.offer}</h2>
    <p style="font-size: 16px; margin: 0; opacity: 0.95;">${currentCampaign.poster.subHeadline || currentCampaign.caption.hook}</p>
  </div>

  <div style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 24px;">
    <p style="margin-top: 0;"><strong>${currentCampaign.caption.hook}</strong></p>
    <p>${currentCampaign.caption.body.replace(/\n/g, '<br>')}</p>
  </div>

  <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
    <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Why Choose ${currentCampaign.businessName}:</h4>
    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px;">
      ${currentCampaign.ad.valueProps.map((p) => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
    </ul>
  </div>

  <div style="text-align: center; margin: 32px 0;">
    <a href="#" style="background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 16px; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">${currentCampaign.ad.cta}</a>
  </div>

  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">${currentCampaign.poster.terms || 'Valid while stocks last. T&Cs apply.'}</p>
    <p style="margin: 8px 0 0 0;">Sent via PromoPilot Email Marketing with Gmail</p>
  </div>
</div>`;

    setEmailBodyHtml(generatedHtml);
    setActionSuccess('Loaded current campaign into email editor!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Open confirmation modal
  const handleInitiateSend = (type: 'send' | 'draft') => {
    if (!recipient.trim()) {
      setActionError('Please enter a recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setActionError('Please enter an email subject line.');
      return;
    }
    setActionError(null);
    setConfirmDialog({ isOpen: true, type });
  };

  // Execute confirmed send or draft
  const handleExecuteConfirmedAction = async () => {
    if (!token) return;
    setIsSending(true);
    setActionError(null);
    setActionSuccess(null);

    const isDraft = confirmDialog.type === 'draft';
    setConfirmDialog({ isOpen: false, type: 'send' });

    try {
      if (isDraft) {
        await createGmailDraft(token, {
          to: recipient,
          subject,
          bodyHtml: emailBodyHtml,
          fromName: senderName,
        });
        setActionSuccess('Draft saved successfully to your connected Gmail account!');
      } else {
        await sendGmailEmail(token, {
          to: recipient,
          subject,
          bodyHtml: emailBodyHtml,
          fromName: senderName,
        });
        setActionSuccess(`Promotional email sent successfully to ${recipient}!`);
      }

      // Refresh sent history
      loadProfileAndHistory(token);
    } catch (err: any) {
      console.error('Gmail action failed:', err);
      setActionError(err.message || 'Failed to complete Gmail operation.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Gmail Marketing Hub
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Send beautiful promotional emails and newsletters directly from your verified Gmail account.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Gmail status */}
        {user ? (
          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                user.email?.[0] || 'G'
              )}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <span>{profile?.emailAddress || user.email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] text-slate-400">
                Connected with Gmail API
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Disconnect Gmail"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            {/* Official Google Sign-In button per Workspace Integration Skill */}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {/* Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google to use Gmail'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Gmail Layout */}
      {!user ? (
        /* Logged Out Onboarding Card */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Connect Gmail to Launch Email Promotions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Send marketing announcements, customer loyalty vouchers, and new product announcements straight from your personal or business Gmail address with zero complex SMTP setup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-bold text-slate-800 block mb-1">✉️ Direct Delivery</span>
              <span className="text-slate-500">Emails come directly from your Google account.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-bold text-slate-800 block mb-1">📝 Gmail Drafts</span>
              <span className="text-slate-500">Save AI campaigns to Drafts to review before sending.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-bold text-slate-800 block mb-1">🛡️ Protected & Secure</span>
              <span className="text-slate-500">Always requires explicit confirmation before sending.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{isSigningIn ? 'Connecting...' : 'Connect Gmail Account'}</span>
          </button>
        </div>
      ) : (
        /* Connected Workspace View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Email Composer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                Compose Promotional Email
              </h3>

              {currentCampaign && (
                <button
                  type="button"
                  onClick={handleLoadCurrentCampaign}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Insert Current Campaign</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Recipient */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. customer@example.com or vip-clients@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                />
              </div>

              {/* Sender Name & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Sunset Cafe & Grill"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. 50% Off Weekend Special!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              {/* Email Content HTML */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email HTML Template
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Responsive email markup
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={emailBodyHtml}
                  onChange={(e) => setEmailBodyHtml(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-800"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleInitiateSend('send')}
                  disabled={isSending}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInitiateSend('draft')}
                  disabled={isSending}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Save as Gmail Draft</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>You will be prompted to confirm recipient and subject before sending.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Email Preview & Sent History (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Email Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Email Newsletter Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Desktop & Mobile
                </span>
              </div>

              {/* Rendered HTML Preview */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 max-h-[380px] overflow-y-auto">
                <div
                  className="bg-white rounded-lg p-2 text-xs"
                  dangerouslySetInnerHTML={{ __html: emailBodyHtml }}
                />
              </div>
            </div>

            {/* Sent Messages History */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-slate-500" />
                  Recent Sent Campaigns
                </span>
                <button
                  onClick={() => token && loadProfileAndHistory(token)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {sentHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No recent sent promotions found in Gmail.
                </div>
              ) : (
                <div className="space-y-2">
                  {sentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">
                          {item.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.date ? new Date(item.date).toLocaleDateString() : 'Sent'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        To: {item.to || 'Recipient'}
                      </p>
                      {item.snippet && (
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {item.snippet}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION MODAL FOR WORKSPACE MUTATING ACTIONS */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-red-600 border-b border-slate-100 pb-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                {confirmDialog.type === 'send'
                  ? 'Confirm Sending Email'
                  : 'Confirm Saving Draft'}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmDialog.type === 'send'
                ? `You are about to send an email from your connected Google account (${user?.email}) to the following recipient:`
                : `You are about to create a draft message in your connected Gmail account (${user?.email}):`}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div>
                <strong className="text-slate-700">To:</strong>{' '}
                <span className="text-slate-900 font-mono">{recipient}</span>
              </div>
              <div>
                <strong className="text-slate-700">Subject:</strong>{' '}
                <span className="text-slate-900">{subject}</span>
              </div>
              <div>
                <strong className="text-slate-700">From Name:</strong>{' '}
                <span className="text-slate-900">{senderName}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              This action cannot be undone once sent.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: 'send' })}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>
                  {confirmDialog.type === 'send' ? 'Confirm & Send' : 'Save Draft'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
