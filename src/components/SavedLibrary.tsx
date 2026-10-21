import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  Send,
  Palette,
  ExternalLink,
  Calendar,
  Share2
} from 'lucide-react';
import { GeneratedCampaign } from '../types';

interface SavedLibraryProps {
  savedCampaigns: GeneratedCampaign[];
  onDeleteCampaign: (id: string) => void;
  onOpenInPoster: (campaign: GeneratedCampaign) => void;
  onOpenInStudio: (campaign: GeneratedCampaign) => void;
}

export const SavedLibrary: React.FC<SavedLibraryProps> = ({
  savedCampaigns,
  onDeleteCampaign,
  onOpenInPoster,
  onOpenInStudio,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Saved Marketing Campaigns
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Access your previous AI-generated campaigns, captions, and poster designs.
            </p>
          </div>
        </div>
      </div>

      {savedCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No saved promotions yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you generate a promotion in the Campaign Studio, click "Save Campaign" to keep it here for fast re-use and editing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {camp.industry}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {camp.businessName}
                    </h3>
                  </div>
                  <button
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Offer
                  </span>
                  <p className="text-xs font-semibold text-slate-800">
                    {camp.offer}
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-900">
                    Hook: {camp.caption.hook}
                  </p>
                  <p className="line-clamp-3 text-slate-500 whitespace-pre-line">
                    {camp.caption.body}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenInStudio(camp)}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Campaign</span>
                  </button>

                  <button
                    onClick={() => onOpenInPoster(camp)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Open in Poster</span>
                  </button>
                </div>

                <button
                  onClick={() =>
                    copyText(
                      `${camp.caption.hook}\n\n${camp.caption.body}\n\n${camp.caption.hashtags.join(' ')}`,
                      camp.id
                    )
                  }
                  className="w-full py-1 text-center text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center justify-center gap-1"
                >
                  {copiedId === camp.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">
                        Copied caption!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Caption</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
