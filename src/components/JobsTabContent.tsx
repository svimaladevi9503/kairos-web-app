import React from "react";
import { Briefcase, Info, Search, X } from "lucide-react";
import SidebarFilters from "./SidebarFilters";
import JobCard from "./JobCard";

export function JobsTabContent({
  state,
  dispatch,
  filteredJobs,
  handleApplyJob,
  handleReadAloud,
  speakAnnouncement,
  fetchData
}: any) {
  if (state.sandboxState === "jobs_loading") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-6 h-6 text-lilac-600 dark:text-yellow-400" />
          <h2 className="font-extrabold text-2xl tracking-tight">Scanning listings...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`h-40 rounded-xl ${state.highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
          <div className={`h-40 col-span-3 rounded-xl ${state.highContrast ? "bg-zinc-900" : "bg-slate-200"}`}></div>
        </div>
      </div>
    );
  }

  if (state.sandboxState === "jobs_error") {
    return (
      <div className={`p-8 text-center rounded-2xl border ${
        state.highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-red-50/50 border-red-200 text-red-800"
      }`}>
        <Info className="w-12 h-12 mx-auto text-red-500 mb-4 animate-pulse" />
        <h3 className="font-extrabold text-lg">Search Error (Connectivity drops)</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          An error occurred while scanning job vacancies index.
        </p>
        <button type="button" onClick={fetchData} className={`mt-4 px-4 py-2 text-xs font-bold rounded-lg ${
          state.highContrast ? "bg-yellow-400 text-black" : "bg-lilac-600 text-white hover:bg-lilac-700"
        }`}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <SidebarFilters
        selectedCategory={state.selectedCategory}
        setSelectedCategory={(c) => dispatch({ type: "SET_CATEGORY", payload: c })}
        searchQuery={state.searchQuery}
        setSearchQuery={(q) => dispatch({ type: "SET_SEARCH_QUERY", payload: q })}
        selectedAccommodations={state.selectedAccommodations}
        toggleAccommodation={(a) => dispatch({ type: "TOGGLE_ACCOMMODATION", payload: a })}
        highContrast={state.highContrast}
        clearFilters={() => {
          dispatch({ type: "CLEAR_FILTERS" });
          speakAnnouncement("Search filters cleared.");
        }}
      />

      <div className="flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-lilac-600 dark:text-yellow-400" />
              <span>Recommended Positions</span>
            </h2>
            <p className={`text-xs font-semibold ${state.highContrast ? "text-yellow-400" : "text-slate-500"}`}>
              Displaying {state.sandboxState === "jobs_empty" ? 0 : filteredJobs.length} accommodation-aware opportunities
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-3 transition-colors duration-300 ${
          state.highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-lilac-800 shadow-sm animate-in fade-in duration-300"
        }`}>
          <div className="relative w-full">
            <label htmlFor="searchQueryInput" className="sr-only">Search roles, companies, locations, or specific accommodations...</label>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${state.highContrast ? "text-yellow-400" : "text-slate-400"}`} />
            <input
              id="searchQueryInput"
              type="text"
              placeholder="Search roles, companies, locations, or specific accommodations..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
              className={`w-full pl-9 pr-9 py-2 text-sm font-medium rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                state.highContrast
                  ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400 placeholder-yellow-400/50"
                  : "bg-slate-50 dark:bg-lilac-900 border-slate-200 dark:border-lilac-800 focus:ring-lilac-500 text-slate-800 dark:text-zinc-100"
              }`}
            />
            {state.searchQuery && (
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
                  handleReadAloud("Search query cleared.");
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 ${
                  state.highContrast ? "text-yellow-400" : "text-slate-400"
                }`}
                title="Clear Search"
                aria-label="Clear Search Input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className={`h-px ${state.highContrast ? "bg-yellow-400" : "bg-slate-200"}`}></div>

        {state.sandboxState === "jobs_empty" || filteredJobs.length === 0 ? (
          <div className={`p-12 text-center border-2 border-dashed rounded-xl ${state.highContrast ? "border-yellow-400 bg-lilac-950" : "border-slate-200 bg-white dark:bg-lilac-950"}`}>
            <Info className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <span className="block font-bold text-sm">No results found for your search query</span>
            <span className="block text-xs text-slate-400 mt-1">Try resetting search parameters or selecting general visual category.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job: any) => {
              const isApplied = state.applications.some((app: any) => app.jobId === job.id);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  applied={isApplied}
                  onApply={handleApplyJob}
                  onAskAI={(title: string, company: string) => dispatch({ type: "SET_PREFILLED_CHAT", payload: `Tell me more about the specific accommodations available for the ${title} position at ${company}.` })}
                  highContrast={state.highContrast}
                  onReadAloud={handleReadAloud}
                  isSaved={state.savedJobIds.includes(job.id)}
                  onToggleSave={(id: string) => {
                    dispatch({ type: "TOGGLE_SAVE_JOB", payload: id });
                    handleReadAloud(state.savedJobIds.includes(id) ? "Job removed from saved list." : "Job saved successfully.");
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
