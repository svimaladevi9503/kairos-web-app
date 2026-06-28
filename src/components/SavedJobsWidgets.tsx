import React from "react";
import { Bookmark, Info, ArrowLeft, Search, X } from "lucide-react";
import JobCard from "./JobCard";
import { Job } from "../types";

export function SavedJobsHeader({ savedJobsCount, highContrast, onBackToJobs }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-lilac-600 dark:text-yellow-400 fill-current" />
          <span>Saved Job Positions</span>
        </h2>
        <p className={`text-xs font-semibold mt-1 ${highContrast ? "text-yellow-400" : "text-slate-500"}`}>
          Manage your bookmarked opportunities ({savedJobsCount} positions saved)
        </p>
      </div>

      {onBackToJobs && (
        <button
          type="button"
          onClick={onBackToJobs}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
            highContrast
              ? "bg-yellow-400 text-black hover:bg-lilac-900 hover:text-yellow-400 border border-yellow-400"
              : "bg-lilac-600 text-white hover:bg-lilac-700"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Jobs</span>
        </button>
      )}
    </div>
  );
}

export function SavedJobsSearch({ localSearch, setLocalSearch, highContrast, hasJobs }: any) {
  if (!hasJobs) return null;
  
  return (
    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-3 transition-colors duration-300 ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm"
    }`}>
      <div className="relative w-full">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${highContrast ? "text-yellow-400" : "text-slate-400"}`} />
        <input
          type="text"
          aria-label="Search through saved jobs"
          placeholder="Search through saved jobs..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all ${
            highContrast
              ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400 placeholder-yellow-400/50"
              : "bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus:ring-lilac-500 text-slate-800 dark:text-zinc-100"
          }`}
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => setLocalSearch("")}
            aria-label="Clear local search"
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 ${
              highContrast ? "text-yellow-400" : "text-slate-400"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SavedJobsEmptyState({ isNoJobs, isNoSearchResults, localSearch, highContrast, onBackToJobs }: any) {
  if (isNoJobs) {
    return (
      <div className={`p-12 text-center border-2 border-dashed rounded-xl ${
        highContrast ? "border-yellow-400 bg-lilac-950 text-yellow-400" : "border-slate-200 bg-white dark:bg-lilac-900 dark:border-zinc-800"
      }`}>
        <Bookmark className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-4" />
        <h3 className="font-extrabold text-lg">No saved jobs yet</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
          Browse through our recommended positions list and click the bookmark button on any vacancy card to save it here for offline reference.
        </p>
        {onBackToJobs && (
          <button
            type="button"
            onClick={onBackToJobs}
            className={`mt-4 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              highContrast ? "bg-yellow-400 text-black font-extrabold" : "bg-lilac-600 hover:bg-lilac-700 text-white"
            }`}
          >
            Browse Careers
          </button>
        )}
      </div>
    );
  }

  if (isNoSearchResults) {
    return (
      <div className={`p-12 text-center border-2 border-dashed rounded-xl ${
        highContrast ? "border-yellow-400 bg-lilac-950 text-yellow-400" : "border-slate-200 bg-white dark:bg-lilac-900 dark:border-zinc-800"
      }`}>
        <Info className="w-8 h-8 mx-auto text-slate-400 mb-3" />
        <span className="block font-bold text-sm">No saved jobs match "{localSearch}"</span>
        <span className="block text-xs text-slate-400 mt-1">Try resetting or editing your query keywords.</span>
      </div>
    );
  }

  return null;
}

export function SavedJobsList({
  filteredSavedJobs,
  applications,
  onApply,
  onAskAI,
  highContrast,
  onReadAloud,
  onToggleSave
}: any) {
  return (
    <div className="space-y-6">
      {filteredSavedJobs.map((job: Job) => {
        const isApplied = applications.some((app: any) => app.jobId === job.id);
        return (
          <JobCard
            key={job.id}
            job={job}
            applied={isApplied}
            onApply={onApply}
            onAskAI={onAskAI}
            highContrast={highContrast}
            onReadAloud={onReadAloud}
            isSaved={true}
            onToggleSave={onToggleSave}
          />
        );
      })}
    </div>
  );
}
