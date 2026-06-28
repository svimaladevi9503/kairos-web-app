import React from "react";

interface KairosLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  highContrast?: boolean;
  themeMode?: "light" | "dark";
}

export default function KairosLogo({
  className = "",
  size = "md",
  highContrast = false,
  themeMode = "light",
}: KairosLogoProps) {
  // Determine colors based on high contrast or theme
  const K_Color = highContrast ? "#FFFF00" : "#C8A2C8"; // Lilac or Yellow
  const TextColor = highContrast ? "#FFFF00" : themeMode === "dark" ? "#E4E4E7" : "#2E2E2E";
  const SubtextColor = highContrast ? "#FFFF00" : themeMode === "dark" ? "#A1A1AA" : "#555555";
  
  // Cutout outlines drawn in background color to match the image's logo style
  const CutoutColor = highContrast ? "#331d4e" : themeMode === "dark" ? "#331d4e" : "#f8f6fc";

  // Sizes
  const dimensions = {
    sm: { scale: 0.45, textClass: "text-base tracking-tight", subtextClass: "text-[6px] tracking-widest mt-0.5" },
    md: { scale: 0.75, textClass: "text-xl tracking-tight", subtextClass: "text-[9px] tracking-widest mt-1" },
    lg: { scale: 1.4, textClass: "text-4xl tracking-tighter", subtextClass: "text-[12px] tracking-widest mt-1.5" },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem representing the human-centric "K" with visual, audio, and speech icons */}
      <svg
        width={50 * dimensions.scale}
        height={50 * dimensions.scale}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        {/* Main curved K Shape styled from the reference image */}
        <path
          d="M15 12C15 9.8 16.8 8 19 8H35C37.2 8 39 9.8 39 12V43L68.8 11.2C70.4 9.8 72.8 9.8 74.4 11.2L81.2 17.6C82.8 19.1 82.9 21.5 81.4 23.1L49 55L82.2 88.9C83.7 90.5 83.5 93 81.8 94.4L73.4 100.2C71.8 101.3 69.6 101 68.2 99.6L39 65V88C39 90.2 37.2 92 35 92H19C16.8 92 15 90.2 15 88V12Z"
          fill={K_Color}
        />

        {/* Eye Outline cutout inside K */}
        <path
          d="M38 31C42 25 50 25 54 31M38 31C42 37 50 37 54 31M45 31C45 32.1 45.9 33 47 33C48.1 33 49 32.1 49 31C49 29.9 48.1 29 47 29C45.9 29 45 29.9 45 31Z"
          stroke={CutoutColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ear Outline cutout inside K */}
        <path
          d="M39 44C43 44 46 47 46 51C46 55 43 56 41 57C39 58 41 61 43 59"
          stroke={CutoutColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Speech/Mouth/Voice Wave cutout inside K */}
        <path
          d="M39 66C43 67 47 63 51 67C55 71 59 65 63 66"
          stroke={CutoutColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col text-left justify-center">
        <span
          className={`font-black text-slate-800 leading-none ${dimensions.textClass}`}
          style={{ color: TextColor }}
        >
          Kairos
        </span>
        <span
          className={`uppercase font-extrabold text-slate-500 leading-none ${dimensions.subtextClass}`}
          style={{ color: SubtextColor }}
        >
          Inclusive Job Portal
        </span>
      </div>
    </div>
  );
}
