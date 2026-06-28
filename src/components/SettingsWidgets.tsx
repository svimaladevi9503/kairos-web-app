import React from "react";
import { Sliders, Database, Accessibility, Sparkles, ToggleRight, ToggleLeft, Play, CheckCircle2 } from "lucide-react";
import FeedbackRetrainingPanel from "./FeedbackRetrainingPanel";

export function SettingsTabs({ state, dispatch, highContrast, darkMode }: any) {
  return (
    <div className="lg:col-span-3 space-y-2">
      <button
        type="button"
        onClick={() => dispatch({ type: "SET_TAB", payload: "auto_apply" })}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
          state.activeSubTab === "auto_apply"
            ? highContrast
              ? "bg-yellow-400 text-black font-extrabold border border-yellow-400"
              : "bg-lilac-600 text-white shadow-sm"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-950 border border-yellow-400/40"
            : darkMode
            ? "text-zinc-300 hover:bg-[#292532] border border-transparent"
            : "text-slate-600 hover:bg-slate-50 border border-transparent"
        }`}
      >
        <Sliders className="w-4 h-4" />
        <span>Auto-Apply Engine</span>
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: "SET_TAB", payload: "retrain" })}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
          state.activeSubTab === "retrain"
            ? highContrast
              ? "bg-yellow-400 text-black font-extrabold border border-yellow-400"
              : "bg-lilac-600 text-white shadow-sm"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-950 border border-yellow-400/40"
            : darkMode
            ? "text-zinc-300 hover:bg-[#292532] border border-transparent"
            : "text-slate-600 hover:bg-slate-50 border border-transparent"
        }`}
      >
        <Database className="w-4 h-4" />
        <span>AI Model Retraining</span>
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: "SET_TAB", payload: "access" })}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
          state.activeSubTab === "access"
            ? highContrast
              ? "bg-yellow-400 text-black font-extrabold border border-yellow-400"
              : "bg-lilac-600 text-white shadow-sm"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-950 border border-yellow-400/40"
            : darkMode
            ? "text-zinc-300 hover:bg-[#292532] border border-transparent"
            : "text-slate-600 hover:bg-slate-50 border border-transparent"
        }`}
      >
        <Accessibility className="w-4 h-4" />
        <span>System Accessibility</span>
      </button>
    </div>
  );
}

export function SettingsAutoApply({
  state,
  dispatch,
  highContrast,
  darkMode,
  handleToggleAutoApply,
  startAutoApplyScan
}: any) {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 transition-all duration-300 ${
      highContrast 
        ? "bg-lilac-950 border-yellow-400 text-yellow-400" 
        : darkMode
        ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]"
        : "bg-white border-slate-100 shadow-sm"
    }`}>
      <div className={`flex items-center gap-2 border-b pb-4 ${
        highContrast ? "border-yellow-400/30" : darkMode ? "border-zinc-800" : "border-slate-50"
      }`}>
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-yellow-400 animate-pulse" />
        <div>
          <h3 className="font-extrabold text-lg animate-fadeIn">Intelligent AI Auto-Apply Engine</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automate inclusive applications to highly compatible vacancies.</p>
        </div>
      </div>

      <div className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
        highContrast 
          ? "bg-zinc-950 border-yellow-400/50 text-yellow-400" 
          : darkMode
          ? "bg-[#292532] border-zinc-800"
          : "bg-slate-50/50 border-slate-200"
      }`}>
        <div className="space-y-1 max-w-md text-left">
          <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Engine Activation Status</span>
          <span className="block text-sm font-extrabold">Enable Real-Time Application Submission</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            When active, our background crawler dynamically applies to new scraped positions that match your specific accessibility score.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleAutoApply}
          className="outline-none"
          aria-label={state.autoApplyEnabled ? "Disable Auto-Apply Engine" : "Enable Auto-Apply Engine"}
        >
          {state.autoApplyEnabled ? (
            <ToggleRight className={`w-12 h-12 ${highContrast ? "text-yellow-400" : "text-lilac-600"}`} />
          ) : (
            <ToggleLeft className="w-12 h-12 text-slate-300 dark:text-zinc-600" />
          )}
        </button>
      </div>

      <div className="space-y-3 text-left">
        <div className="flex justify-between items-center">
          <label htmlFor="threshold-slider" className="text-xs font-extrabold block">Disability Score Threshold</label>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
            highContrast ? "bg-yellow-400 text-black font-extrabold" : "bg-lilac-100 text-lilac-700 dark:bg-zinc-800 dark:text-zinc-200"
          }`}>
            {state.threshold}% or higher
          </span>
        </div>
        <input
          id="threshold-slider"
          type="range"
          min="50"
          max="95"
          step="5"
          value={state.threshold}
          onChange={(e) => dispatch({ type: "SET_THRESHOLD", payload: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lilac-600 dark:accent-yellow-400"
        />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          We compute compatibility dynamically by feeding your accessibility accommodations, work credentials, and profile skills into Gemini along with the scraped job requirements.
        </p>
      </div>

      <div className={`pt-4 border-t ${
        highContrast ? "border-yellow-400/20" : darkMode ? "border-zinc-800" : "border-slate-50"
      }`}>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-extrabold block">Simulate Background Robot Scan</span>
            <span className="text-[10px] text-slate-400 block">Test the matchmaking and auto-apply webhook logic instantly.</span>
          </div>
          <button
            type="button"
            onClick={startAutoApplyScan}
            disabled={state.isScanning || !state.autoApplyEnabled}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
              !state.autoApplyEnabled
                ? "bg-slate-100 text-slate-400 dark:bg-zinc-800/50 dark:text-zinc-600 cursor-not-allowed"
                : highContrast
                ? "bg-yellow-400 text-black hover:bg-zinc-950 hover:text-yellow-400 border border-yellow-400"
                : "bg-lilac-600 text-white hover:bg-lilac-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 animate-pulse" />
            <span>{state.isScanning ? "Scanning..." : "Simulate Live Auto-Apply Scan"}</span>
          </button>
        </div>

        {state.scanLogs.length > 0 && (
          <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 max-h-60 overflow-y-auto text-left ${
            highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-300" : "bg-lilac-950 text-emerald-400 border-zinc-800"
          }`}>
            {state.scanLogs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {state.autoAppliedCount > 0 && !state.isScanning && (
          <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 text-left ${
            highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-yellow-400 shrink-0" />
            <div>
              <span className="block text-xs font-extrabold text-slate-900 dark:text-emerald-950">Submission Webhook Success!</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Successfully dispatched simulated packets to FigmaCraft and Nova Stream. They have been added to your Applied Applications tracker board.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsRetrain({ highContrast, darkMode }: any) {
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        highContrast 
          ? "bg-lilac-950 border-yellow-400 text-yellow-400" 
          : darkMode
          ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]"
          : "bg-white border-slate-100 shadow-sm"
      }`}>
        <h3 className="font-extrabold text-lg mb-1">Kairos Fine-Tuning Retrain Hub</h3>
        <p className="text-xs text-slate-500 mb-6">Rate and evaluate live matches to retrain our inclusive scoring weights.</p>
        
        <FeedbackRetrainingPanel highContrast={highContrast} />
      </div>
    </div>
  );
}

export function SettingsAccess({
  highContrast,
  darkMode,
  textScale,
  onTextScaleChange,
  screenReaderHelp,
  onScreenReaderToggle,
  onContrastToggle,
  onDarkModeToggle
}: any) {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 text-left transition-all duration-300 ${
      highContrast 
        ? "bg-lilac-950 border-yellow-400 text-yellow-400" 
        : darkMode
        ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]"
        : "bg-white border-slate-100 shadow-sm"
    }`}>
      <div className={`flex items-center gap-2 border-b pb-4 ${
        highContrast ? "border-yellow-400/20" : darkMode ? "border-zinc-800" : "border-slate-50"
      }`}>
        <Accessibility className="w-5 h-5 text-indigo-600 dark:text-yellow-400" />
        <div>
          <h3 className="font-extrabold text-lg">System Accessibility Settings</h3>
          <p className="text-xs text-slate-500 mt-0.5">Customize display properties to meet your sensory needs.</p>
        </div>
      </div>

      {!highContrast && (
        <div className={`flex justify-between items-center py-2 border-b ${
          highContrast ? "border-yellow-400/10" : darkMode ? "border-zinc-800" : "border-slate-50"
        }`}>
          <div>
            <span className="text-xs font-extrabold block">Dark Mode Theme</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Applies a low-light dark violet background to soothe optical strains.</span>
          </div>
          <button
            type="button"
            onClick={onDarkModeToggle}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              darkMode 
                ? "bg-lilac-600 text-white font-extrabold border-lilac-600" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            {darkMode ? "Disable" : "Enable"}
          </button>
        </div>
      )}

      <div className={`flex justify-between items-center py-2 border-b ${
        highContrast ? "border-yellow-400/10" : darkMode ? "border-zinc-800" : "border-slate-50"
      }`}>
        <div>
          <span className="text-xs font-extrabold block">High Contrast Mode</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Sets high-contrast dark visual tones and absolute yellow accessibility borders.</span>
        </div>
        <button
          type="button"
          onClick={onContrastToggle}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            highContrast 
              ? "bg-yellow-400 text-black font-extrabold border-yellow-400" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          {highContrast ? "Disable" : "Enable"}
        </button>
      </div>

      <div className={`flex justify-between items-center py-2 border-b ${
        highContrast ? "border-yellow-400/10" : darkMode ? "border-zinc-800" : "border-slate-50"
      }`}>
        <div>
          <span className="text-xs font-extrabold block">Screen-Reader Audio Guide</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Read visual sections out loud using speech synthesizers upon tab transition.</span>
        </div>
        <button
          type="button"
          onClick={onScreenReaderToggle}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            screenReaderHelp 
              ? "bg-lilac-600 text-white font-extrabold border-lilac-600" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          {screenReaderHelp ? "Disable" : "Enable"}
        </button>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold block">Interface Zoom Factor</span>
        <div className="flex flex-wrap items-center gap-2">
          {([
            { value: "normal", label: "Default (100%)" },
            { value: "large", label: "Large (110%)" },
            { value: "xlarge", label: "Extra Large (125%)" }
          ] as const).map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => onTextScaleChange(item.value)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                textScale === item.value
                  ? highContrast
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-lilac-600 text-white border-lilac-600"
                  : highContrast
                  ? "border-yellow-400 text-yellow-400"
                  : darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
