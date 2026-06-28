import { Eye, VolumeX, MicOff } from "lucide-react";
import { SidebarFiltersHeader, SidebarFiltersSearch, SidebarFiltersDisability, SidebarFiltersAccommodations } from "./SidebarFiltersWidgets";

interface SidebarFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAccommodations: string[];
  toggleAccommodation: (acc: string) => void;
  highContrast: boolean;
  clearFilters: () => void;
}

const CATEGORIES = [
  { name: "Vision Impaired", icon: Eye, description: "Screen readers, contrast tools" },
  { name: "Orally Challenged", icon: MicOff, description: "Written/non-verbal, text chat" },
  { name: "Audibly Challenged", icon: VolumeX, description: "ASL, visual signs, live captions" },
];

const ACCOMMODATION_OPTIONS = [
  "Fully Remote Option",
  "Screen Reader Support",
  "100% Text-Only Communications",
  "ASL-supported Onboarding",
  "Live Captioning Tools",
  "Flexible Core Hours",
];

export default function SidebarFilters({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedAccommodations,
  toggleAccommodation,
  highContrast,
  clearFilters,
}: SidebarFiltersProps) {
  return (
    <aside className={`w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 p-5 rounded-xl border ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-800"
    }`}>
      <SidebarFiltersHeader highContrast={highContrast} clearFilters={clearFilters} />

      <div className={`h-px ${highContrast ? "bg-yellow-400" : "bg-slate-200"}`}></div>

      <SidebarFiltersSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} highContrast={highContrast} />

      <SidebarFiltersDisability 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        highContrast={highContrast} 
        CATEGORIES={CATEGORIES} 
      />

      <div className={`h-px ${highContrast ? "bg-yellow-400" : "bg-slate-200"}`}></div>

      <SidebarFiltersAccommodations 
        selectedAccommodations={selectedAccommodations} 
        toggleAccommodation={toggleAccommodation} 
        highContrast={highContrast} 
        ACCOMMODATION_OPTIONS={ACCOMMODATION_OPTIONS} 
      />
    </aside>
  );
}
