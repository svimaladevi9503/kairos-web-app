import { useMemo } from "react";

export function useJobFiltering(jobs: any[], selectedCategory: string | null, searchQuery: string, selectedAccommodations: string[]) {
  return useMemo(() => {
    return jobs.filter((job) => {
      if (selectedCategory && !job.categories.includes(selectedCategory)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchLocation = job.location.toLowerCase().includes(q);
        const matchSummary = job.aiSummary.toLowerCase().includes(q);
        const matchDescription = job.description?.toLowerCase().includes(q);
        const matchSalary = job.salary?.toLowerCase().includes(q);
        const matchCategories = job.categories.some((cat: string) => cat.toLowerCase().includes(q));
        const matchTooling = job.accommodations.tooling.some((t: string) => t.toLowerCase().includes(q));
        const matchPolicy = job.accommodations.policy.some((p: string) => p.toLowerCase().includes(q));
        const matchSkills = job.highlightedSkills?.some((s: string) => s.toLowerCase().includes(q)) || false;

        if (!matchTitle && !matchCompany && !matchLocation && !matchSummary && !matchDescription && !matchSalary && !matchCategories && !matchTooling && !matchPolicy && !matchSkills) {
          return false;
        }
      }
      if (selectedAccommodations.length > 0) {
        const allAccs = [...job.accommodations.tooling, ...job.accommodations.policy];
        const hasAll = selectedAccommodations.every((reqAcc) =>
          allAccs.some((jobAcc) => jobAcc.toLowerCase().includes(reqAcc.toLowerCase()) || reqAcc.toLowerCase().includes(jobAcc.toLowerCase()))
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [jobs, selectedCategory, searchQuery, selectedAccommodations]);
}
