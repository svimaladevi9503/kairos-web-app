import React from "react";
import { Briefcase, FileText, Bot, PlusCircle, Settings, User, Home, Bookmark } from "lucide-react";

export function NavbarMobileNav({ activeTab, setActiveTab }: any) {
  return (
    <div className="md:hidden flex border-t border-slate-100 justify-around py-2">
      <button type="button" onClick={() => setActiveTab("home")} className={`flex flex-col items-center text-xs ${activeTab === "home" ? "text-lilac-600" : "text-slate-500"}`}>
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      <button type="button" onClick={() => setActiveTab("jobs")} className={`flex flex-col items-center text-xs ${activeTab === "jobs" ? "text-lilac-600" : "text-slate-500"}`}>
        <Briefcase className="w-4 h-4" />
        <span>Jobs</span>
      </button>
      <button type="button" onClick={() => setActiveTab("saved")} className={`flex flex-col items-center text-xs ${activeTab === "saved" ? "text-lilac-600" : "text-slate-500"}`}>
        <Bookmark className="w-4 h-4" />
        <span>Saved</span>
      </button>
      <button type="button" onClick={() => setActiveTab("applied")} className={`flex flex-col items-center text-xs ${activeTab === "applied" ? "text-lilac-600" : "text-slate-500"}`}>
        <FileText className="w-4 h-4" />
        <span>Applied</span>
      </button>
      <button type="button" onClick={() => setActiveTab("chat")} className={`flex flex-col items-center text-xs ${activeTab === "chat" ? "text-lilac-600" : "text-slate-500"}`}>
        <Bot className="w-4 h-4" />
        <span>Chat</span>
      </button>
      <button type="button" onClick={() => setActiveTab("add")} className={`flex flex-col items-center text-xs ${activeTab === "add" ? "text-lilac-600" : "text-slate-500"}`}>
        <PlusCircle className="w-4 h-4" />
        <span>Classify</span>
      </button>
      <button type="button" onClick={() => setActiveTab("profile")} className={`flex flex-col items-center text-xs ${activeTab === "profile" ? "text-lilac-600" : "text-slate-500"}`}>
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>
      <button type="button" onClick={() => setActiveTab("settings")} className={`flex flex-col items-center text-xs ${activeTab === "settings" ? "text-lilac-600" : "text-slate-500"}`}>
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
    </div>
  );
}
