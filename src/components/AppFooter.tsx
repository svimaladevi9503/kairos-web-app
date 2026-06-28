import React from "react";

export function AppFooter({ highContrast }: { highContrast: boolean }) {
  return (
    <footer className={`border-t py-6 mt-12 text-center text-xs font-semibold ${
      highContrast ? "bg-lilac-950 border-yellow-400 text-yellow-400" : "bg-slate-100 border-slate-200 text-slate-500"
    }`}>
      <p>© 2026 Kairos Inclusive Job Portal • Empowering Differently-Abled Professionals</p>
      <p className="mt-1 opacity-70">Strict accessibility compliance for Atkinson Hyperlegible pairings, screen readers, and low-vision assistance.</p>
    </footer>
  );
}
