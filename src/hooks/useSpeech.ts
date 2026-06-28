import { useCallback, useEffect } from "react";

export function useSpeech(speechVolume: number, screenReaderHelp: boolean) {
  const speakAnnouncement = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.volume = speechVolume;

      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang.toLowerCase().includes("en-in") || v.lang.toLowerCase().includes("in-")
      );
      if (indianVoice) {
        utterance.voice = indianVoice;
      } else {
        utterance.lang = "en-IN";
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [speechVolume]);

  const handleReadAloud = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.volume = speechVolume;

      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang.toLowerCase().includes("en-in") || v.lang.toLowerCase().includes("in-")
      );
      if (indianVoice) {
        utterance.voice = indianVoice;
      } else {
        utterance.lang = "en-IN";
      }

      window.speechSynthesis.speak(utterance);
      
      if (screenReaderHelp) {
        speakAnnouncement("Reading plain language summary aloud.");
      }
    }
  }, [speechVolume, screenReaderHelp, speakAnnouncement]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button, a, [role='button']");
      if (button) {
        let textToRead = button.getAttribute("aria-label") || button.getAttribute("title") || button.textContent?.trim() || "";
        if (textToRead) {
          if (textToRead.length > 80) {
            textToRead = textToRead.substring(0, 80) + "...";
          }
          speakAnnouncement(`Button: ${textToRead}`);
        }
      }
    };

    window.addEventListener("click", handleGlobalClick, true);
    return () => {
      window.removeEventListener("click", handleGlobalClick, true);
    };
  }, [speakAnnouncement]);

  return { handleReadAloud, speakAnnouncement };
}
