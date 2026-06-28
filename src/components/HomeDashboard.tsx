import React from "react";
import { Job, Application } from "../types";
import { AlertTriangle, RefreshCw, UserCheck } from "lucide-react";
import { DashboardWelcomeBanner, DashboardMetrics, DashboardJobsPreview, DashboardSetupProfile } from "./DashboardWidgets";

interface HomeDashboardProps {
  jobs: Job[];
  applications: Application[];
  highContrast: boolean;
  stateMode?: "normal" | "loading" | "empty" | "error";
  onTabChange?: (tab: any) => void;
  onResetAll?: () => void;
}

export default function HomeDashboard({
  jobs,
  applications,
  highContrast,
  stateMode = "normal",
  onTabChange,
  onResetAll,
}: HomeDashboardProps) {

  if (stateMode === "loading") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className={`h-24 rounded-2xl ${highContrast ? "bg-zinc-900 border border-yellow-400" : "bg-slate-200"} w-full`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`h-20 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
          <div className={`h-20 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
          <div className={`h-20 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 h-64 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
          <div className={`h-64 rounded-xl ${highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
        </div>
      </div>
    );
  }

  if (stateMode === "error") {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-red-50/50 border-red-200 text-red-800"
      }`}>
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h3 className="font-extrabold text-lg">Kairos Recommendation Feed Error</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          An error occurred while communicating with the active database server. Security tokens or recommendation feeds could not be dynamically parsed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              highContrast ? "bg-yellow-400 text-black" : "bg-lilac-600 text-white hover:bg-lilac-700"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  if (stateMode === "empty" || jobs.length === 0) {
    return (
      <div className={`p-10 text-center rounded-2xl border ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <UserCheck className="w-14 h-14 mx-auto text-slate-400 mb-4" />
        <h3 className="font-extrabold text-xl">Welcome to Your New Inclusive Workspace</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
          It looks like your career profile hasn't been configured or jobs haven't finished indexing. Complete your accommodation requirements to unlock hyper-personalized matches.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {onTabChange && (
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className={`px-4 py-2 text-xs font-bold rounded-lg ${
                highContrast ? "bg-yellow-400 text-black" : "bg-lilac-600 text-white hover:bg-lilac-700"
              }`}
            >
              Configure Accommodations Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  const matchingJobs = [...jobs]
    .filter(j => j.isActive && (j.compatibilityScore || 0) >= 65)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <DashboardWelcomeBanner highContrast={highContrast} />
      <DashboardMetrics highContrast={highContrast} matchingJobs={matchingJobs} applications={applications} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardJobsPreview highContrast={highContrast} matchingJobs={matchingJobs} onTabChange={onTabChange} />
        <DashboardSetupProfile highContrast={highContrast} onTabChange={onTabChange} />
      </div>
    </div>
  );
}
