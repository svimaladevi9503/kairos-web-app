import React from "react";
import { Job, Application } from "../types";
import { Sparkles, CheckCircle2, FileText, Star, Briefcase, ArrowRight, UserCheck } from "lucide-react";

export function DashboardWelcomeBanner({ highContrast }: { highContrast: boolean }) {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-gradient-to-r from-lilac-900 via-lilac-950 to-lilac-900 text-white shadow-xl"
    }`}>
      <div className="relative z-10 max-w-xl">
        <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-widest font-bold uppercase px-2.5 py-1 rounded-full mb-3 ${
          highContrast ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400" : "bg-lilac-500/20 text-lilac-300"
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Disability Suitability Engaged</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome Back, Alex Johnson!
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Your screen reader support and high contrast layout guidelines are automatically active. 3 highly compatible job vacancies matches were discovered during your offline period.
        </p>
      </div>
      
      <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient opacity-20 pointer-events-none"></div>
    </div>
  );
}

export function DashboardMetrics({ highContrast, matchingJobs, applications }: { highContrast: boolean, matchingJobs: Job[], applications: Application[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm"
      }`}>
        <div>
          <span className={`text-xs font-bold block uppercase ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>Perfect AI Matches</span>
          <span className="text-2xl font-black mt-1 block">{matchingJobs.length} Positions</span>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm"
      }`}>
        <div>
          <span className={`text-xs font-bold block uppercase ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>Outreach Pipelines</span>
          <span className="text-2xl font-black mt-1 block">{applications.length} Tracked</span>
        </div>
        <div className="p-3 bg-lilac-50 dark:bg-lilac-950/20 rounded-xl text-lilac-600 dark:text-lilac-400">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm"
      }`}>
        <div>
          <span className={`text-xs font-bold block uppercase ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>Profile Strength</span>
          <span className="text-2xl font-black mt-1 block">94% Compliant</span>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-500">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
        </div>
      </div>
    </div>
  );
}

export function DashboardJobsPreview({ highContrast, matchingJobs, onTabChange }: { highContrast: boolean, matchingJobs: Job[], onTabChange?: (tab: any) => void }) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-lilac-600 dark:text-lilac-400" />
          <span>Recommended Jobs Preview</span>
        </h3>
        {onTabChange && (
          <button
            type="button"
            onClick={() => onTabChange("jobs")}
            className="text-xs font-bold text-lilac-600 dark:text-lilac-400 flex items-center gap-1 hover:underline"
          >
            <span>Browse all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {matchingJobs.map((job) => (
          <div
            key={job.id}
            className={`p-4 rounded-xl border flex items-start justify-between transition-colors duration-300 ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm hover:border-slate-200"
            }`}
          >
            <div className="text-left">
              <h4 className="font-extrabold text-sm">{job.title}</h4>
              <span className={`block text-xs mt-0.5 ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>{job.company} • {job.location}</span>
              <div className="mt-2 flex flex-wrap gap-1">
                {job.categories.map((cat) => (
                  <span key={cat} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    highContrast ? "bg-lilac-900 border border-yellow-400 text-yellow-400" : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                  }`}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">{job.compatibilityScore}% Match</span>
              {onTabChange && (
                <button
                  type="button"
                  onClick={() => onTabChange("jobs")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-2 block transition-all ${
                    highContrast 
                      ? "border-yellow-400 text-yellow-400" 
                      : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-200"
                  }`}
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSetupProfile({ highContrast, onTabChange }: { highContrast: boolean, onTabChange?: (tab: any) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-lilac-600 dark:text-lilac-400" />
        <span>Your Setup Profile</span>
      </h3>

      <div className={`p-5 rounded-xl border transition-colors duration-300 ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white dark:bg-lilac-900 border-slate-100 dark:border-zinc-800 shadow-sm"
      }`}>
        <span className={`text-xs font-bold block mb-2 ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>Primary Preferences:</span>
        <div className="space-y-1.5 text-left">
          <span className={`block text-xs font-bold ${highContrast ? "text-yellow-400" : "text-slate-700 dark:text-zinc-300"}`}>✓ Vision Impaired Accommodations</span>
          <span className={`block text-xs font-bold ${highContrast ? "text-yellow-400" : "text-slate-700 dark:text-zinc-300"}`}>✓ Screen Reader Assistance</span>
          <span className={`block text-xs font-bold ${highContrast ? "text-yellow-400" : "text-slate-700 dark:text-zinc-300"}`}>✓ Atkinson Hyperlegible Typography</span>
        </div>

        <div className={`h-px my-4 ${highContrast ? "bg-yellow-400" : "bg-slate-100 dark:bg-zinc-800"}`}></div>

        <span className={`text-xs font-bold block mb-2 ${highContrast ? "text-yellow-400" : "text-slate-400 dark:text-zinc-400"}`}>Registered Skills:</span>
        <div className="flex flex-wrap gap-1">
          {["React", "UI/UX", "Technical Writing", "Figma"].map(sk => (
            <span key={sk} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              highContrast ? "bg-lilac-900 border border-yellow-400 text-yellow-400" : "bg-lilac-50 dark:bg-lilac-950/30 text-lilac-700 dark:text-lilac-300"
            }`}>
              {sk}
            </span>
          ))}
        </div>

        {onTabChange && (
          <button
            type="button"
            onClick={() => onTabChange("profile")}
            className={`w-full text-center py-2 rounded-lg font-bold text-xs mt-4 block transition-all ${
              highContrast
                ? "bg-yellow-400 text-black hover:bg-lilac-900 hover:text-yellow-400 border border-yellow-400"
                : "bg-lilac-600 text-white hover:bg-lilac-700"
            }`}
          >
            Modify Setup Details
          </button>
        )}
      </div>
    </div>
  );
}
