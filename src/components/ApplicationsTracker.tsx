import { useReducer } from "react";
import { Application } from "../types";
import { FileText, Link2Off, AlertTriangle } from "lucide-react";
import { ActiveApplicationCard } from "./ActiveApplicationCard";
import { DecayedApplicationCard } from "./DecayedApplicationCard";

// Compile draft outreach templates for decayed follow-ups
const compileOutreachDraft = (app: Application) => {
  return `Subject: Application Inquiry: ${app.job.title} - [My Name]\n\nDear recruitment team at ${app.job.company},\n\nI recently applied for the ${app.job.title} vacancy through the Kairos Inclusive Portal. I noticed that the online application link has recently been deactivated.\n\nI am extremely enthusiastic about this position, particularly because of your excellent accommodation policies regarding ${app.job.categories.join(" and ")} candidates.\n\nCould you kindly confirm if my application was successfully received, or let me know if I should submit my resume directly via email?\n\nSincerely,\n[Your Name]`;
};

interface ApplicationsTrackerProps {
  applications: Application[];
  onTriggerDecay: (appId: string, channel: "WhatsApp" | "Telegram" | "Email") => void;
  highContrast: boolean;
  stateMode?: "normal" | "loading" | "empty" | "error";
}

type TrackerState = {
  selectedChannels: Record<string, "WhatsApp" | "Telegram" | "Email">;
  copiedAppId: string | null;
  expandedReviews: Record<string, boolean>;
  reviewsData: Record<string, any>;
  reviewsLoading: Record<string, boolean>;
};

type TrackerAction =
  | { type: "SET_CHANNEL"; payload: { appId: string; channel: "WhatsApp" | "Telegram" | "Email" } }
  | { type: "SET_COPIED"; payload: string | null }
  | { type: "TOGGLE_REVIEW"; payload: string }
  | { type: "SET_REVIEW_DATA"; payload: { appId: string; data: any } }
  | { type: "SET_REVIEW_LOADING"; payload: { appId: string; loading: boolean } };

function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case "SET_CHANNEL":
      return { ...state, selectedChannels: { ...state.selectedChannels, [action.payload.appId]: action.payload.channel } };
    case "SET_COPIED":
      return { ...state, copiedAppId: action.payload };
    case "TOGGLE_REVIEW":
      return { ...state, expandedReviews: { ...state.expandedReviews, [action.payload]: !state.expandedReviews[action.payload] } };
    case "SET_REVIEW_DATA":
      return { ...state, reviewsData: { ...state.reviewsData, [action.payload.appId]: action.payload.data } };
    case "SET_REVIEW_LOADING":
      return { ...state, reviewsLoading: { ...state.reviewsLoading, [action.payload.appId]: action.payload.loading } };
    default:
      return state;
  }
}

