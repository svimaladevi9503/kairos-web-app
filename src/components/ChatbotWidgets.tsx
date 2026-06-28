import React from "react";
import { Bot, User, Sparkles, Mic, HelpCircle, Loader2, Send } from "lucide-react";
import { ChatMessage } from "../types";

const suggestedQuestions = [
  "Recommend software roles with screen-reader tooling.",
  "Are there fully remote CS jobs with text-only standups?",
  "What policies do companies offer for ASL translation support?",
];

export function ChatbotHeader({ highContrast, isRecording }: { highContrast: boolean; isRecording: boolean }) {
  return (
    <>
      <div className={`p-4 border-b flex items-center justify-between ${
        highContrast ? "bg-lilac-900 border-yellow-400" : "bg-slate-50 border-slate-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${highContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-700"}`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base leading-tight">Kairos AI Companion</h3>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-yellow-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Assistant Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold opacity-80">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span>Powered by Gemini 3.5 Flash</span>
        </div>
      </div>

      <div className={`px-4 py-2 border-b flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-bold ${
        highContrast ? "bg-lilac-900 border-yellow-400 text-yellow-400" : "bg-blue-50/50 border-slate-100 text-slate-700"
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${highContrast ? "bg-yellow-400 text-black" : "bg-blue-600 text-white"}`}>
            Voice System
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            🇮🇳 en-IN Indian English Enabled
          </span>
          <span className="opacity-40">|</span>
          <span className="text-[10px] opacity-90">
            Voice Record: <kbd className="bg-slate-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px] font-mono">Ctrl+Win+Alt+Space</kbd> or <kbd className="bg-slate-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px] font-mono">/</kbd>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-90">
            Read Aloud: <kbd className="bg-slate-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px] font-mono">Ctrl+Alt+/</kbd>
          </span>
          {isRecording && (
            <div className="flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-[10px] text-red-600 uppercase font-extrabold">Recording...</span>
              <div className="flex items-end gap-[2.5px] h-3 ml-1">
                <span className="w-[2px] bg-red-600 rounded" style={{ height: "40%" }} />
                <span className="w-[2px] bg-red-600 rounded" style={{ height: "80%" }} />
                <span className="w-[2px] bg-red-600 rounded" style={{ height: "100%" }} />
                <span className="w-[2px] bg-red-600 rounded" style={{ height: "60%" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ChatMessageList({ messages, isLoading, highContrast, ref }: { messages: ChatMessage[]; isLoading: boolean; highContrast: boolean; ref?: React.RefObject<HTMLDivElement | null>; }) {
  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
      highContrast ? "bg-lilac-950" : "bg-slate-50/30"
    }`}>
      {messages.map((msg, index) => {
        const isBot = msg.sender === "bot";
        const msgId = msg.timestamp + msg.text.substring(0, 10) + index;
        return (
          <div
            key={msgId}
            className={`flex items-start gap-3 max-w-[85%] ${
              isBot ? "self-start" : "self-end ml-auto flex-row-reverse"
            }`}
          >
            <div className={`p-1.5 rounded-full shrink-0 ${
              isBot
                ? highContrast
                  ? "bg-yellow-400 text-black"
                  : "bg-blue-100 text-blue-700"
                : highContrast
                ? "bg-zinc-900 border border-yellow-400 text-yellow-400"
                : "bg-blue-600 text-white"
            }`}>
              {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div>
              <div className={`rounded-2xl px-4 py-3 border shadow-sm ${
                isBot
                  ? highContrast
                    ? "bg-lilac-900 border-yellow-400 text-yellow-400 rounded-tl-none"
                    : "bg-white border-slate-200 text-slate-800 rounded-tl-none"
                  : highContrast
                  ? "bg-lilac-950 border-yellow-400 text-yellow-400 rounded-tr-none"
                  : "bg-blue-600 border-blue-700 text-white rounded-tr-none"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
              <span className={`text-[10px] block mt-1 px-1 font-semibold ${isBot ? "text-slate-400" : "text-slate-500 text-right"}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className={`p-1.5 rounded-full shrink-0 ${highContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-700"}`}>
            <Bot className="w-4 h-4 animate-spin" />
          </div>
          <div className={`rounded-2xl px-4 py-3 border rounded-tl-none flex items-center gap-2 ${
            highContrast ? "bg-zinc-950 border-yellow-400 text-yellow-400" : "bg-white border-slate-200 text-slate-500"
          }`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-semibold">Kairos is thinking...</span>
          </div>
        </div>
      )}

      <div ref={ref} />
    </div>
  );
}

export function ChatbotInput({
  inputText,
  isRecording,
  isLoading,
  highContrast,
  onInputChange,
  onSend,
  onStartSpeech,
}: {
  inputText: string;
  isRecording: boolean;
  isLoading: boolean;
  highContrast: boolean;
  onInputChange: (text: string) => void;
  onSend: (text: string) => void;
  onStartSpeech: () => void;
}) {
  return (
    <div className={`p-4 border-t ${highContrast ? "border-yellow-400 bg-lilac-950" : "border-slate-200 bg-white"}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(inputText);
        }}
        className="flex gap-2 items-center"
      >
        <button
          type="button"
          onClick={onStartSpeech}
          aria-label="Voice Input"
          className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
            isRecording
              ? "bg-red-100 border-red-300 text-red-600 animate-pulse"
              : highContrast
              ? "border-yellow-400 hover:bg-lilac-900 text-yellow-400"
              : "border-slate-200 hover:bg-slate-100 text-slate-500"
          }`}
          title="Voice Input (Press Ctrl + Win + Alt + Space or / to speak)"
        >
          <Mic className={`w-4 h-4 ${isRecording ? "scale-110 animate-ping text-red-600" : ""}`} />
        </button>

        <label htmlFor="chatInput" className="sr-only">Press Ctrl+Win+Alt+Space or / to speak...</label>
        <input
          id="chatInput"
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isRecording}
          placeholder={isRecording ? "Listening to your voice..." : "Press Ctrl+Win+Alt+Space or / to speak..."}
          className={`flex-grow px-4 py-3 text-sm rounded-xl border focus:ring-2 focus:outline-none ${
            highContrast
              ? "bg-lilac-950 border-yellow-400 focus:ring-yellow-400 text-yellow-400 placeholder:text-yellow-400/50"
              : "bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
          }`}
        />

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
            highContrast
              ? "bg-yellow-400 text-black disabled:opacity-50"
              : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-100 disabled:text-slate-400"
          }`}
          title="Send Message"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export function ChatbotSuggestions({ highContrast, onAsk }: { highContrast: boolean; onAsk: (q: string) => void }) {
  return (
    <div className={`px-4 py-2 border-t ${highContrast ? "border-yellow-400" : "border-slate-100 bg-slate-50/50"}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Suggested Inquiries (Click to Ask)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onAsk(q)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
              highContrast
                ? "border-yellow-400 hover:bg-lilac-900"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
