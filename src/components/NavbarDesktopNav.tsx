import React from "react";
import { Briefcase, FileText, Bot, PlusCircle, Settings, User, Home, Bookmark } from "lucide-react";

export function NavbarDesktopNav({ activeTab, setActiveTab, highContrast }: any) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      <button
        type="button"
        onClick={() => setActiveTab("home")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "home"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("jobs")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "jobs"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Briefcase className="w-4 h-4" />
        <span>Find Jobs</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("saved")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "saved"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Bookmark className="w-4 h-4" />
        <span>Saved Jobs</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("applied")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "applied"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Applications & Follow-Up</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("chat")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "chat"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Bot className="w-4 h-4" />
        <span>Kairos Assistant</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("add")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "add"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <PlusCircle className="w-4 h-4" />
        <span>AI Job Classifier</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("profile")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "profile"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <User className="w-4 h-4" />
        <span>User Profile</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("settings")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          activeTab === "settings"
            ? highContrast
              ? "bg-yellow-400 text-black border border-yellow-400"
              : "bg-lilac-50 text-lilac-700 font-bold"
            : highContrast
            ? "text-yellow-400 hover:bg-zinc-950"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
    </nav>
  );
}
