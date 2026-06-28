import React, { useReducer } from "react";
import { LoginHeader, LoginForm } from "./LoginWidgets";

interface LoginPageProps {
  onLoginSuccess: (userData: { name: string; email: string }) => void;
  highContrast: boolean;
  onContrastToggle: () => void;
  textScale: "normal" | "large" | "xlarge";
  onTextScaleChange: (scale: "normal" | "large" | "xlarge") => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

type LoginState = {
  isSignUp: boolean;
  email: string;
  password: string;
  name: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  selectedAccs: string[];
  selectedCategories: string[];
};

type LoginAction =
  | { type: "SET_FIELD"; payload: { field: keyof LoginState; value: any } }
  | { type: "TOGGLE_SIGNUP" }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "TOGGLE_ACC"; payload: string }
  | { type: "TOGGLE_CATEGORY"; payload: string };

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "TOGGLE_SIGNUP":
      return { ...state, isSignUp: !state.isSignUp, error: "" };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "TOGGLE_ACC":
      return {
        ...state,
        selectedAccs: state.selectedAccs.includes(action.payload)
          ? state.selectedAccs.filter((item) => item !== action.payload)
          : [...state.selectedAccs, action.payload],
      };
    case "TOGGLE_CATEGORY":
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.payload)
          ? state.selectedCategories.filter((item) => item !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    default:
      return state;
  }
}

export default function LoginPage({
  onLoginSuccess,
  highContrast,
  onContrastToggle,
  textScale,
  onTextScaleChange,
  darkMode,
  onDarkModeToggle,
}: LoginPageProps) {
  const [state, dispatch] = useReducer(loginReducer, {
    isSignUp: false,
    email: "",
    password: "",
    name: "",
    showPassword: false,
    loading: false,
    error: "",
    selectedAccs: [],
    selectedCategories: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_FIELD", payload: { field: "error", value: "" } });

    if (!state.email || !state.password) {
      dispatch({ type: "SET_FIELD", payload: { field: "error", value: "Please fill in all credentials." } });
      return;
    }
    if (state.isSignUp && !state.name) {
      dispatch({ type: "SET_FIELD", payload: { field: "error", value: "Please enter your name." } });
      return;
    }

    dispatch({ type: "SET_FIELD", payload: { field: "loading", value: true } });

    try {
      const endpoint = "/api/profile";
      const payload = {
        name: state.isSignUp ? state.name : undefined,
        email: state.email,
        suitabilityCategories: state.selectedCategories.length > 0 ? state.selectedCategories : undefined,
        accommodationRequirements: state.selectedAccs.length > 0 ? state.selectedAccs : undefined,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess({
          name: data.profile?.name || state.name || "Alex Johnson",
          email: data.profile?.email || state.email || "alex.johnson@accessibility.org",
        });
      } else {
        throw new Error("Unable to authenticate.");
      }
    } catch (err) {
      dispatch({ type: "SET_FIELD", payload: { field: "error", value: "Authentication failed. Please check your network and credentials." } });
    } finally {
      dispatch({ type: "SET_FIELD", payload: { field: "loading", value: false } });
    }
  };

  const handleGuestLogin = () => {
    onLoginSuccess({
      name: "Alex Johnson",
      email: "alex.johnson@accessibility.org",
    });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-300 ${
      highContrast 
        ? "bg-lilac-950 text-yellow-400 font-mono" 
        : darkMode
        ? "bg-lilac-950 text-[#FAF8F5]"
        : "bg-lilac-50 text-slate-800"
    }`}>
      <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border transition-all ${
        highContrast 
          ? "border-yellow-400 bg-lilac-950" 
          : darkMode
          ? "border-zinc-800 bg-lilac-950"
          : "border-slate-200/60 bg-white"
      }`}>
        <LoginHeader 
          highContrast={highContrast} 
          onContrastToggle={onContrastToggle} 
          darkMode={darkMode} 
          onDarkModeToggle={onDarkModeToggle} 
          textScale={textScale} 
          onTextScaleChange={onTextScaleChange} 
        />
        <LoginForm 
          state={state} 
          dispatch={dispatch} 
          handleSubmit={handleSubmit} 
          handleGuestLogin={handleGuestLogin} 
          highContrast={highContrast} 
          darkMode={darkMode} 
        />
      </div>
    </div>
  );
}
