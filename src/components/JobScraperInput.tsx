import React from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export function JobScraperInput({
  state,
  dispatch,
  handlePasteSampleText,
  handleClassifyJob,
  highContrast,
}: any) {
  return (
    <div className="md:col-span-7 space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="jobInput" className="block text-xs font-bold uppercase tracking-wider">Paste Job Description Text</label>
        <button
          type="button"
          onClick={handlePasteSampleText}
          className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
            highContrast
              ? "border border-yellow-400 hover:bg-lilac-900"
              : "bg-slate-200 hover:bg-slate-300 text-slate-700"
          }`}
        >
          Insert Accessible Sample
        </button>
      </div>

      <textarea
        id="jobInput"
        rows={10}
        value={state.inputText}
        onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
        disabled={state.loading}
        placeholder="Paste description text from Naukri, LinkedIn, or corporate portals..."
        className={`w-full p-4 rounded-xl border text-sm font-semibold focus:ring-2 focus:outline-none ${
          highContrast
            ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400"
            : "bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
        }`}
      ></textarea>

      {state.errorMsg && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-yellow-400 bg-red-50 dark:bg-zinc-950 border border-red-200 dark:border-yellow-400 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.errorMsg}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleClassifyJob}
        disabled={state.loading || !state.inputText.trim()}
        className={`w-full py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all ${
          state.loading
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border"
            : highContrast
            ? "bg-yellow-400 text-black border border-yellow-400 hover:bg-lilac-900 hover:text-yellow-400"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:translate-y-0.5"
        }`}
      >
        {state.loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Classify & Extract with AI</span>
          </>
        )}
      </button>
    </div>
  );
}
