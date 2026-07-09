import { useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import { Loader2 } from "lucide-react";
import { AppFooter } from "./components/AppFooter";
import { JobsTabContent } from "./components/JobsTabContent";
import { AdditionalTabs } from "./components/AdditionalTabs";

import { useAppState } from "./hooks/useAppState";
import { useSpeech } from "./hooks/useSpeech";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useJobFiltering } from "./hooks/useJobFiltering";

export default function App() {
  const { state, dispatch, fetchData } = useAppState();
  const { handleReadAloud, speakAnnouncement } = useSpeech(state.speechVolume, state.screenReaderHelp);

  // Synchronize document element with theme states
  useEffect(() => {
    const root = document.documentElement;
    if (state.highContrast || state.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [state.darkMode, state.highContrast]);

  // Handle shared job ID link redirect
  useEffect(() => {
    if (state.jobs.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const sharedJobId = params.get("jobId");
      if (sharedJobId) {
        const matchedJob = state.jobs.find((j) => j.id === sharedJobId);
        if (matchedJob) {
          dispatch({ type: "SET_TAB", payload: "jobs" });
          dispatch({ type: "SET_SEARCH_QUERY", payload: matchedJob.title });
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          const tid = setTimeout(() => {
            handleReadAloud(`Viewing shared position: ${matchedJob.title} at ${matchedJob.company}.`);
          }, 800);
          return () => clearTimeout(tid);
        }
      }
    }
  }, [state.jobs, dispatch, handleReadAloud]);

  const filteredJobs = useJobFiltering(
    state.jobs,
    state.selectedCategory,
    state.searchQuery,
    state.selectedAccommodations
  );

  useGlobalShortcuts(
    state,
    dispatch,
    handleReadAloud,
    speakAnnouncement,
    filteredJobs.length
  );

  const handleApplyJob = async (jobId: string) => {
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (response.ok) {
        const newApp = await response.json();
        dispatch({ type: "APPLY_JOB_SUCCESS", payload: newApp });
        speakAnnouncement("Successfully applied to job position.");
      } else {
        throw new Error("Server returned an error");
      }
    } catch (err) {
      console.error(err);
      speakAnnouncement("An error occurred while applying. Please try again.");
      alert("An error occurred while applying to the job.");
    }
  };

  const handleTriggerDecay = async (appId: string, channel: "WhatsApp" | "Telegram" | "Email") => {
    try {
      const response = await fetch("/api/trigger-decay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, channel }),
      });
      if (response.ok) {
        const updatedApp = await response.json();
        dispatch({ type: "UPDATE_APPLICATION_DECAY", payload: { updatedApp, jobId: updatedApp.jobId } });
        speakAnnouncement(`Alert triggered. Automated ${channel} follow-up outreach draft formulated.`);
      } else {
        throw new Error("Server returned an error");
      }
    } catch (err) {
      console.error(err);
      speakAnnouncement("An error occurred while triggering the alert.");
      alert("An error occurred while simulating the automated alert.");
    }
  };

  const getTextScaleClass = () => {
    switch (state.textScale) {
      case "large": return "text-[18px]";
      case "xlarge": return "text-[20px]";
      default: return "text-[16px]";
    }
  };

  if (!state.currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => dispatch({ type: "SET_USER", payload: user })}
        highContrast={state.highContrast}
        onContrastToggle={() => dispatch({ type: "SET_HIGH_CONTRAST", payload: !state.highContrast })}
        textScale={state.textScale}
        onTextScaleChange={(s) => dispatch({ type: "SET_TEXT_SCALE", payload: s })}
        darkMode={state.darkMode}
        onDarkModeToggle={() => dispatch({ type: "SET_DARK_MODE", payload: !state.darkMode })}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all selection:bg-lilac-brand selection:text-slate-900 ${getTextScaleClass()} ${
        state.highContrast ? "bg-lilac-950 text-yellow-400" : state.darkMode ? "bg-lilac-950 text-[#FAF8F5]" : "bg-lilac-50 text-slate-800"
      }`}
      style={{ zoom: `${state.zoomFactor}%` }}
    >
      <Navbar
        activeTab={state.activeTab}
        setActiveTab={(tab) => dispatch({ type: "SET_TAB", payload: tab })}
        textScale={state.textScale}
        setTextScale={(s) => dispatch({ type: "SET_TEXT_SCALE", payload: s })}
        highContrast={state.highContrast}
        setHighContrast={(v) => dispatch({ type: "SET_HIGH_CONTRAST", payload: v })}
        darkMode={state.darkMode}
        setDarkMode={(v) => dispatch({ type: "SET_DARK_MODE", payload: v })}
        onDarkModeToggle={() => dispatch({ type: "SET_DARK_MODE", payload: !state.darkMode })}
        screenReaderHelp={state.screenReaderHelp}
        setScreenReaderHelp={(v) => dispatch({ type: "SET_SCREEN_READER_HELP", payload: v })}
        onLogout={() => dispatch({ type: "SET_USER", payload: null })}
        searchQuery={state.searchQuery}
        setSearchQuery={(q) => dispatch({ type: "SET_SEARCH_QUERY", payload: q })}
        speechVolume={state.speechVolume}
        setSpeechVolume={(v) => dispatch({ type: "SET_SPEECH_VOLUME", payload: v })}
        zoomFactor={state.zoomFactor}
        setZoomFactor={(v) => dispatch({ type: "SET_ZOOM_FACTOR", payload: v })}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-lilac-600 animate-spin" />
            <span className="font-extrabold text-slate-500">Loading Kairos Inclusive Portal...</span>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {state.activeTab === "jobs" && (
              <JobsTabContent 
                state={state} 
                dispatch={dispatch} 
                filteredJobs={filteredJobs} 
                handleApplyJob={handleApplyJob} 
                handleReadAloud={handleReadAloud} 
                speakAnnouncement={speakAnnouncement} 
                fetchData={fetchData} 
              />
            )}

            <AdditionalTabs 
              state={state} 
              dispatch={dispatch} 
              handleApplyJob={handleApplyJob} 
              handleReadAloud={handleReadAloud} 
              speakAnnouncement={speakAnnouncement} 
              handleTriggerDecay={handleTriggerDecay} 
              fetchData={fetchData} 
            />
          </div>
        )}
      </main>

      <AppFooter highContrast={state.highContrast} />
    </div>
  );
}
