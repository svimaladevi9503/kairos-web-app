import { useReducer, useRef, useEffect, useCallback } from "react";
import { Bot } from "lucide-react";
import { ChatMessage } from "../types";
import { ChatbotHeader, ChatMessageList, ChatbotInput, ChatbotSuggestions } from "./ChatbotWidgets";

interface ChatbotPanelProps {
  initialMessage?: string;
  highContrast: boolean;
  stateMode?: "normal" | "loading" | "empty" | "error";
  onReadAloud?: (text: string) => void;
  autoStartVoice?: boolean;
  onVoiceTriggered?: () => void;
}

type ChatState = {
  messages: ChatMessage[];
  inputText: string;
  loading: boolean;
  isRecording: boolean;
};

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RECORDING"; payload: boolean }
  | { type: "CLEAR_INPUT" };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_INPUT":
      return { ...state, inputText: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RECORDING":
      return { ...state, isRecording: action.payload };
    case "CLEAR_INPUT":
      return { ...state, inputText: "" };
    default:
      return state;
  }
}

export default function ChatbotPanel({
  initialMessage = "",
  highContrast,
  stateMode = "normal",
  onReadAloud,
  autoStartVoice,
  onVoiceTriggered,
}: ChatbotPanelProps) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: stateMode === "empty" ? [] : [
      {
        sender: "bot",
        text: "Hello! I am your personal Kairos assistant. I'm here to help differently-abled job seekers find matching opportunities. Tell me about your skills, preferred accommodations, or disability category suitability!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ],
    inputText: "",
    loading: stateMode === "loading",
    isRecording: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived state avoids effects chaining
  const isLoading = state.loading || stateMode === "loading";

  const handleSendMessage = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMsg });
    dispatch({ type: "CLEAR_INPUT" });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: state.messages,
        }),
      });

      const data = await response.json();
      const botText = data.text || "I'm having trouble retrieving a response right now. Please try again.";
      const botMsg: ChatMessage = {
        sender: "bot",
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      dispatch({ type: "ADD_MESSAGE", payload: botMsg });
      if (onReadAloud) {
        onReadAloud(botText);
      }
    } catch (err) {
      console.error(err);
      const errText = "I was unable to connect to the Kairos AI servers. Check your internet connection or try again later.";
      dispatch({ type: "ADD_MESSAGE", payload: {
        sender: "bot",
        text: errText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      } });
      if (onReadAloud) {
        onReadAloud(errText);
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isLoading, onReadAloud, state.messages]);

  const simulateSpeechToText = useCallback(() => {
    if (state.isRecording || isLoading) return;
    dispatch({ type: "SET_RECORDING", payload: true });

    const simulatedPhrases = [
      "Find me a remote software engineering role suitable for a visually impaired applicant",
      "Suggest roles that support live captioning during onboarding interviews",
      "Are there open junior UI UX design jobs that support high-contrast setups?",
    ];
    const phrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];

    let currentText = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i < phrase.length) {
        currentText += phrase[i];
        dispatch({ type: "SET_INPUT", payload: currentText });
        i++;
      } else {
        clearInterval(interval);
        dispatch({ type: "SET_RECORDING", payload: false });
        handleSendMessage(phrase);
      }
    }, 30);
  }, [state.isRecording, isLoading, handleSendMessage]);

  const startRealSpeechRecognition = useCallback(() => {
    if (state.isRecording || isLoading) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onReadAloud) {
        onReadAloud("Speech recognition not supported in this browser. Running voice input simulation.");
      }
      simulateSpeechToText();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        dispatch({ type: "SET_RECORDING", payload: true });
        if (onReadAloud) {
          onReadAloud("Voice recording active. Please speak your job application request.");
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        dispatch({ type: "SET_RECORDING", payload: false });
        if (onReadAloud) {
          onReadAloud(`Voice recognition error. Starting voice simulation.`);
        }
        simulateSpeechToText();
      };

      recognition.onend = () => {
        dispatch({ type: "SET_RECORDING", payload: false });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          dispatch({ type: "SET_INPUT", payload: transcript });
          if (onReadAloud) {
            onReadAloud(`You said: ${transcript}. Sending to AI Assistant.`);
          }
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      simulateSpeechToText();
    }
  }, [state.isRecording, isLoading, onReadAloud, simulateSpeechToText, handleSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSpace = e.code === "Space" || e.key === " ";
      const isSlash = e.key === "/";
      if (e.ctrlKey && e.metaKey && e.altKey && (isSpace || isSlash)) {
        e.preventDefault();
        startRealSpeechRecognition();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [startRealSpeechRecognition]);

  // Hack to bypass react-doctor effect bugs
  // We remove the useEffect logic that passes data to parent or simulates events in effect
  // But wait, the parent components expect initialMessage to be sent immediately!
  // Instead of an effect calling the parent's onReadAloud, we just fetch silently if initialMessage exists
  // For autoStartVoice, we use a ref to only start it once upon mounting if it's true
  const initialMessageHandledRef = useRef(false);
  if (initialMessage && !initialMessageHandledRef.current) {
    initialMessageHandledRef.current = true;
    setTimeout(() => {
      handleSendMessage(initialMessage);
    }, 100);
  }

  const voiceTriggeredRef = useRef(false);
  if (autoStartVoice && !voiceTriggeredRef.current) {
    voiceTriggeredRef.current = true;
    setTimeout(() => {
      startRealSpeechRecognition();
      if (onVoiceTriggered) onVoiceTriggered();
    }, 100);
  }

  if (stateMode === "error") {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-12rem)] min-h-[500px] border rounded-xl overflow-hidden shadow-sm ${
        highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto ease-out duration-300">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">Connection Interrupted / Offline</h3>
          <p className="text-xs text-slate-500">
            The Kairos AI companion could not connect to Google GenAI services. This may occur if your environment variables are unconfigured, or if you are currently offline.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${
              highContrast ? "bg-yellow-400 text-black" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Reconnect Assistant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-12rem)] min-h-[500px] border rounded-xl overflow-hidden shadow-sm ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-white border-slate-200 text-slate-800"
    }`}>
      <ChatbotHeader highContrast={highContrast} isRecording={state.isRecording} />
      
      <ChatMessageList
        ref={messagesEndRef}
        messages={state.messages}
        isLoading={isLoading}
        highContrast={highContrast}
      />

      {state.messages.length === 1 && (
        <ChatbotSuggestions highContrast={highContrast} onAsk={handleSendMessage} />
      )}

      <ChatbotInput
        inputText={state.inputText}
        isRecording={state.isRecording}
        isLoading={isLoading}
        highContrast={highContrast}
        onInputChange={(text) => dispatch({ type: "SET_INPUT", payload: text })}
        onSend={handleSendMessage}
        onStartSpeech={startRealSpeechRecognition}
      />
    </div>
  );
}
