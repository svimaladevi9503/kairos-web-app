import { useReducer, useEffect, useCallback } from "react";
import { Job, Application } from "../types";

export type TabType = "home" | "jobs" | "applied" | "chat" | "add" | "profile" | "settings" | "saved";

export type AppState = {
  currentUser: { name: string; email: string } | null;
  activeTab: TabType;
  prefilledChatQuery: string;
  sandboxState: string;
  savedJobIds: string[];
  textScale: "normal" | "large" | "xlarge";
  highContrast: boolean;
  screenReaderHelp: boolean;
  darkMode: boolean;
  zoomFactor: number;
  speechVolume: number;
  autoStartVoice: boolean;
  jobs: Job[];
  applications: Application[];
  loading: boolean;
  selectedCategory: string | null;
  searchQuery: string;
  selectedAccommodations: string[];
};

export type AppAction =
  | { type: "SET_USER"; payload: AppState["currentUser"] }
  | { type: "SET_TAB"; payload: TabType }
  | { type: "SET_PREFILLED_CHAT"; payload: string }
  | { type: "SET_SANDBOX_STATE"; payload: string }
  | { type: "TOGGLE_SAVE_JOB"; payload: string }
  | { type: "SET_TEXT_SCALE"; payload: AppState["textScale"] }
  | { type: "SET_HIGH_CONTRAST"; payload: boolean }
  | { type: "SET_SCREEN_READER_HELP"; payload: boolean }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_ZOOM_FACTOR"; payload: number }
  | { type: "SET_SPEECH_VOLUME"; payload: number }
  | { type: "SET_AUTO_START_VOICE"; payload: boolean }
  | { type: "SET_JOBS_AND_APPS"; payload: { jobs: Job[]; applications: Application[] } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string | null }
  | { type: "TOGGLE_ACCOMMODATION"; payload: string }
  | { type: "CLEAR_FILTERS" }
  | { type: "APPLY_JOB_SUCCESS"; payload: Application }
  | { type: "UPDATE_APPLICATION_DECAY"; payload: { updatedApp: Application; jobId: string } }
  | { type: "ADD_JOB"; payload: Job };

function initAppState(): AppState {
  let currentUser = null;
  try {
    const stored = localStorage.getItem("kairos_user:v1") || localStorage.getItem("kairos_user");
    if (stored) currentUser = JSON.parse(stored);
  } catch {}

  let savedJobIds: string[] = [];
  try {
    const stored = localStorage.getItem("kairos_saved_jobs:v1") || localStorage.getItem("kairos_saved_jobs");
    if (stored) savedJobIds = JSON.parse(stored);
  } catch {}

  let darkMode = localStorage.getItem("kairos_dark_mode") === "true";
  let zoomFactor = 100;
  const savedZoom = localStorage.getItem("zoom_factor");
  if (savedZoom) zoomFactor = parseFloat(savedZoom);

  let speechVolume = 1.0;
  const savedVolume = localStorage.getItem("speech_volume");
  if (savedVolume) speechVolume = parseFloat(savedVolume);

  return {
    currentUser,
    activeTab: "home",
    prefilledChatQuery: "",
    sandboxState: "home_active",
    savedJobIds,
    textScale: "normal",
    highContrast: false,
    screenReaderHelp: false,
    darkMode,
    zoomFactor,
    speechVolume,
    autoStartVoice: false,
    jobs: [],
    applications: [],
    loading: true,
    selectedCategory: null,
    searchQuery: "",
    selectedAccommodations: [],
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      if (action.payload) {
        localStorage.setItem("kairos_user:v1", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("kairos_user:v1");
      }
      return { ...state, currentUser: action.payload };
    case "SET_TAB":
      return { ...state, activeTab: action.payload, prefilledChatQuery: "" };
    case "SET_PREFILLED_CHAT":
      return { ...state, prefilledChatQuery: action.payload, activeTab: "chat" };
    case "SET_SANDBOX_STATE": {
      const sandboxState = action.payload;
      let activeTab = state.activeTab;
      if (sandboxState.startsWith("home_")) activeTab = "home";
      else if (sandboxState.startsWith("jobs_")) activeTab = "jobs";
      else if (sandboxState.startsWith("applied_")) activeTab = "applied";
      else if (sandboxState.startsWith("chat_")) activeTab = "chat";
      return { ...state, sandboxState, activeTab };
    }
    case "TOGGLE_SAVE_JOB": {
      const isSaved = state.savedJobIds.includes(action.payload);
      const nextIds = isSaved
        ? state.savedJobIds.filter((id) => id !== action.payload)
        : [...state.savedJobIds, action.payload];
      localStorage.setItem("kairos_saved_jobs:v1", JSON.stringify(nextIds));
      return { ...state, savedJobIds: nextIds };
    }
    case "SET_TEXT_SCALE":
      return { ...state, textScale: action.payload };
    case "SET_HIGH_CONTRAST":
      return { ...state, highContrast: action.payload };
    case "SET_SCREEN_READER_HELP":
      return { ...state, screenReaderHelp: action.payload };
    case "SET_DARK_MODE":
      localStorage.setItem("kairos_dark_mode", String(action.payload));
      return { ...state, darkMode: action.payload };
    case "SET_ZOOM_FACTOR":
      localStorage.setItem("zoom_factor", String(action.payload));
      return { ...state, zoomFactor: action.payload };
    case "SET_SPEECH_VOLUME":
      localStorage.setItem("speech_volume", String(action.payload));
      return { ...state, speechVolume: action.payload };
    case "SET_AUTO_START_VOICE":
      return { ...state, autoStartVoice: action.payload };
    case "SET_JOBS_AND_APPS":
      return { ...state, jobs: action.payload.jobs, applications: action.payload.applications, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "TOGGLE_ACCOMMODATION": {
      const prev = state.selectedAccommodations;
      const acc = action.payload;
      const next = prev.includes(acc) ? prev.filter((item) => item !== acc) : [...prev, acc];
      return { ...state, selectedAccommodations: next };
    }
    case "CLEAR_FILTERS":
      return { ...state, selectedCategory: null, searchQuery: "", selectedAccommodations: [] };
    case "APPLY_JOB_SUCCESS":
      return { ...state, applications: [action.payload, ...state.applications] };
    case "UPDATE_APPLICATION_DECAY": {
      const updatedApps = state.applications.map((a) =>
        a.id === action.payload.updatedApp.id ? action.payload.updatedApp : a
      );
      const updatedJobs = state.jobs.map((j) =>
        j.id === action.payload.jobId ? { ...j, isActive: false } : j
      );
      return { ...state, applications: updatedApps, jobs: updatedJobs };
    }
    case "ADD_JOB":
      return { ...state, jobs: [action.payload, ...state.jobs] };
    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, undefined, initAppState);

  const fetchData = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/applications"),
      ]);
      const [jobsData, appsData] = await Promise.all([
        jobsRes.json(),
        appsRes.json(),
      ]);
      dispatch({ type: "SET_JOBS_AND_APPS", payload: { jobs: jobsData, applications: appsData } });
    } catch (err) {
      console.error("Error fetching full-stack data:", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { state, dispatch, fetchData };
}
