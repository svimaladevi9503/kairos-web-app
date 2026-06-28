import React from "react";
import SavedJobs from "./SavedJobs";
import ApplicationsTracker from "./ApplicationsTracker";
import ChatbotPanel from "./ChatbotPanel";
import JobScraper from "./JobScraper";
import UserProfilePanel from "./UserProfilePanel";
import SettingsPanel from "./SettingsPanel";
import HomeDashboard from "./HomeDashboard";

export function AdditionalTabs({
  state,
  dispatch,
  handleApplyJob,
  handleReadAloud,
  speakAnnouncement,
  handleTriggerDecay,
  fetchData
}: any) {
  return (
    <>
      {state.activeTab === "home" && (
        <HomeDashboard
          jobs={state.jobs}
          applications={state.applications}
          highContrast={state.highContrast}
          stateMode={state.sandboxState === "home_active" ? "normal" : state.sandboxState.split("_")[1] as any}
          onTabChange={(tab) => dispatch({ type: "SET_TAB", payload: tab })}
          onResetAll={fetchData}
        />
      )}

      {state.activeTab === "saved" && (
        <SavedJobs
          jobs={state.jobs}
          savedJobIds={state.savedJobIds}
          onToggleSave={(id) => {
            dispatch({ type: "TOGGLE_SAVE_JOB", payload: id });
            handleReadAloud(state.savedJobIds.includes(id) ? "Job removed from saved list." : "Job saved successfully.");
          }}
          applications={state.applications}
          onApply={handleApplyJob}
          onAskAI={(title, company) => dispatch({ type: "SET_PREFILLED_CHAT", payload: `Tell me more about the specific accommodations available for the ${title} position at ${company}.` })}
          highContrast={state.highContrast}
          onReadAloud={handleReadAloud}
          onBackToJobs={() => dispatch({ type: "SET_TAB", payload: "jobs" })}
        />
      )}

      {state.activeTab === "applied" && (
        <ApplicationsTracker
          applications={state.applications}
          onTriggerDecay={handleTriggerDecay}
          highContrast={state.highContrast}
          stateMode={state.sandboxState === "applied_active" ? "normal" : state.sandboxState.split("_")[1] as any}
        />
      )}

      {state.activeTab === "chat" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight">AI Conversational Discovery</h2>
            <p className={`text-xs font-semibold mt-1 ${state.highContrast ? "text-yellow-400" : "text-slate-500"}`}>
              Ask Kairos about support setups, matching listings, or how to prepare accessible resumes.
            </p>
          </div>
          <ChatbotPanel
            initialMessage={state.prefilledChatQuery}
            highContrast={state.highContrast}
            stateMode={state.sandboxState === "chat_active" ? "normal" : state.sandboxState.split("_")[1] as any}
            onReadAloud={handleReadAloud}
            autoStartVoice={state.autoStartVoice}
            onVoiceTriggered={() => dispatch({ type: "SET_AUTO_START_VOICE", payload: false })}
          />
        </div>
      )}

      {state.activeTab === "add" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight">AI Job Scraper & Classifier</h2>
            <p className={`text-xs font-semibold mt-1 ${state.highContrast ? "text-yellow-400" : "text-slate-500"}`}>
              Simulate scraping a description from the web and classifying its disability suitability.
            </p>
          </div>
          <JobScraper
            onJobAdded={(newJob) => {
              dispatch({ type: "ADD_JOB", payload: newJob });
              speakAnnouncement(`Job parsed and classified under ${newJob.categories.join(", ")} suitability.`);
            }}
            highContrast={state.highContrast}
          />
        </div>
      )}

      {state.activeTab === "profile" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight">Your Accessible Career Profile</h2>
            <p className={`text-xs font-semibold mt-1 ${state.highContrast ? "text-yellow-400" : "text-slate-500"}`}>
              Customize your credentials to activate proactive AI match scoring and matching skill highlights.
            </p>
          </div>
          <UserProfilePanel
            highContrast={state.highContrast}
            onProfileUpdated={fetchData}
            jobs={state.jobs}
          />
        </div>
      )}

      {state.activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight">System Settings & Controls</h2>
            <p className={`text-xs font-semibold mt-1 ${state.highContrast ? "text-yellow-400" : "text-slate-500"}`}>
              Configure the auto-apply crawler, evaluate matching algorithms to retrain models, or adjust visual properties.
            </p>
          </div>
          <SettingsPanel
            highContrast={state.highContrast}
            onContrastToggle={() => dispatch({ type: "SET_HIGH_CONTRAST", payload: !state.highContrast })}
            textScale={state.textScale}
            onTextScaleChange={(s) => dispatch({ type: "SET_TEXT_SCALE", payload: s })}
            screenReaderHelp={state.screenReaderHelp}
            onScreenReaderToggle={() => dispatch({ type: "SET_SCREEN_READER_HELP", payload: !state.screenReaderHelp })}
            darkMode={state.darkMode}
            onDarkModeToggle={() => dispatch({ type: "SET_DARK_MODE", payload: !state.darkMode })}
          />
        </div>
      )}
    </>
  );
}
