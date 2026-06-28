import React from "react";
import { Job } from "../types";
import { MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Bot, Check, Star, Share2, Bookmark } from "lucide-react";

export function JobCardHeader({ job, highContrast, getCategoryTheme }: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
      <div className="flex gap-4 items-start">
        {job.logoUrl ? (
          <div className={`w-14 h-14 rounded-xl border flex items-center justify-center bg-white p-1 overflow-hidden shrink-0 ${highContrast ? "border-yellow-400" : "border-slate-100"}`}>
            <img src={job.logoUrl} alt={`${job.company} logo`} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-extrabold text-2xl uppercase shrink-0 ${
            highContrast ? "border-yellow-400 bg-zinc-900 text-yellow-400" : "bg-lilac-100 border-lilac-200 text-lilac-700"
          }`}>
            {job.company.substring(0, 1)}
          </div>
        )}

        <div>
          <h3 id={`job-title-${job.id}`} className="font-extrabold text-lg sm:text-xl leading-snug tracking-tight">
            {job.title}
          </h3>
          <p className={`font-semibold text-sm mt-0.5 ${highContrast ? "text-yellow-400" : "text-slate-500"}`}>
            {job.company}
          </p>

          {job.highlightedSkills && job.highlightedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.highlightedSkills.map((sk: string) => (
                <span key={sk} className="text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded-full">
                  ✓ Skills Match: {sk}
                </span>
              ))}
            </div>
          )}

          {job.compatibilityReason && (
            <p className={`text-[11px] font-medium italic mt-2 ${highContrast ? "text-yellow-300" : "text-slate-500"}`}>
              {job.compatibilityReason}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.salary}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.postedAt}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 self-start sm:self-auto items-center">
        {job.compatibilityScore !== undefined && (
          <span className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border ${
            job.compatibilityScore >= 75
              ? highContrast
                ? "border-yellow-400 text-yellow-400"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-lilac-50 text-lilac-800 border-lilac-200"
          }`}>
            <Sparkles className="w-3 h-3 animate-pulse text-emerald-600 dark:text-yellow-400" />
            <span>{job.compatibilityScore}% Match</span>
          </span>
        )}

        {job.categories.map((cat: string) => {
          const config = getCategoryTheme(cat);
          const CatIcon = config.icon;

          return (
            <span
              key={cat}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                highContrast ? config.hcBg : config.bg
              }`}
            >
              <CatIcon className="w-3 h-3" />
              <span>{cat}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function JobCardSummary({ job, highContrast, state, dispatch, handleSendFeedback, onReadAloud }: any) {
  return (
    <div className={`rounded-xl p-4 mb-4 border-l-4 ${
      highContrast ? "bg-zinc-900 border-yellow-400" : "bg-lilac-50/50 border-lilac-600"
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${highContrast ? "text-yellow-400" : "text-lilac-800"}`}>
          <Sparkles className="w-4 h-4 text-lilac-600 dark:text-yellow-400 animate-pulse" />
          <span>AI Plain-Language Job Summary</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_FB_FORM" })}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors border ${
              highContrast
                ? "border-yellow-400 text-yellow-400 bg-lilac-950 hover:bg-lilac-900"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            ⭐ Rate Match
          </button>
          {onReadAloud && (
            <button
              type="button"
              onClick={() => onReadAloud(job.aiSummary)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                highContrast ? "border border-yellow-400 text-yellow-400 bg-lilac-950 hover:bg-lilac-900" : "bg-lilac-100 hover:bg-lilac-200 text-lilac-800"
              }`}
              title="Click to hear plain language summary read aloud"
            >
              🔊 Listen
            </button>
          )}
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${highContrast ? "text-yellow-400" : "text-slate-700"}`}>
        {job.aiSummary}
      </p>

      {state.showFbForm && (
        <div className={`mt-4 p-4 rounded-lg border-t animate-in fade-in duration-200 ${
          highContrast ? "border-yellow-400 bg-lilac-950" : "border-slate-100 bg-white"
        }`}>
          {state.fbSubmitted ? (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              ✓ Model feedback recorded for retraining dataset!
            </span>
          ) : (
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-600">Rate match quality & AI accommodations accuracy:</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      aria-label={`Rate ${star} stars`}
                      onClick={() => dispatch({ type: "SET_RATING", payload: star })}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (state.feedbackRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSendFeedback}
                  disabled={!state.feedbackRating || state.submittingFb}
                  className={`px-3 py-1 text-[11px] font-bold rounded ${
                    highContrast ? "bg-yellow-400 text-black" : "bg-lilac-600 text-white hover:bg-lilac-700"
                  }`}
                >
                  {state.submittingFb ? "Saving..." : "Submit to Dataset"}
                </button>
              </div>
              <input
                type="text"
                aria-label="Feedback comment"
                placeholder="Optional: What was wrong or correct? (e.g. skills matching or policy extraction...)"
                value={state.feedbackComment}
                onChange={(e) => dispatch({ type: "SET_COMMENT", payload: e.target.value })}
                className={`w-full text-[11px] p-2 rounded border outline-none ${
                  highContrast
                    ? "bg-zinc-950 border-yellow-400 text-yellow-400"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400"
                }`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function JobCardDetails({ job, highContrast, state, dispatch }: any) {
  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_EXPANDED" })}
        className={`flex items-center gap-1.5 text-xs font-bold py-1 focus:outline-none transition-colors ${
          highContrast ? "text-yellow-400 hover:underline" : "text-slate-500 hover:text-slate-800"
        }`}
        aria-expanded={state.isExpanded}
      >
        <span>{state.isExpanded ? "Hide Accommodation Details" : "View Extracted Accommodation Details"}</span>
        {state.isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {state.isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 animate-in fade-in duration-200">
          <div className={`p-4 rounded-lg border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-slate-50 border-slate-100"}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-yellow-400 mb-2">
              Digital & Assistive Tools
            </h4>
            <ul className="space-y-1.5">
              {job.accommodations.tooling.map((t: string) => (
                <li key={t} className="text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-yellow-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`p-4 rounded-lg border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-slate-50 border-slate-100"}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-yellow-400 mb-2">
              Workplace Rules & Norms
            </h4>
            <ul className="space-y-1.5">
              {job.accommodations.policy.map((p: string) => (
                <li key={p} className="text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 dark:text-yellow-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function JobCardActions({ job, applied, highContrast, state, onApply, onAskAI, handleShareClick, onToggleSave, isSaved }: any) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        {applied ? (
          <button
            type="button"
            disabled
            className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold rounded-lg border transition-all ${
              highContrast
                ? "bg-zinc-900 border-yellow-400 text-yellow-400 cursor-not-allowed"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-not-allowed"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Applied</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job.id)}
            className={`px-5 py-2.5 text-sm font-extrabold rounded-lg transition-all ${
              highContrast
                ? "bg-yellow-400 text-black border border-yellow-400 hover:bg-lilac-900 hover:text-yellow-400 active:translate-y-0.5"
                : "bg-lilac-600 hover:bg-lilac-700 text-white shadow-sm hover:shadow active:translate-y-0.5"
            }`}
          >
            Apply Now
          </button>
        )}

        <button
          type="button"
          onClick={() => onAskAI(job.title, job.company)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-lg border transition-all ${
            highContrast
              ? "border-yellow-400 hover:bg-lilac-900 text-yellow-400 active:translate-y-0.5"
              : "border-slate-200 hover:bg-slate-50 text-slate-700 active:translate-y-0.5"
          }`}
        >
          <Bot className="w-4 h-4 text-lilac-600 dark:text-yellow-400" />
          <span>Ask Kairos AI</span>
        </button>

        <button
          type="button"
          onClick={handleShareClick}
          className={`p-2.5 rounded-lg border transition-all relative flex items-center justify-center ${
            state.copied
              ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-950/40 dark:border-green-900 dark:text-green-400"
              : highContrast
              ? "border-yellow-400 hover:bg-zinc-900 text-yellow-400"
              : "border-slate-200 hover:bg-slate-50 text-slate-600 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900"
          }`}
          title="Share Job"
          aria-label="Share Job Link"
        >
          {state.copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onToggleSave && onToggleSave(job.id)}
          className={`p-2.5 rounded-lg border transition-all flex items-center justify-center ${
            isSaved
              ? highContrast
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-amber-100 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400"
              : highContrast
              ? "border-yellow-400 hover:bg-zinc-900 text-yellow-400"
              : "border-slate-200 hover:bg-slate-50 text-slate-600 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900"
          }`}
          title={isSaved ? "Saved Job" : "Save Job"}
          aria-label={isSaved ? "Saved Job" : "Save Job"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current text-amber-500 dark:text-amber-400" : ""}`} />
        </button>
      </div>

      <span className={`text-xs font-bold ${highContrast ? "text-yellow-400" : "text-slate-400"}`}>
        Full-Time Position
      </span>
    </div>
  );
}
