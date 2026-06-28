import React from "react";
import { Filter, RotateCcw } from "lucide-react";

export function SidebarFiltersHeader({ highContrast, clearFilters }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-lilac-600 dark:text-yellow-400" />
        <h2 className="font-extrabold text-lg tracking-tight">Search Filters</h2>
      </div>
      <button
        type="button"
        onClick={clearFilters}
        className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded transition-colors ${
          highContrast
            ? "border border-yellow-400 hover:bg-lilac-900"
            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
        }`}
        title="Reset Filters"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>
    </div>
  );
}

export function SidebarFiltersSearch({ searchQuery, setSearchQuery, highContrast }: any) {
  return (
    <div>
      <label htmlFor="search-roles" className="block text-xs font-bold uppercase tracking-wider mb-2">Search Roles</label>
      <input
        id="search-roles"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="e.g. Designer, Austin, Slack..."
        className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none ${
          highContrast
            ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400"
            : "bg-white border-slate-300 focus:ring-lilac-500 focus:border-lilac-500 text-slate-800"
        }`}
      />
    </div>
  );
}

export function SidebarFiltersDisability({ selectedCategory, setSelectedCategory, highContrast, CATEGORIES }: any) {
  return (
    <div>
      <legend className="block text-xs font-bold uppercase tracking-wider mb-2">Disability Suitability</legend>
      <fieldset className="space-y-1.5 w-full block">
        {CATEGORIES.map((cat: any) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              type="button"
              key={cat.name}
              onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
              aria-pressed={isSelected}
              className={`w-full flex items-center gap-3 p-3 text-left rounded-lg border transition-all ${
                isSelected
                  ? highContrast
                    ? "bg-yellow-400 text-black border-yellow-400 font-extrabold shadow-md"
                    : "bg-lilac-600 text-white border-lilac-600 font-extrabold shadow-md"
                  : highContrast
                  ? "border-yellow-400 hover:bg-lilac-900 text-yellow-400"
                  : "bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className={`p-1.5 rounded-md ${isSelected ? (highContrast ? "bg-lilac-950 text-yellow-400" : "bg-lilac-700 text-white") : (highContrast ? "bg-lilac-900" : "bg-slate-100")}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-bold leading-tight">{cat.name}</span>
                <span className={`text-[10px] block leading-none mt-0.5 ${isSelected ? (highContrast ? "text-black" : "text-lilac-100") : "text-slate-400"}`}>
                  {cat.description}
                </span>
              </div>
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}

export function SidebarFiltersAccommodations({ selectedAccommodations, toggleAccommodation, highContrast, ACCOMMODATION_OPTIONS }: any) {
  return (
    <div>
      <legend className="block text-xs font-bold uppercase tracking-wider mb-2">Key Accommodations</legend>
      <fieldset className="space-y-2 block w-full">
        {ACCOMMODATION_OPTIONS.map((opt: any) => {
          const isChecked = selectedAccommodations.includes(opt);

          return (
            <label
              key={opt}
              className={`flex items-center gap-2.5 cursor-pointer text-sm font-semibold hover:opacity-95 select-none ${
                highContrast ? "text-yellow-400" : "text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleAccommodation(opt)}
                className={`rounded h-4 w-4 ${
                  highContrast
                    ? "bg-lilac-950 border-yellow-400 checked:bg-yellow-400 text-black focus:ring-yellow-400"
                    : "border-slate-300 text-lilac-600 focus:ring-lilac-500"
                }`}
              />
              <span className="leading-tight">{opt}</span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
