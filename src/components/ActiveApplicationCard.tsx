import React from "react";
import { Application } from "../types";
import { AlertTriangle, Building, ChevronDown, ChevronUp, Star, Globe, Loader2, Sparkles } from "lucide-react";

interface ActiveApplicationCardProps {
  key?: string;
  app: Application;
  highContrast: boolean;
  currentChannel: "WhatsApp" | "Telegram" | "Email";
  isReviewExpanded: boolean;
  isReviewLoading: boolean;
  reviewData: any;
  onSetChannel: (appId: string, channel: "WhatsApp" | "Telegram" | "Email") => void;
  onTriggerDecay: (appId: string, channel: "WhatsApp" | "Telegram" | "Email") => void;
  onToggleReview: (appId: string, companyName: string) => void;
  onReScrapeReview: (appId: string, companyName: string) => void;
}

export function ActiveApplicationCard({
  app,
  highContrast,
  currentChannel,
  isReviewExpanded,
  isReviewLoading,
  reviewData,
  onSetChannel,
  onTriggerDecay,
  onToggleReview,
  onReScrapeReview,
}: ActiveApplicationCardProps) {
  return (
    <div
      className={`border rounded-xl p-5 ${
        highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-extrabold text-base sm:text-lg">{app.job.title}</h4>
          <p className={`text-xs font-bold ${highContrast ? "text-yellow-400" : "text-slate-500"}`}>
            {app.job.company} • {app.job.location}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Applied: {app.appliedAt}</span>
        </div>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
          highContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-800"
        }`}>
          {app.status.replace("_", " ")}
        </span>
      </div>

      <div className={`mt-5 p-4 rounded-lg border-2 border-dashed ${
        highContrast ? "border-yellow-400/50 bg-zinc-950" : "bg-amber-50/50 border-amber-200"
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-yellow-400 ease-out duration-300" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-yellow-400">
            Simulate n8n Link Decay Automation
          </h5>
        </div>
        <p className="text-xs text-slate-600 dark:text-yellow-400/80 leading-relaxed mb-4">
           Mainstream job postings decay quickly. Press the button below to simulate when the original URL becomes inactive. An automated n8n webhook workflow will simulate pushing a notification to your selected channel and transfer the job to the outreach board.
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span id={`alert-via-${app.id}`} className="text-[11px] font-bold text-slate-400 uppercase">Alert Via:</span>
          <fieldset className="flex gap-1.5" aria-labelledby={`alert-via-${app.id}`}>
            {(["WhatsApp", "Telegram", "Email"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => onSetChannel(app.id, ch)}
                className={`px-2.5 py-1 text-xs font-bold rounded border ${
                  currentChannel === ch
                    ? highContrast
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-blue-600 text-white border-blue-600"
                    : highContrast
                    ? "border-yellow-400"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {ch}
              </button>
            ))}
          </fieldset>

          <button
            type="button"
            onClick={() => onTriggerDecay(app.id, currentChannel)}
            className={`ml-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              highContrast
                ? "bg-yellow-400 text-black hover:bg-lilac-900 hover:text-yellow-400 border border-yellow-400"
                : "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            }`}
          >
            Trigger Link Decay
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-yellow-400/20">
        <button
          type="button"
          onClick={() => onToggleReview(app.id, app.job.company)}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all ${
            highContrast
              ? "bg-lilac-950 hover:bg-lilac-900 border border-yellow-400 text-yellow-400"
              : "bg-blue-50/50 hover:bg-blue-50 border border-blue-100/70 text-blue-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600 dark:text-yellow-400" />
            <span>🌐 Live AI Web-Scraped Accessibility Audit & Reviews</span>
          </div>
          {isReviewExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isReviewExpanded && (
          <div className={`mt-3 p-4 rounded-lg border space-y-4 animate-in fade-in duration-300 ${
            highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white border-slate-100 shadow-sm"
          }`}>
            {isReviewLoading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-[11px] font-bold text-slate-500 animate-pulse">
                  Deep-scraping company diversity pages & accommodations databases...
                </span>
              </div>
            ) : reviewData ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 dark:border-yellow-400/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-extrabold text-indigo-700 dark:text-yellow-300">
                      Gemini AI Scrape & Audit Successful
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-zinc-950 px-2 py-0.5 rounded font-mono">
                    {reviewData.scrapedAt || "Live Web Scraped"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50/70 dark:bg-zinc-950 p-2.5 rounded-lg text-center border border-slate-100/50 dark:border-yellow-400/10">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Accommodations</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-extrabold">{reviewData.accommodationsRating || "4.5"}/5</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/70 dark:bg-zinc-950 p-2.5 rounded-lg text-center border border-slate-100/50 dark:border-yellow-400/10">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Environment</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-extrabold">{reviewData.environmentRating || "4.5"}/5</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/70 dark:bg-zinc-950 p-2.5 rounded-lg text-center border border-slate-100/50 dark:border-yellow-400/10">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Infrastructure</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-extrabold">{reviewData.infrastructureRating || "4.5"}/5</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-left">
                  <div>
                    <span className="font-extrabold text-blue-700 dark:text-yellow-400 block mb-0.5">
                      ♿ Inclusive Accommodations Support:
                    </span>
                    <p className="text-slate-600 dark:text-yellow-400/80 leading-relaxed text-[11px]">
                      {reviewData.accommodationsDetail}
                    </p>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-700 dark:text-yellow-400 block mb-0.5">
                      🌱 Environment & Psychological Safety:
                    </span>
                    <p className="text-slate-600 dark:text-yellow-400/80 leading-relaxed text-[11px]">
                      {reviewData.environmentDetail}
                    </p>
                  </div>
                  <div>
                    <span className="font-extrabold text-purple-700 dark:text-yellow-400 block mb-0.5">
                      🏢 Infrastructure & Physical Facilities:
                    </span>
                    <p className="text-slate-600 dark:text-yellow-400/80 leading-relaxed text-[11px]">
                      {reviewData.infrastructureDetail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-yellow-400/20 text-[10px]">
                  <a
                    href={reviewData.webScrapedUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-slate-500 hover:text-blue-600"
                  >
                    <Globe className="w-3 h-3" />
                    <span>View Diversity Page Source</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onReScrapeReview(app.id, app.job.company)}
                    className={`px-2 py-1 font-extrabold rounded ${
                      highContrast
                        ? "bg-yellow-400 text-black"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    Re-Scrape Live
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-center text-red-500 font-bold">
                Failed to load accessibility review dataset.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
