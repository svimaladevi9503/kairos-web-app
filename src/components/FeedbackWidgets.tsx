import React from "react";
import { Database, Star, Sparkles, Send, Loader2, RefreshCw, FileText, Bot } from "lucide-react";
import { FeedbackEntry } from "../types";

interface FeedbackFormProps {
  highContrast: boolean;
  state: any;
  dispatch: any;
  onSubmit: (e: React.FormEvent) => void;
}

export function FeedbackForm({ highContrast, state, dispatch, onSubmit }: FeedbackFormProps) {
  return (
    <div className={`p-6 rounded-2xl border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-100 shadow-sm"}`}>
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-indigo-600 dark:text-yellow-400" />
        <h3 className="font-extrabold text-base">Train Kairos Models</h3>
      </div>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Rate our matchmaking algorithms, chat accuracy, or AI summaries. Every rating expands our continuous dataset for fine-tuning our Gemini classification weights.
      </p>

      {state.success && (
        <div className={`p-3 mb-4 text-xs font-bold rounded-lg flex items-center gap-2 ${
          highContrast ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400" : "bg-green-50 text-green-800 border border-green-200"
        }`}>
          <Sparkles className="w-4 h-4 text-green-600" />
          <span>Feedback committed to active retraining dataset!</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="evalComponent" className="block text-xs font-bold uppercase mb-1.5 text-slate-500">Evaluation Component</label>
          <select
            id="evalComponent"
            value={state.type}
            aria-label="Evaluation Component"
            onChange={(e) => dispatch({ type: "SET_FORM_FIELD", payload: { field: "type", value: e.target.value } })}
            className={`w-full text-xs p-2.5 rounded-lg border outline-none font-bold ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="job_match">Job Match Suitability Algorithms</option>
            <option value="ai_summary">AI-Generated Accommodations Summary</option>
            <option value="chatbot">Kairos Chat Assistant Helpfulness</option>
          </select>
        </div>

        <div>
          <label htmlFor="evalTarget" className="block text-xs font-bold uppercase mb-1 text-slate-500">Target Feature or Item</label>
          <input
            id="evalTarget"
            type="text"
            aria-label="Target Feature or Item"
            value={state.targetLabel}
            onChange={(e) => dispatch({ type: "SET_FORM_FIELD", payload: { field: "targetLabel", value: e.target.value } })}
            placeholder="E.g. Customer Success Lead, FigmaCraft summary..."
            className={`w-full text-xs px-3 py-2 rounded-lg border font-semibold outline-none ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400"
            }`}
          />
        </div>

        <div>
          <span id="evalRatingLabel" className="block text-xs font-bold uppercase mb-1.5 text-slate-500">Quality / Accuracy Rating</span>
          <div className="flex items-center gap-2" role="radiogroup" aria-labelledby="evalRatingLabel">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={star === state.rating}
                aria-label={`Rate ${star} stars`}
                onClick={() => dispatch({ type: "SET_FORM_FIELD", payload: { field: "rating", value: star } })}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= state.rating
                      ? highContrast
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="evalRemarks" className="block text-xs font-bold uppercase mb-1 text-slate-500">Evaluation Remarks / Comments</label>
          <textarea
            id="evalRemarks"
            rows={4}
            required
            aria-label="Evaluation Remarks or Comments"
            value={state.comment}
            onChange={(e) => dispatch({ type: "SET_FORM_FIELD", payload: { field: "comment", value: e.target.value } })}
            placeholder="Be specific on what worked or how the accommodation classification could be improved..."
            className={`w-full text-xs p-3 rounded-lg border font-semibold outline-none ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          aria-label="Submit Feedback to Model"
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95 ${
            highContrast
              ? "bg-yellow-400 text-black hover:opacity-90"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {state.submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Dataset Entry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Commit Feedback to Model</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

interface FeedbackDiagnosticsProps {
  highContrast: boolean;
  state: any;
  averageRating: string;
  onRefresh: () => void;
}

export function FeedbackDiagnostics({ highContrast, state, averageRating, onRefresh }: FeedbackDiagnosticsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-100 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>Active Retraining Dataset Diagnostics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Continuous alignment and model fine-tuning logs.</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className={`p-2 rounded-lg border ${highContrast ? "border-yellow-400 text-yellow-400" : "border-slate-200 hover:bg-slate-50"}`}
          title="Refresh continuous training database"
          aria-label="Refresh Feedback"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl border text-center ${highContrast ? "border-yellow-400 bg-lilac-900" : "bg-indigo-50/50 border-indigo-100"}`}>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Feedback Committed</span>
          <span className="block text-2xl font-black mt-1 text-slate-800">{state.feedbackList.length} Entries</span>
        </div>

        <div className={`p-4 rounded-xl border text-center ${highContrast ? "border-yellow-400 bg-zinc-950" : "bg-indigo-50/50 border-indigo-100"}`}>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Average Quality Match</span>
          <span className="block text-2xl font-black mt-1 text-yellow-600 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /> {averageRating}/5
          </span>
        </div>

        <div className={`p-4 rounded-xl border text-center ${highContrast ? "border-yellow-400 bg-zinc-950" : "bg-indigo-50/50 border-indigo-100"}`}>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Model Status</span>
          <span className="block text-sm font-bold mt-2.5 text-emerald-600 animate-pulse">
            ● Fine-Tuning Engaged
          </span>
        </div>
      </div>

      <div className={`h-px ${highContrast ? "bg-yellow-400" : "bg-slate-100"} mb-6`}></div>

      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wide">Continuous Feedback Stream</h4>
        {state.loading ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-400">Syncing telemetry dataset...</span>
          </div>
        ) : state.feedbackList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No evaluation feedback received yet.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {state.feedbackList.map((fb: FeedbackEntry) => (
              <div
                key={fb.id}
                className={`p-4 rounded-xl border transition-all text-xs ${
                  highContrast
                    ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    {fb.type === 'job_match' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Job Match
                      </span>
                    )}
                    {fb.type === 'ai_summary' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Summary
                      </span>
                    )}
                    {fb.type === 'chatbot' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Chatbot
                      </span>
                    )}
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">{fb.targetLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">{fb.timestamp}</span>
                    <div className="flex items-center" aria-label={`Rating: ${fb.rating} stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= fb.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed font-semibold bg-white p-2.5 rounded-lg border border-slate-100">
                  {fb.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
