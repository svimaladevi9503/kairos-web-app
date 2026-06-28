import { useEffect } from "react";

export function useGlobalShortcuts(
  state: any,
  dispatch: any,
  handleReadAloud: (text: string) => void,
  speakAnnouncement: (text: string) => void,
  filteredJobsLength: number
) {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isSpace = e.code === "Space" || e.key === " ";
      const isSlash = e.key === "/";

      if (e.ctrlKey && e.metaKey && e.altKey && (isSpace || isSlash)) {
        e.preventDefault();
        dispatch({ type: "SET_TAB", payload: "chat" });
        dispatch({ type: "SET_SANDBOX_STATE", payload: "chat_active" });
        dispatch({ type: "SET_AUTO_START_VOICE", payload: true });
        speakAnnouncement("Navigating to Chatbot. Starting voice input.");
        return;
      }

      if (e.ctrlKey && e.altKey && !e.metaKey && isSlash) {
        e.preventDefault();
        if (typeof window !== "undefined" && window.speechSynthesis) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            speakAnnouncement("Speech stopped.");
          } else {
            dispatch({ type: "SET_SCREEN_READER_HELP", payload: true });
            let readText = "";
            if (state.activeTab === "home") {
              readText = "Welcome to the Kairos Portal. Connecting differently-abled job seekers with matching opportunities. Press Control Windows Alt Space to trigger voice search.";
            } else if (state.activeTab === "jobs") {
              readText = `Find Jobs Portal. Currently displaying ${filteredJobsLength} accommodation-aware opportunities.`;
            } else if (state.activeTab === "chat") {
              readText = "AI Conversational Discovery with Kairos Assistant. Type your queries or use voice command by pressing Control Windows Alt Space.";
            } else if (state.activeTab === "applied") {
              readText = "Applications and Automated Follow-Up Board. Review your job applications, suitability metrics, and progress logs.";
            } else {
              readText = `${state.activeTab} section of the career portal is currently open.`;
            }
            handleReadAloud(readText);
          }
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [state.activeTab, state.sandboxState, filteredJobsLength, dispatch, handleReadAloud, speakAnnouncement]);
}
