import React from "react";
import { Sparkles } from "lucide-react";

export function JobScraperHeader({ highContrast }: { highContrast: boolean }) {
  return (
    <div className={`p-5 rounded-xl border ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-blue-50/50 border-blue-100 text-blue-900"
    }`}>
      <div className="flex gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-yellow-400 shrink-0 mt-0.5 animate-spin" />
        <div>
          <h3 className="font-extrabold text-base leading-snug">AI Scraped Job Classifier</h3>
          <p className="text-xs mt-1 leading-relaxed opacity-90">
             Kairos utilizes AI layers to scrape or parse mainstream descriptions, classifying listings under disability categories, extracting granular accommodation policies, and translating dense terms into simplified plain-language summaries. Paste a raw description below to simulate the automation!
          </p>
        </div>
      </div>
    </div>
  );
}
