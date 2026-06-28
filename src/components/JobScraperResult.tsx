import React from "react";
import { Sparkles, Loader2, FileText, CheckCircle2 } from "lucide-react";

export function JobScraperResult({ state, highContrast }: any) {
  return (
    <div className="md:col-span-5">
      {state.loading && (
        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px] ${
          highContrast ? "border-yellow-400" : "border-slate-200 bg-slate-50/50"
        }`}>
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-yellow-400 animate-spin" />
          <div className="space-y-1">
            <span className="block text-sm font-extrabold">Analyzing with Gemini AI</span>
            <span className="block text-xs text-slate-400 dark:text-yellow-400/80 animate-pulse">{state.statusMessage}</span>
          </div>
        </div>
      )}

      {!state.loading && !state.successJob && (
        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px] ${
          highContrast ? "border-yellow-400" : "border-slate-200"
        }`}>
          <FileText className="w-10 h-10 text-slate-300" />
          <div>
            <span className="block text-sm font-bold text-slate-500">Awaiting AI Input</span>
            <span className="block text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
              Paste description and trigger classifier to view extracted accommodations here.
            </span>
          </div>
        </div>
      )}

      {!state.loading && state.successJob && (
        <div className={`border-2 rounded-xl p-5 space-y-4 animate-in zoom-in-95 duration-300 ${
          highContrast ? "border-yellow-400" : "border-emerald-200 bg-emerald-50/10"
        }`}>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-yellow-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-extrabold text-sm uppercase tracking-wider">AI Classification Complete</span>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Extracted Job Title</span>
            <span className="block text-base font-extrabold leading-tight">{state.successJob.title}</span>
            <span className="block text-xs font-semibold text-slate-500">{state.successJob.company} • {state.successJob.location}</span>
          </div>

          <div className={`h-px ${highContrast ? "bg-yellow-400" : "bg-slate-100"}`}></div>

          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Matched Suitability</span>
            <div className="flex flex-wrap gap-1">
              {state.successJob.categories.map((c: string) => (
                <span
                  key={c}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    highContrast
                      ? "border-yellow-400 text-yellow-400"
                      : "bg-blue-50 border-blue-100 text-blue-800"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tooling Support</span>
              <ul className="space-y-1">
                {state.successJob.accommodations.tooling.map((t: string) => (
                  <li key={t} className="font-semibold leading-tight text-slate-600 dark:text-yellow-400/80">• {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Policy Norms</span>
              <ul className="space-y-1">
                {state.successJob.accommodations.policy.map((p: string) => (
                  <li key={p} className="font-semibold leading-tight text-slate-600 dark:text-yellow-400/80">• {p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`p-3 rounded-lg text-xs leading-relaxed ${
            highContrast ? "bg-zinc-950 border border-yellow-400" : "bg-blue-50/50 text-slate-700"
          }`}>
            <span className="block font-bold text-blue-800 dark:text-yellow-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Plain-Language Summary
            </span>
            {state.successJob.aiSummary}
          </div>
        </div>
      )}
    </div>
  );
}
