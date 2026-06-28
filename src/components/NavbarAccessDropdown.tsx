import React from "react";
import { Settings, Volume2 } from "lucide-react";

export function NavbarAccessDropdown({ 
  highContrast, 
  darkMode, 
  textScale, 
  setTextScale, 
  onDarkModeToggle, 
  setHighContrast, 
  screenReaderHelp, 
  setScreenReaderHelp, 
  speechVolume, 
  setSpeechVolume, 
  zoomFactor, 
  setZoomFactor 
}: any) {
  return (
    <div
      className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl p-5 border z-50 transition-colors duration-300 ${
        highContrast 
          ? "bg-lilac-950 border-yellow-400 text-yellow-400" 
          : darkMode 
          ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]" 
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      <div className="mb-4">
        <h3 className="font-bold text-sm tracking-wide uppercase mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Accessibility Adjustments</span>
        </h3>
        <div className={`h-px mb-4 ${highContrast ? "bg-yellow-400" : darkMode ? "bg-zinc-800" : "bg-slate-200"}`}></div>
      </div>

      <fieldset className="mb-4">
        <legend className="block text-xs font-bold uppercase mb-2">Text Zoom</legend>
        <div className="grid grid-cols-3 gap-1">
          {(["normal", "large", "xlarge"] as const).map((scale) => (
            <button
              type="button"
              key={scale}
              onClick={() => setTextScale(scale)}
              className={`py-1.5 text-xs font-bold rounded border capitalize ${
                textScale === scale
                  ? highContrast
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-lilac-600 text-white border-lilac-600"
                  : highContrast
                  ? "border-yellow-400 hover:bg-zinc-900"
                  : darkMode
                  ? "border-zinc-800 hover:bg-zinc-900 text-[#FAF8F5]"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {scale === "normal" ? "100%" : scale === "large" ? "120%" : "140%"}
            </button>
          ))}
        </div>
      </fieldset>

      {!highContrast && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold uppercase">Dark Mode</span>
            <span className="text-[10px] text-slate-500 block">Low-sensory dark canvas</span>
          </div>
          <button
            type="button"
            onClick={onDarkModeToggle}
            className={`px-3 py-1 rounded font-bold text-xs border ${
              darkMode
                ? "bg-lilac-600 text-white border-lilac-600"
                : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
            }`}
          >
            {darkMode ? "On" : "Off"}
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="block text-xs font-bold uppercase">Contrast Mode</span>
          <span className="text-[10px] text-slate-500 block">Yellow-on-black layout</span>
        </div>
        <button
          type="button"
          onClick={() => setHighContrast(!highContrast)}
          className={`px-3 py-1 rounded font-bold text-xs border ${
            highContrast
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
          }`}
        >
          {highContrast ? "On" : "Off"}
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="block text-xs font-bold uppercase">Screen-Reader Audio Guide</span>
          <span className="text-[10px] text-slate-500 block">Spoken assistive announcements</span>
        </div>
        <button
          type="button"
          onClick={() => setScreenReaderHelp(!screenReaderHelp)}
          className={`px-3 py-1 rounded font-bold text-xs border ${
            screenReaderHelp
              ? highContrast
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-lilac-600 text-white border-lilac-600"
              : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
          }`}
        >
          {screenReaderHelp ? "On" : "Off"}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="speech-volume-slider" className="block text-xs font-bold uppercase">TTS Speech Volume</label>
          <span className="text-xs font-bold">{Math.round(speechVolume * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className={`w-4 h-4 shrink-0 ${highContrast ? "text-yellow-400" : "text-slate-400"}`} />
          <input
            id="speech-volume-slider"
            type="range"
            aria-label="Speech volume"
            min="0"
            max="1"
            step="0.05"
            value={speechVolume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSpeechVolume(val);
              localStorage.setItem("speech_volume:v1", val.toString());
            }}
            className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lilac-600 dark:accent-yellow-400"
          />
        </div>
      </div>

      <div className="mb-1">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="zoom-factor-slider" className="block text-xs font-bold uppercase">Interface Zoom</label>
          <span className="text-xs font-bold">{zoomFactor}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400">40%</span>
          <input
            id="zoom-factor-slider"
            type="range"
            aria-label="Interface zoom"
            min="40"
            max="150"
            step="5"
            value={zoomFactor}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setZoomFactor(val);
              localStorage.setItem("zoom_factor:v1", val.toString());
            }}
            className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lilac-600 dark:accent-yellow-400"
          />
          <span className="text-[9px] font-bold text-slate-400">150%</span>
        </div>
      </div>
    </div>
  );
}