export default function ApplicationsTracker({
  applications,
  onTriggerDecay,
  highContrast,
  stateMode = "normal",
}: ApplicationsTrackerProps) {
  const [state, dispatch] = useReducer(trackerReducer, {
    selectedChannels: {},
    copiedAppId: null,
    expandedReviews: {},
    reviewsData: {},
    reviewsLoading: {},
  });

  const toggleReview = async (appId: string, companyName: string) => {
    dispatch({ type: "TOGGLE_REVIEW", payload: appId });
    if (state.expandedReviews[appId] || state.reviewsData[appId]) return;

    try {
      dispatch({ type: "SET_REVIEW_LOADING", payload: { appId, loading: true } });
      const response = await fetch(`/api/company-review/${encodeURIComponent(companyName)}`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_REVIEW_DATA", payload: { appId, data } });
      }
    } catch (err) {
      console.error("Error fetching company review:", err);
    } finally {
      dispatch({ type: "SET_REVIEW_LOADING", payload: { appId, loading: false } });
    }
  };

  const reScrapeReview = async (appId: string, companyName: string) => {
    try {
      dispatch({ type: "SET_REVIEW_LOADING", payload: { appId, loading: true } });
      const response = await fetch(`/api/company-review/${encodeURIComponent(companyName)}?force=true`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_REVIEW_DATA", payload: { appId, data } });
      }
    } catch (err) {
      console.error("Error re-scraping:", err);
    } finally {
      dispatch({ type: "SET_REVIEW_LOADING", payload: { appId, loading: false } });
    }
  };

  const handleSetChannel = (appId: string, channel: "WhatsApp" | "Telegram" | "Email") => {
    dispatch({ type: "SET_CHANNEL", payload: { appId, channel } });
  };

  const handleCopyOutreachText = (text: string, appId: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ type: "SET_COPIED", payload: appId });
    setTimeout(() => dispatch({ type: "SET_COPIED", payload: null }), 2500);
  };

  if (stateMode === "loading") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-24 rounded-xl ${highContrast ? "bg-zinc-900 border border-yellow-400" : "bg-slate-200"}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`h-80 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
          <div className={`h-80 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
        </div>
      </div>
    );
  }

  if (stateMode === "error") {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-red-50/50 border-red-200 text-red-800"
      }`}>
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4 ease-out duration-300" />
        <h3 className="font-extrabold text-lg">Server Connection Expired</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          We experienced a connectivity timeout while syncing with the backend database. Active follow-up alerts and Webhook events could not be refreshed.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 text-xs font-bold rounded-lg ${
            highContrast ? "bg-yellow-400 text-black" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Force Synchronize
        </button>
      </div>
    );
  }

  if (stateMode === "empty" || applications.length === 0) {
    return (
      <div className={`p-10 text-center rounded-2xl border-2 border-dashed ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-slate-50/50 border-slate-200"
      }`}>
        <FileText className="w-14 h-14 mx-auto text-slate-400 mb-4" />
        <h3 className="font-extrabold text-lg">Your Unified Application Tracker Board is Empty</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          You haven't applied to any job postings yet. Once you submit an application through the Find Jobs portal, it will be automatically tracked here with automated follow-up decay reminders!
        </p>
      </div>
    );
  }

  const activeApps = applications.filter((app) => app.status !== "link_decayed");
  const decayedApps = applications.filter((app) => app.status === "link_decayed");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-xl border ${highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-blue-50/50 border-blue-100 text-blue-900"}`}>
          <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Total Applications</span>
          <span className="text-3xl font-extrabold block mt-1">{applications.length}</span>
        </div>
        <div className={`p-5 rounded-xl border ${highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
          <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Active In-Review</span>
          <span className="text-3xl font-extrabold block mt-1">{activeApps.length}</span>
        </div>
        <div className={`p-5 rounded-xl border ${highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
          <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Follow-Up Required</span>
          <span className="text-3xl font-extrabold block mt-1">{decayedApps.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-yellow-400" />
            <h3 className="font-extrabold text-xl tracking-tight">Active Applications</h3>
          </div>

          {activeApps.length === 0 ? (
            <div className={`p-8 text-center border-2 border-dashed rounded-xl ${highContrast ? "border-yellow-400 text-yellow-400" : "border-slate-200 text-slate-400"}`}>
              <p className="font-semibold text-sm">No active applications currently tracked.</p>
              <p className="text-xs mt-1">Apply for a job under 'Find Jobs' to populate this dashboard.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeApps.map((app) => (
                <ActiveApplicationCard
                  key={app.id}
                  app={app}
                  highContrast={highContrast}
                  currentChannel={state.selectedChannels[app.id] || "WhatsApp"}
                  isReviewExpanded={!!state.expandedReviews[app.id]}
                  isReviewLoading={!!state.reviewsLoading[app.id]}
                  reviewData={state.reviewsData[app.id]}
                  onSetChannel={handleSetChannel}
                  onTriggerDecay={onTriggerDecay}
                  onToggleReview={toggleReview}
                  onReScrapeReview={reScrapeReview}
                />
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Link2Off className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <h3 className="font-extrabold text-xl tracking-tight">Follow-Up & Outreach</h3>
          </div>

          {decayedApps.length === 0 ? (
            <div className={`p-8 text-center border-2 border-dashed rounded-xl ${highContrast ? "border-yellow-400 text-yellow-400" : "border-slate-200 text-slate-400"}`}>
              <p className="font-semibold text-sm">No deactivated links detected.</p>
              <p className="text-xs mt-1">Activate the simulated decay trigger to observe follow-up automation workflows.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {decayedApps.map((app) => (
                <DecayedApplicationCard
                  key={app.id}
                  app={app}
                  highContrast={highContrast}
                  copiedAppId={state.copiedAppId}
                  onCopyOutreachText={handleCopyOutreachText}
                  outreachTemplate={compileOutreachDraft(app)}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
