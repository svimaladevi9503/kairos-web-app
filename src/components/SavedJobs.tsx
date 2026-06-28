import React, { useState } from "react";
import { Job } from "../types";
import { SavedJobsHeader, SavedJobsSearch, SavedJobsEmptyState, SavedJobsList } from "./SavedJobsWidgets";

interface SavedJobsProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (id: string) => void;
  applications: any[];
  onApply: (id: string) => void;
  onAskAI: (jobName: string, company: string) => void;
  highContrast: boolean;
  onReadAloud?: (text: string) => void;
  onBackToJobs?: () => void;
}

export default function SavedJobs({
  jobs,
  savedJobIds,
  onToggleSave,
  applications,
  onApply,
  onAskAI,
  highContrast,
  onReadAloud,
  onBackToJobs,
}: SavedJobsProps) {
  const [localSearch, setLocalSearch] = useState("");

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));
  
  const filteredSavedJobs = savedJobs.filter((job) => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.aiSummary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <SavedJobsHeader 
        savedJobsCount={savedJobs.length} 
        highContrast={highContrast} 
        onBackToJobs={onBackToJobs} 
      />

      <SavedJobsSearch 
        localSearch={localSearch} 
        setLocalSearch={setLocalSearch} 
        highContrast={highContrast} 
        hasJobs={savedJobs.length > 0} 
      />

      {savedJobs.length === 0 || filteredSavedJobs.length === 0 ? (
        <SavedJobsEmptyState 
          isNoJobs={savedJobs.length === 0}
          isNoSearchResults={filteredSavedJobs.length === 0}
          localSearch={localSearch}
          highContrast={highContrast}
          onBackToJobs={onBackToJobs}
        />
      ) : (
        <SavedJobsList 
          filteredSavedJobs={filteredSavedJobs}
          applications={applications}
          onApply={onApply}
          onAskAI={onAskAI}
          highContrast={highContrast}
          onReadAloud={onReadAloud}
          onToggleSave={onToggleSave}
        />
      )}
    </div>
  );
}
