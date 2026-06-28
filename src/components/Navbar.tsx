import { useState } from "react";
import { Search, Menu, LogOut, FileText, CheckCircle2, Eye, X } from "lucide-react";
import KairosLogo from "./KairosLogo";
import { NavbarDesktopNav } from "./NavbarDesktopNav";
import { NavbarAccessDropdown } from "./NavbarAccessDropdown";
import { NavbarMobileNav } from "./NavbarMobileNav";

interface NavbarProps {
  activeTab: "home" | "jobs" | "applied" | "chat" | "add" | "profile" | "settings" | "saved";
  setActiveTab: (tab: "home" | "jobs" | "applied" | "chat" | "add" | "profile" | "settings" | "saved") => void;
  textScale: "normal" | "large" | "xlarge";
  setTextScale: (scale: "normal" | "large" | "xlarge") => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  screenReaderHelp: boolean;
  setScreenReaderHelp: (val: boolean) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onDarkModeToggle: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  speechVolume: number;
  setSpeechVolume: (val: number) => void;
  zoomFactor: number;
  setZoomFactor: (val: number) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  textScale,
  setTextScale,
  highContrast,
  setHighContrast,
  screenReaderHelp,
  setScreenReaderHelp,
  onLogout,
  darkMode,
  setDarkMode,
  onDarkModeToggle,
  searchQuery,
  setSearchQuery,
  speechVolume,
  setSpeechVolume,
  zoomFactor,
  setZoomFactor,
}: NavbarProps) {
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);

  return (
    <header className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
      highContrast 
        ? "bg-lilac-950 border-yellow-400 text-yellow-400" 
        : darkMode 
        ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]" 
        : "bg-[#FAF8F5] border-slate-200/60 text-[#2E2E2E]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <KairosLogo size="sm" highContrast={highContrast} themeMode={darkMode ? "dark" : "light"} />
          
          <div className="hidden lg:flex items-center relative w-64">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${highContrast ? "text-yellow-400" : "text-slate-400"}`} />
            <input
              type="text"
              aria-label="Universal search"
              placeholder="Universal search across jobs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "jobs") {
                  setActiveTab("jobs");
                }
              }}
              className={`w-full pl-8 pr-8 py-1.5 text-xs font-semibold rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                highContrast
                  ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400 placeholder-yellow-400/50"
                  : "bg-white border-slate-200 focus:ring-lilac-500 text-slate-800 placeholder:text-slate-400"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${highContrast ? "text-yellow-400" : "text-slate-400 hover:text-slate-600"}`}
                title="Clear Universal Search"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <NavbarDesktopNav activeTab={activeTab} setActiveTab={setActiveTab} highContrast={highContrast} />

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccessDropdown(!showAccessDropdown)}
              className={`p-2 rounded-full border transition-all flex items-center gap-1 text-sm font-bold ${
                highContrast
                  ? "border-yellow-400 hover:bg-zinc-900 text-yellow-400"
                  : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              aria-label="Toggle Accessibility Menu"
              aria-expanded={showAccessDropdown}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">Accessibility Panel</span>
            </button>

            {showAccessDropdown && (
              <NavbarAccessDropdown
                highContrast={highContrast}
                darkMode={darkMode}
                textScale={textScale}
                setTextScale={setTextScale}
                onDarkModeToggle={onDarkModeToggle}
                setHighContrast={setHighContrast}
                screenReaderHelp={screenReaderHelp}
                setScreenReaderHelp={setScreenReaderHelp}
                speechVolume={speechVolume}
                setSpeechVolume={setSpeechVolume}
                zoomFactor={zoomFactor}
                setZoomFactor={setZoomFactor}
              />
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className={`hidden md:inline-block px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              highContrast
                ? "border border-yellow-400 text-yellow-400 hover:bg-zinc-950"
                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50"
            }`}
          >
            Sign Out
          </button>

          <div className={`w-9 h-9 rounded-full overflow-hidden border-2 ${highContrast ? "border-yellow-400" : "border-slate-200"}`}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN80xeLyAKoXLk9NveD-UbIX5KM1i_HCuYRyQx4s-f8hIUu8iBTdpdze-uPLEtWpY_gCAYsLRJl_9Qs50uFcXqWlcbjiigwnw4n4oaoyNZvR5x-oDqzjdPztjWoP1IF9rCX6ZKbTIaRj4BkKdwttJPK0ogzjFkoXafHZnU7v70hk6m_LCcSHIBeq9Dl1Uz-By7BYLyzxnPlwXiY0g7LFboyzPjjsNqHxCDcl2hB72q-jkeGz0opoOlCWsTx-boK4ocw85UV_OWSQsd"
              alt="User profile avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <NavbarMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </header>
  );
}
