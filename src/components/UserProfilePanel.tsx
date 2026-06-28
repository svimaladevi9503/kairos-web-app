import React, { useReducer, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { UserProfile, Job } from "../types";
import { UserProfileHeader, UserProfileForm, UserProfileResumeUpload, UserProfileMatches } from "./UserProfileWidgets";

interface UserProfilePanelProps {
  highContrast: boolean;
  onProfileUpdated: () => void;
  jobs: Job[];
}

type ProfileState = {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  successMsg: string;
  newSkill: string;
  newAcc: string;
  isDragging: boolean;
  resumeError: string;
};

type ProfileAction =
  | { type: "SET_PROFILE"; payload: UserProfile | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SUCCESS"; payload: string }
  | { type: "SET_NEW_SKILL"; payload: string }
  | { type: "SET_NEW_ACC"; payload: string }
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_RESUME_ERROR"; payload: string };

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SAVING":
      return { ...state, saving: action.payload };
    case "SET_SUCCESS":
      return { ...state, successMsg: action.payload };
    case "SET_NEW_SKILL":
      return { ...state, newSkill: action.payload };
    case "SET_NEW_ACC":
      return { ...state, newAcc: action.payload };
    case "SET_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_RESUME_ERROR":
      return { ...state, resumeError: action.payload };
    default:
      return state;
  }
}

export default function UserProfilePanel({ highContrast, onProfileUpdated, jobs }: UserProfilePanelProps) {
  const [state, dispatch] = useReducer(profileReducer, {
    profile: null,
    loading: true,
    saving: false,
    successMsg: "",
    newSkill: "",
    newAcc: "",
    isDragging: false,
    resumeError: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await fetch("/api/profile");
      const data = await res.json();
      dispatch({ type: "SET_PROFILE", payload: data });
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSave = async (updatedProfile: UserProfile) => {
    try {
      dispatch({ type: "SET_SAVING", payload: true });
      dispatch({ type: "SET_SUCCESS", payload: "" });
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      if (res.ok) {
        dispatch({ type: "SET_SUCCESS", payload: "Profile saved! AI matching algorithms triggered." });
        onProfileUpdated();
        setTimeout(() => dispatch({ type: "SET_SUCCESS", payload: "" }), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  const handleResumeFile = (file: File) => {
    dispatch({ type: "SET_RESUME_ERROR", payload: "" });
    if (!state.profile) return;

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch({ type: "SET_RESUME_ERROR", payload: "File size exceeds the 500 MB limit!" });
      return;
    }

    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    const isValidType =
      type.includes("pdf") ||
      type.includes("msword") ||
      type.includes("wordprocessingml") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx") ||
      type.startsWith("image/");

    if (!isValidType) {
      dispatch({ type: "SET_RESUME_ERROR", payload: "Invalid format! Please upload PDF, Word Document, or Image file." });
      return;
    }

    const fakeResume = {
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      uploadedAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = { ...state.profile, resume: fakeResume };
    dispatch({ type: "SET_PROFILE", payload: updated });
    handleSave(updated);
  };

  const handleCheckboxChange = (cat: 'Vision Impaired' | 'Orally Challenged' | 'Audibly Challenged') => {
    if (!state.profile) return;
    const current = state.profile.suitabilityCategories;
    const next = current.includes(cat) ? current.filter((item: string) => item !== cat) : [...current, cat];
    const updated = { ...state.profile, suitabilityCategories: next };
    dispatch({ type: "SET_PROFILE", payload: updated });
    handleSave(updated);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.profile || !state.newSkill.trim()) return;
    if (state.profile.skills.includes(state.newSkill.trim())) return;
    const updated = { ...state.profile, skills: [...state.profile.skills, state.newSkill.trim()] };
    dispatch({ type: "SET_PROFILE", payload: updated });
    dispatch({ type: "SET_NEW_SKILL", payload: "" });
    handleSave(updated);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!state.profile) return;
    const updated = { ...state.profile, skills: state.profile.skills.filter((s: string) => s !== skillToRemove) };
    dispatch({ type: "SET_PROFILE", payload: updated });
    handleSave(updated);
  };

  const handleAddAccommodation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.profile || !state.newAcc.trim()) return;
    if (state.profile.accommodationRequirements.includes(state.newAcc.trim())) return;
    const updated = {
      ...state.profile,
      accommodationRequirements: [...state.profile.accommodationRequirements, state.newAcc.trim()]
    };
    dispatch({ type: "SET_PROFILE", payload: updated });
    dispatch({ type: "SET_NEW_ACC", payload: "" });
    handleSave(updated);
  };

  const handleRemoveAccommodation = (accToRemove: string) => {
    if (!state.profile) return;
    const updated = {
      ...state.profile,
      accommodationRequirements: state.profile.accommodationRequirements.filter((a: string) => a !== accToRemove)
    };
    dispatch({ type: "SET_PROFILE", payload: updated });
    handleSave(updated);
  };

  const proactiveMatches = [...jobs]
    .filter(j => j.isActive && (j.compatibilityScore || 0) >= 60)
    .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="font-bold text-slate-500">Loading Profile Data...</span>
      </div>
    );
  }

  if (!state.profile) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="mx-auto w-10 h-10 mb-2" />
        <span>Error loading user profile. Please try refreshing.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 rounded-2xl border ${highContrast ? "bg-lilac-950 border-yellow-400" : "bg-white border-slate-100 shadow-sm"}`}>
          <UserProfileHeader state={state} highContrast={highContrast} />
          
          <UserProfileForm 
            state={state} 
            dispatch={dispatch} 
            handleSave={handleSave} 
            handleCheckboxChange={handleCheckboxChange} 
            highContrast={highContrast} 
            handleAddSkill={handleAddSkill} 
            handleRemoveSkill={handleRemoveSkill} 
            handleAddAccommodation={handleAddAccommodation} 
            handleRemoveAccommodation={handleRemoveAccommodation} 
          />
          
          <UserProfileResumeUpload 
            state={state} 
            dispatch={dispatch} 
            handleSave={handleSave} 
            handleResumeFile={handleResumeFile} 
            highContrast={highContrast} 
          />
        </div>
      </div>

      <UserProfileMatches proactiveMatches={proactiveMatches} highContrast={highContrast} />
    </div>
  );
}
