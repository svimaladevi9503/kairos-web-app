import React from "react";
import { Application } from "../types";
import { Link2Off, Copy, Check } from "lucide-react";

interface DecayedApplicationCardProps {
  key?: string;
  app: Application;
  highContrast: boolean;
  copiedAppId: string | null;
  onCopyOutreachText: (text: string, appId: string) => void;
  outreachTemplate: string;
}

export function DecayedApplicationCard({ app, highContrast, copiedAppId, onCopyOutreachText, outreachTemplate }: DecayedApplicationCardProps) {
  return (
    <div
      className={`border rounded-xl p-5 space-y-4 ${
        highContrast ? "bg-lilac-950 border-yellow-400" : "bg-amber-50/20 border-amber-200"
      }`}
    >
      <div className="bg-red-50 dark:bg-zinc-900 border border-red-200 dark:border-yellow-400/50 p-3 rounded-lg flex items-start gap-2.5">
        <Link2Off className="w-4 h-4 text-red-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <span className="block text-xs font-bold text-red-800 dark:text-yellow-400 uppercase">
            Link Decay Alert (n8n Webhook Success)
          </span>
          <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
            The original URL for *{app.job.title}* expired. Alert sent via {app.decayNotificationChannel}.
          </span>
        </div>
      </div>

      <div className={`p-4 rounded-xl border text-sm shadow-inner relative overflow-hidden ${
        app.decayNotificationChannel === "WhatsApp"
          ? "bg-[#efeae2] border-emerald-100 text-slate-800"
          : app.decayNotificationChannel === "Telegram"
          ? "bg-sky-50 border-sky-200 text-slate-800"
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex items-center justify-between mb-2 opacity-60 text-[10px] font-bold uppercase tracking-wider">
          <span>{app.decayNotificationChannel} Notification</span>
          <span>Just now</span>
        </div>

        <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{app.decayMessage}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Recruiter Outreach Draft
          </span>
          <button
            type="button"
            aria-label="Copy Outreach Draft to Clipboard"
            onClick={() => onCopyOutreachText(outreachTemplate, app.id)}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded transition-colors ${
              copiedAppId === app.id
                ? "bg-emerald-600 text-white border border-emerald-600"
                : highContrast
                ? "border border-yellow-400 hover:bg-zinc-900 text-yellow-400"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            }`}
            title="Copy Outreach Draft to Clipboard"
          >
            {copiedAppId === app.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedAppId === app.id ? "Copied" : "Copy Draft"}</span>
          </button>
        </div>
        <label htmlFor={`draft-${app.id}`} className="sr-only">Recruiter Outreach Draft Text</label>
        <textarea
          id={`draft-${app.id}`}
          readOnly
          value={outreachTemplate}
          rows={7}
          aria-label="Recruiter Outreach Draft Text"
          className={`w-full p-3 rounded-lg border font-mono text-xs resize-none select-all ${
            highContrast
              ? "bg-zinc-900 border-yellow-400 text-yellow-400"
              : "bg-white border-slate-200 text-slate-600"
          }`}
        ></textarea>
      </div>
    </div>
  );
}
