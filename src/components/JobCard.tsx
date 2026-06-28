import { useReducer } from "react";
import { Job } from "../types";
import { Eye, VolumeX, MicOff, Sparkles } from "lucide-react";
import { JobCardHeader, JobCardSummary, JobCardDetails, JobCardActions } from "./JobCardWidgets";

// Pure function moved outside of component to prevent rebuild on every render
const getCategoryTheme = (cat: string) => {
  switch (cat) {
    case "Vision Impaired":
      return {
        icon: Eye,
        bg: "bg-teal-50 text-teal-700 border-teal-200",
        hcBg: "border-yellow-400 text-yellow-400",
      };
    case "Orally Challenged":
      return {
        icon: MicOff,
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        hcBg: "border-yellow-400 text-yellow-400",
      };
    case "Audibly Challenged":
      return {
        icon: VolumeX,
        bg: "bg-pink-50 text-pink-700 border-pink-200",
        hcBg: "border-yellow-400 text-yellow-400",
      };
    default:
      return {
        icon: Sparkles,
        bg: "bg-slate-50 text-slate-700 border-slate-200",
        hcBg: "border-yellow-400 text-yellow-400",
      };
  }
};

interface JobCardProps {
  key?: string;
  job: Job;
  applied: boolean;
  onApply: (id: string) => void;
  onAskAI: (jobName: string, company: string) => void;
  highContrast: boolean;
  onReadAloud?: (text: string) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

type JobCardState = {
  isExpanded: boolean;
  copied: boolean;
  feedbackRating: number | null;
  feedbackComment: string;
  submittingFb: boolean;
  fbSubmitted: boolean;
  showFbForm: boolean;
};

type JobCardAction =
  | { type: "TOGGLE_EXPANDED" }
  | { type: "SET_COPIED"; payload: boolean }
  | { type: "SET_RATING"; payload: number | null }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SET_SUBMITTING_FB"; payload: boolean }
  | { type: "SET_FB_SUBMITTED"; payload: boolean }
  | { type: "TOGGLE_FB_FORM" }
  | { type: "RESET_FB_FORM" };

function jobCardReducer(state: JobCardState, action: JobCardAction): JobCardState {
  switch (action.type) {
    case "TOGGLE_EXPANDED":
      return { ...state, isExpanded: !state.isExpanded };
    case "SET_COPIED":
      return { ...state, copied: action.payload };
    case "SET_RATING":
      return { ...state, feedbackRating: action.payload };
    case "SET_COMMENT":
      return { ...state, feedbackComment: action.payload };
    case "SET_SUBMITTING_FB":
      return { ...state, submittingFb: action.payload };
    case "SET_FB_SUBMITTED":
      return { ...state, fbSubmitted: action.payload };
    case "TOGGLE_FB_FORM":
      return { ...state, showFbForm: !state.showFbForm };
    case "RESET_FB_FORM":
      return { ...state, fbSubmitted: false, showFbForm: false, feedbackRating: null, feedbackComment: "" };
    default:
      return state;
  }
}

export default function JobCard({
  job,
  applied,
  onApply,
  onAskAI,
  highContrast,
  onReadAloud,
  isSaved = false,
  onToggleSave,
}: JobCardProps) {
  const [state, dispatch] = useReducer(jobCardReducer, {
    isExpanded: false,
    copied: false,
    feedbackRating: null,
    feedbackComment: "",
    submittingFb: false,
    fbSubmitted: false,
    showFbForm: false,
  });

  const handleSendFeedback = async () => {
    if (!state.feedbackRating) return;
    try {
      dispatch({ type: "SET_SUBMITTING_FB", payload: true });
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job_match",
          targetId: job.id,
          targetLabel: `${job.title} at ${job.company}`,
          rating: state.feedbackRating,
          comment: state.feedbackComment || `User rated this match as ${state.feedbackRating}/5 stars.`,
        }),
      });
      if (res.ok) {
        dispatch({ type: "SET_FB_SUBMITTED", payload: true });
        setTimeout(() => {
          dispatch({ type: "RESET_FB_FORM" });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_SUBMITTING_FB", payload: false });
    }
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}?jobId=${job.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      dispatch({ type: "SET_COPIED", payload: true });
      setTimeout(() => dispatch({ type: "SET_COPIED", payload: false }), 2000);
      if (onReadAloud) {
        onReadAloud("Share link copied to clipboard.");
      }
    }).catch((err) => {
      console.error("Failed to copy share link: ", err);
    });
  };

  return (
    <article
      className={`border rounded-xl p-5 sm:p-6 transition-all shadow-sm ${
        applied
          ? highContrast
            ? "bg-lilac-900 border-yellow-400 opacity-90"
            : "bg-slate-50/50 border-slate-200 opacity-90"
          : highContrast
          ? "bg-lilac-950 border-yellow-400 text-yellow-400 hover:bg-lilac-900"
          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:shadow"
      }`}
      aria-labelledby={`job-title-${job.id}`}
    >
      <JobCardHeader job={job} highContrast={highContrast} getCategoryTheme={getCategoryTheme} />
      <JobCardSummary 
        job={job} 
        highContrast={highContrast} 
        state={state} 
        dispatch={dispatch} 
        handleSendFeedback={handleSendFeedback} 
        onReadAloud={onReadAloud} 
      />
      <JobCardDetails job={job} highContrast={highContrast} state={state} dispatch={dispatch} />
      <div className={`h-px mb-4 ${highContrast ? "bg-yellow-400" : "bg-slate-100"}`}></div>
      <JobCardActions 
        job={job} 
        applied={applied} 
        highContrast={highContrast} 
        state={state} 
        onApply={onApply} 
        onAskAI={onAskAI} 
        handleShareClick={handleShareClick} 
        onToggleSave={onToggleSave} 
        isSaved={isSaved} 
      />
    </article>
  );
}
