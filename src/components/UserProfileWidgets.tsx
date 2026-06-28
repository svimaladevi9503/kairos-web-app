import React from "react";
import { User, Mail, FileText, Upload, Check, Loader2, Sparkles, Activity } from "lucide-react";

export function UserProfileHeader({ state, highContrast }: any) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-yellow-400" />
          <span>Job Seeker Profile Credentials</span>
        </h2>
        {state.saving ? (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Auto-saving...
          </span>
        ) : (
          <span className="text-xs text-green-500 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Synchronized
          </span>
        )}
      </div>

      {state.successMsg && (
        <div className={`p-3 mb-4 text-xs font-bold rounded-lg flex items-center gap-2 ${
          highContrast ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400" : "bg-green-50 text-green-800 border border-green-200"
        }`}>
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>{state.successMsg}</span>
        </div>
      )}
    </>
  );
}

export function UserProfileForm({ state, dispatch, handleSave, handleCheckboxChange, highContrast, handleAddSkill, handleRemoveSkill, handleAddAccommodation, handleRemoveAccommodation }: any) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="profileName" className="block text-xs font-bold uppercase mb-1 text-slate-500">Full Name</label>
          <div className="relative">
            <input
              id="profileName"
              type="text"
              value={state.profile.name}
              onChange={(e) => {
                const u = { ...state.profile!, name: e.target.value };
                dispatch({ type: "SET_PROFILE", payload: u });
                handleSave(u);
              }}
              className={`w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border font-semibold outline-none focus:ring-2 ${
                highContrast
                  ? "bg-lilac-950 border-yellow-400 text-yellow-400 focus:ring-yellow-400"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-100 focus:border-blue-400"
              }`}
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div>
          <label htmlFor="profileEmail" className="block text-xs font-bold uppercase mb-1 text-slate-500">Email Address</label>
          <div className="relative">
            <input
              id="profileEmail"
              type="email"
              value={state.profile.email}
              onChange={(e) => {
                const u = { ...state.profile!, email: e.target.value };
                dispatch({ type: "SET_PROFILE", payload: u });
                handleSave(u);
              }}
              className={`w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border font-semibold outline-none focus:ring-2 ${
                highContrast
                  ? "bg-lilac-950 border-yellow-400 text-yellow-400 focus:ring-yellow-400"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-100 focus:border-blue-400"
              }`}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <legend className="block text-xs font-bold uppercase mb-2 text-slate-500">
          Primary Suitability Category / Preferences
        </legend>
        <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          {(["Vision Impaired", "Orally Challenged", "Audibly Challenged"] as const).map((cat) => {
            const isChecked = state.profile!.suitabilityCategories.includes(cat);
            return (
              <label
                key={cat}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                  isChecked
                    ? highContrast
                      ? "bg-yellow-400 text-black border-yellow-400 font-black"
                      : "bg-blue-50/80 border-blue-200 text-blue-900 font-bold"
                    : highContrast
                    ? "border-yellow-400/30 text-yellow-400 hover:bg-zinc-900"
                    : "border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(cat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCheckboxChange(cat);
                    }
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs">{cat}</span>
              </label>
            );
          })}
        </fieldset>
      </div>

      <div className="mb-6">
        <label htmlFor="skillInput" className="block text-xs font-bold uppercase mb-1 text-slate-500">Skills Dataset (Auto-Matches Listings)</label>
        <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
          <input
            id="skillInput"
            type="text"
            placeholder="Add skill (e.g. Figma, Technical Writing, Python)..."
            value={state.newSkill}
            onChange={(e) => dispatch({ type: "SET_NEW_SKILL", payload: e.target.value })}
            className={`flex-1 text-xs px-3 py-2 rounded-lg border outline-none ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-xs font-bold rounded-lg ${
              highContrast ? "bg-yellow-400 text-black" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Add Tag
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {state.profile.skills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No skills registered yet.</span>
          ) : (
            state.profile.skills.map((skill: string) => (
              <button
                type="button"
                key={skill}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  highContrast
                    ? "bg-zinc-900 border border-yellow-400 text-yellow-400"
                    : "bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all"
                }`}
                onClick={() => handleRemoveSkill(skill)}
                title="Click to remove skill tag"
                aria-label={`Remove skill ${skill}`}
              >
                <span>{skill}</span>
                <span className="opacity-60 text-[10px]">×</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="accInput" className="block text-xs font-bold uppercase mb-1 text-slate-500">Required Accommodations (Tooling or policy)</label>
        <form onSubmit={handleAddAccommodation} className="flex gap-2 mb-3">
          <input
            id="accInput"
            type="text"
            placeholder="Add requirement (e.g. Screen Reader Support, ASL translator, Async Standups)..."
            value={state.newAcc}
            onChange={(e) => dispatch({ type: "SET_NEW_ACC", payload: e.target.value })}
            className={`flex-1 text-xs px-3 py-2 rounded-lg border outline-none ${
              highContrast
                ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-xs font-bold rounded-lg ${
              highContrast ? "bg-yellow-400 text-black" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Add Tag
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {state.profile.accommodationRequirements.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No requested accommodations registered.</span>
          ) : (
            state.profile.accommodationRequirements.map((acc: string) => (
              <button
                type="button"
                key={acc}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  highContrast
                    ? "bg-zinc-900 border border-yellow-400 text-yellow-400"
                    : "bg-indigo-50 text-indigo-800 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all"
                }`}
                onClick={() => handleRemoveAccommodation(acc)}
                title="Click to remove accommodation request"
                aria-label={`Remove accommodation ${acc}`}
              >
                <span>{acc}</span>
                <span className="opacity-60 text-[10px]">×</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="profileExp" className="block text-xs font-bold uppercase mb-1 text-slate-500">Professional Work Experience</label>
        <textarea
          id="profileExp"
          rows={3}
          value={state.profile.experience}
          onChange={(e) => {
            const u = { ...state.profile!, experience: e.target.value };
            dispatch({ type: "SET_PROFILE", payload: u });
            handleSave(u);
          }}
          placeholder="Describe your primary work experience or previous positions..."
          className={`w-full text-xs p-3 rounded-lg border font-semibold outline-none ${
            highContrast
              ? "bg-lilac-950 border-yellow-400 text-yellow-400"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
          }`}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="profileEdu" className="block text-xs font-bold uppercase mb-1 text-slate-500">Education Background</label>
        <input
          id="profileEdu"
          type="text"
          value={state.profile.education}
          onChange={(e) => {
            const u = { ...state.profile!, education: e.target.value };
            dispatch({ type: "SET_PROFILE", payload: u });
            handleSave(u);
          }}
          placeholder="E.g. College Degrees, Certifications, Audits..."
          className={`w-full text-xs px-3 py-2.5 rounded-lg border font-semibold outline-none ${
            highContrast
              ? "bg-lilac-950 border-yellow-400 text-yellow-400"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
          }`}
        />
      </div>
    </>
  );
}

