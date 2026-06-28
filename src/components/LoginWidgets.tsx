import React from "react";
import { Mail, Lock, User, Accessibility, Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";
import KairosLogo from "./KairosLogo";

export function LoginHeader({ highContrast, onContrastToggle, darkMode, onDarkModeToggle, textScale, onTextScaleChange }: any) {
  return (
    <>
      <div className={`absolute top-4 right-4 flex items-center gap-2 p-2 rounded-xl border transition-all ${
        highContrast 
          ? "bg-lilac-900 border-yellow-400 text-yellow-400" 
          : darkMode
          ? "bg-lilac-900 border-zinc-800 text-[#FAF8F5]"
          : "bg-white shadow-sm border-slate-100"
      }`}>
        <button
          type="button"
          onClick={onContrastToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            highContrast
              ? "bg-yellow-400 text-black"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Accessibility className="w-3.5 h-3.5" />
          <span>{highContrast ? "Disable High Contrast" : "High Contrast"}</span>
        </button>

        {!highContrast && (
          <button
            type="button"
            onClick={onDarkModeToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              darkMode
                ? "bg-lilac-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        )}

        <div className="flex items-center gap-1 border-l pl-2 border-slate-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Scale:</span>
          {(["normal", "large", "xlarge"] as const).map((scale) => (
            <button
              type="button"
              key={scale}
              onClick={() => onTextScaleChange(scale)}
              className={`px-2 py-1 text-[10px] font-extrabold rounded ${
                textScale === scale
                  ? highContrast
                    ? "bg-yellow-400 text-black"
                    : "bg-lilac-600 text-white"
                  : highContrast
                  ? "border border-yellow-400/40 text-yellow-400"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {scale === "normal" ? "100%" : scale === "large" ? "110%" : "125%"}
            </button>
          ))}
        </div>
      </div>

      <div className={`md:col-span-5 p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
        highContrast 
          ? "bg-lilac-900 text-yellow-400 border-r border-yellow-400" 
          : darkMode 
          ? "bg-lilac-900 border-r border-zinc-800 text-[#FAF8F5]" 
          : "bg-lilac-100 border-r border-slate-200/60 text-slate-800"
      }`}>
        {!highContrast && !darkMode && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-lilac-200 rounded-full filter blur-3xl opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-lilac-300 rounded-full filter blur-2xl opacity-30 -ml-10 -mb-10"></div>
          </>
        )}

        <div className="relative z-10 space-y-6">
          <KairosLogo size="lg" highContrast={highContrast} themeMode={darkMode ? "dark" : "light"} />

          <div className="space-y-2 pt-4">
            <h1 className="text-2xl font-black leading-tight tracking-tight">
              Empowering Inclusive Opportunities
            </h1>
            <p className="text-xs opacity-90 leading-relaxed font-medium">
              Kairos bridges the gap between digital talents and highly accommodating work environments. Log in to synchronize your sensory, physical, and cognitive profile details.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 space-y-4">
          <div className={`p-4 rounded-xl border ${
            highContrast 
              ? "bg-lilac-950 border-yellow-400" 
              : darkMode
              ? "bg-lilac-950 border-zinc-800"
              : "bg-white/70 border-slate-300/40"
          }`}>
            <span className="block text-[10px] font-black uppercase tracking-wider mb-2">
              Core Principles
            </span>
            <ul className="space-y-1.5 text-[11px] opacity-90">
              <li className="flex items-center gap-2">
                <span className={highContrast ? "text-yellow-400 font-extrabold" : "text-lilac-600 font-extrabold"}>✓</span>
                <span>Human-Centric Design Principles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={highContrast ? "text-yellow-400 font-extrabold" : "text-lilac-600 font-extrabold"}>✓</span>
                <span>Screen-Reader Compatibility</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={highContrast ? "text-yellow-400 font-extrabold" : "text-lilac-600 font-extrabold"}>✓</span>
                <span>Deep AI Job Accommodation Audit</span>
              </li>
            </ul>
          </div>

          <p className="text-[10px] opacity-60 font-mono text-center">
            Kairos Systems • Continuous Calibration Enabled
          </p>
        </div>
      </div>
    </>
  );
}

export function LoginForm({ state, dispatch, handleSubmit, handleGuestLogin, highContrast, darkMode }: any) {
  return (
    <div className={`md:col-span-7 p-8 sm:p-10 flex flex-col justify-center transition-all duration-300 ${
      highContrast 
        ? "bg-lilac-950 text-yellow-400" 
        : darkMode
        ? "bg-lilac-950 text-[#FAF8F5]"
        : "bg-white text-slate-900"
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-black tracking-tight ${
          highContrast ? "text-yellow-400" : darkMode ? "text-white" : "text-slate-900"
        }`}>
          {state.isSignUp ? "Create Inclusive Account" : "Welcome Back"}
        </h2>
        <p className={`text-xs mt-1 ${
          highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
        }`}>
          {state.isSignUp 
            ? "Enter credentials and accessibility defaults below to configure your portal." 
            : "Sign in with your credentials, or access as a workspace guest."
          }
        </p>
      </div>

      {state.error && (
        <div className={`p-3 rounded-xl mb-4 border flex items-center gap-2.5 text-xs font-bold ${
          highContrast ? "bg-lilac-950 border-red-500 text-red-400" : "bg-red-50 border-red-100 text-red-700"
        }`}>
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {state.isSignUp && (
          <div className="space-y-1 text-left">
            <label htmlFor="loginName" className={`block text-[10px] font-bold uppercase ${
              highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
            }`}>Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="loginName"
                type="text"
                required
                value={state.name}
                onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "name", value: e.target.value } })}
                placeholder="e.g. Alex Johnson"
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                  highContrast 
                    ? "bg-lilac-950 border-yellow-400 text-yellow-400 focus:ring-1 focus:ring-yellow-400" 
                    : darkMode
                    ? "bg-lilac-900 border-zinc-800 text-white focus:border-lilac-500 focus:ring-4 focus:ring-lilac-950/20"
                    : "bg-white border-slate-200 text-slate-800 focus:border-lilac-500 focus:ring-4 focus:ring-lilac-100"
                }`}
              />
            </div>
          </div>
        )}

        <div className="space-y-1 text-left">
          <label htmlFor="loginEmail" className={`block text-[10px] font-bold uppercase ${
            highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
          }`}>Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="loginEmail"
              type="email"
              required
              value={state.email}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "email", value: e.target.value } })}
              placeholder="alex.johnson@accessibility.org"
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                highContrast 
                  ? "bg-lilac-950 border-yellow-400 text-yellow-400 focus:ring-1 focus:ring-yellow-400" 
                  : darkMode
                  ? "bg-lilac-900 border-zinc-800 text-white focus:border-lilac-500 focus:ring-4 focus:ring-lilac-950/20"
                  : "bg-white border-slate-200 text-slate-800 focus:border-lilac-500 focus:ring-4 focus:ring-lilac-100"
              }`}
            />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label htmlFor="loginPassword" className={`block text-[10px] font-bold uppercase ${
            highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
          }`}>Secret Password</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="loginPassword"
              type={state.showPassword ? "text" : "password"}
              required
              value={state.password}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "password", value: e.target.value } })}
              placeholder="••••••••"
              className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                highContrast 
                  ? "bg-lilac-950 border-yellow-400 text-yellow-400 focus:ring-1 focus:ring-yellow-400" 
                  : darkMode
                  ? "bg-lilac-900 border-zinc-800 text-white focus:border-lilac-500 focus:ring-4 focus:ring-lilac-950/20"
                  : "bg-white border-slate-200 text-slate-800 focus:border-lilac-500 focus:ring-4 focus:ring-lilac-100"
              }`}
            />
            <button
              type="button"
              aria-label={state.showPassword ? "Hide password" : "Show password"}
              onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 outline-none"
            >
              {state.showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {state.isSignUp && (
          <div className={`pt-2 space-y-3 border-t text-left ${
            highContrast ? "border-yellow-400" : darkMode ? "border-zinc-800" : "border-slate-100"
          }`}>
            <div>
              <span className={`block text-[10px] font-bold uppercase ${
                highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
              }`}>
                Suitability Focus
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {["Vision Impaired", "Audibly Challenged", "Orally Challenged"].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => dispatch({ type: "TOGGLE_CATEGORY", payload: cat })}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      state.selectedCategories.includes(cat)
                        ? highContrast
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-lilac-600 text-white border-lilac-600"
                        : highContrast
                        ? "border-yellow-400/40 text-yellow-400"
                        : darkMode
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className={`block text-[10px] font-bold uppercase ${
                highContrast ? "text-yellow-400" : darkMode ? "text-zinc-400" : "text-slate-500"
              }`}>
                Bespoke Accommodations Support
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  "Screen Reader Support",
                  "High-Contrast Theme Workspaces",
                  "100% Text-Only Communications",
                  "Live Captioning Tools",
                  "Text-to-Speech Voice Synthesisers",
                ].map((acc) => (
                  <button
                    type="button"
                    key={acc}
                    onClick={() => dispatch({ type: "TOGGLE_ACC", payload: acc })}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      state.selectedAccs.includes(acc)
                        ? highContrast
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-lilac-600 text-white border-lilac-600"
                        : highContrast
                        ? "border-yellow-400/40 text-yellow-400"
                        : darkMode
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={state.loading}
            className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
              highContrast
                ? "bg-yellow-400 text-black hover:bg-zinc-950 hover:text-yellow-400 border border-yellow-400"
                : "bg-lilac-600 hover:bg-lilac-700 text-white"
            }`}
          >
            <span>{state.loading ? "Processing..." : state.isSignUp ? "Sign Up & Setup" : "Sign In to Workspace"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-between text-[11px] pt-1.5">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_SIGNUP" })}
              className={`font-bold hover:underline ${
                highContrast ? "text-yellow-400" : "text-lilac-600"
              }`}
            >
              {state.isSignUp ? "Already have an account? Sign In" : "Need an account? Create Account"}
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="font-bold text-slate-400 hover:text-slate-600 hover:underline"
            >
              Browse as Guest &rarr;
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
