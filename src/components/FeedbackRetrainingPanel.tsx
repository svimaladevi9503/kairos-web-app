import React, { useReducer, useEffect, useCallback } from "react";
import { FeedbackEntry } from "../types";
import { FeedbackForm, FeedbackDiagnostics } from "./FeedbackWidgets";

interface FeedbackRetrainingPanelProps {
  highContrast: boolean;
}

type FeedbackState = {
  feedbackList: FeedbackEntry[];
  loading: boolean;
  submitting: boolean;
  success: boolean;
  type: 'job_match' | 'ai_summary' | 'chatbot';
  rating: number;
  comment: string;
  targetLabel: string;
};

type FeedbackAction =
  | { type: "SET_FEEDBACK_LIST"; payload: FeedbackEntry[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUCCESS"; payload: boolean }
  | { type: "SET_FORM_FIELD"; payload: { field: keyof FeedbackState; value: any } }
  | { type: "RESET_FORM" };

function feedbackReducer(state: FeedbackState, action: FeedbackAction): FeedbackState {
  switch (action.type) {
    case "SET_FEEDBACK_LIST":
      return { ...state, feedbackList: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "SET_FORM_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "RESET_FORM":
      return { ...state, comment: '', targetLabel: 'General Platform Feed', rating: 5, type: 'job_match' };
    default:
      return state;
  }
}

export default function FeedbackRetrainingPanel({ highContrast }: FeedbackRetrainingPanelProps) {
  const [state, dispatch] = useReducer(feedbackReducer, {
    feedbackList: [],
    loading: true,
    submitting: false,
    success: false,
    type: 'job_match',
    rating: 5,
    comment: '',
    targetLabel: 'General Platform Feed',
  });

  const fetchFeedback = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await fetch("/api/feedback");
      const data = await res.json();
      dispatch({ type: "SET_FEEDBACK_LIST", payload: data });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.comment.trim()) return;

    try {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: state.type,
          rating: state.rating,
          comment: state.comment,
          targetLabel: state.targetLabel || "General Portal",
        }),
      });

      if (res.ok) {
        dispatch({ type: "SET_SUCCESS", payload: true });
        dispatch({ type: "RESET_FORM" });
        await fetchFeedback();
        setTimeout(() => dispatch({ type: "SET_SUCCESS", payload: false }), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const averageRating = state.feedbackList.length
    ? (state.feedbackList.reduce((sum, f) => sum + f.rating, 0) / state.feedbackList.length).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <FeedbackForm highContrast={highContrast} state={state} dispatch={dispatch} onSubmit={handleSubmit} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <FeedbackDiagnostics highContrast={highContrast} state={state} averageRating={averageRating} onRefresh={fetchFeedback} />
      </div>
    </div>
  );
}