export function UserProfileResumeUpload({ state, dispatch, handleSave, handleResumeFile, highContrast }: any) {
  return (
    <div className="pt-6 border-t border-slate-100 dark:border-yellow-400/30">
      <span className="block text-xs font-bold uppercase mb-2 text-slate-500">
        Interactive Resume Upload (Single Entry • Max 500 MB)
      </span>
      {state.profile.resume ? (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${highContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-700"}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-extrabold truncate max-w-[200px] sm:max-w-xs">{state.profile.resume.name}</span>
              <span className="block text-[10px] text-slate-400">
                {(state.profile.resume.size / (1024 * 1024)).toFixed(2)} MB • {state.profile.resume.type.split("/")[1]?.toUpperCase() || "DOC"} • Uploaded: {state.profile.resume.uploadedAt}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const u = { ...state.profile!, resume: null };
              dispatch({ type: "SET_PROFILE", payload: u });
              handleSave(u);
            }}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${
              highContrast ? "bg-red-900 border border-red-500 text-red-200" : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            aria-label="Delete uploaded resume file"
          >
            Delete File
          </button>
        </div>
      ) : (
        <button
          type="button"
          onDragOver={(e) => { e.preventDefault(); dispatch({ type: "SET_DRAGGING", payload: true }); }}
          onDragLeave={() => dispatch({ type: "SET_DRAGGING", payload: false })}
          onDrop={(e) => {
            e.preventDefault();
            dispatch({ type: "SET_DRAGGING", payload: false });
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              handleResumeFile(files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${
            state.isDragging
              ? highContrast
                ? "border-yellow-400 bg-zinc-900"
                : "border-blue-500 bg-blue-50/50"
              : highContrast
              ? "border-yellow-400/40 hover:border-yellow-400"
              : "border-slate-300 hover:border-blue-400 bg-slate-50/30 hover:bg-slate-50"
          }`}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,.doc,.docx,image/*";
            input.onchange = (e: any) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleResumeFile(files[0]);
              }
            };
            input.click();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf,.doc,.docx,image/*";
              input.onchange = (ev: any) => {
                const files = ev.target.files;
                if (files && files.length > 0) {
                  handleResumeFile(files[0]);
                }
              };
              input.click();
            }
          }}
          aria-label="Upload resume file"
        >
          <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 ${
            highContrast ? "bg-zinc-900 text-yellow-400" : "bg-blue-50 text-blue-600"
          }`}>
            <Upload className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-slate-700 dark:text-yellow-400">
            Drag and drop your Resume here, or click to browse
          </span>
          <span className="block text-[10px] text-slate-400 mt-1">
            Supports PDF, Word Documents, or Image formats (Max 500 MB limit)
          </span>
          {state.resumeError && (
            <span className="block text-[11px] font-bold text-red-500 mt-2 animate-pulse">
              ⚠️ {state.resumeError}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export function UserProfileMatches({ proactiveMatches, highContrast }: any) {
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-100 shadow-sm"}`}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="font-extrabold text-base">Proactive Match Recommendations</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Our background crawler uses your suitability categories, specified skillset, and exact accommodations to score matching opportunities.
        </p>

        <div className="space-y-4">
          {proactiveMatches.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-lg border-slate-200 text-slate-400">
              <p className="text-xs">No opportunities scoring &gt;60% compatibility matches yet.</p>
              <p className="text-[10px] mt-1">Try updating your skills or accommodation requirements above.</p>
            </div>
          ) : (
            proactiveMatches.map((job: any) => (
              <div
                key={job.id}
                className={`p-4 rounded-xl border transition-all ${
                  highContrast
                    ? "bg-lilac-950 border-yellow-400 text-yellow-400"
                    : "bg-slate-50/50 border-slate-100 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs truncate max-w-[150px]">{job.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    (job.compatibilityScore || 0) >= 80
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {job.compatibilityScore}% Match
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-bold -mt-1">{job.company} • {job.location}</span>

                {job.highlightedSkills && job.highlightedSkills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.highlightedSkills.map((sk: string) => (
                      <span key={sk} className="text-[9px] font-bold bg-blue-100/60 text-blue-800 px-1.5 py-0.5 rounded">
                        ✓ Skill: {sk}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">
                  {job.compatibilityReason}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-100 shadow-sm"}`}>
        <div className="flex items-center gap-2 mb-2 text-indigo-500">
          <Sparkles className="w-5 h-5" />
          <h4 className="font-extrabold text-sm">Skills Highlighting Engine</h4>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          When you view any recommended positions, your matching tags (like <strong>Figma</strong> or <strong>Technical Writing</strong>) are automatically highlighted to assist recruiters in instant resume parsing.
        </p>
      </div>
    </div>
  );
}
