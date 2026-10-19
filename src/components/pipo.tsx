import { useId } from "react";
import { cn } from "@/lib/utils";

export type Humor = "feliz" | "uau" | "triste";

// Pipo, o mascote: um alienzinho de um olho só que guia a criança pela galáxia
export function Pipo({ humor = "feliz", className }: { humor?: Humor; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 124" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <radialGradient id={`${id}-corpo`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#d9f99d" />
          <stop offset="55%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#3f8f1a" />
        </radialGradient>
      </defs>

      {/* antena */}
      <path d="M60 30 Q58 18 64 9" stroke="#4d7c0f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="64" cy="8" r="6" fill="#fbbf24" className="animate-pulsar origin-[64px_8px]" />

      {/* pezinhos */}
      <ellipse cx="42" cy="112" rx="11" ry="7" fill="#4d7c0f" />
      <ellipse cx="78" cy="112" rx="11" ry="7" fill="#4d7c0f" />

      {/* corpo */}
      <circle cx="60" cy="68" r="44" fill={`url(#${id}-corpo)`} />
      <circle cx="36" cy="92" r="4" fill="#ecfccb" opacity="0.5" />
      <circle cx="88" cy="48" r="3" fill="#ecfccb" opacity="0.5" />
      <circle cx="82" cy="96" r="5" fill="#ecfccb" opacity="0.35" />

      {/* olho */}
      <g className="pipo-olho">
        <circle cx="60" cy="58" r="19" fill="white" />
        {humor === "triste" ? (
          <circle cx="60" cy="63" r="9" fill="#1e1b4b" />
        ) : (
          <circle cx="62" cy="59" r={humor === "uau" ? 11 : 9} fill="#1e1b4b" />
        )}
        <circle cx="66" cy="54" r="3.5" fill="white" />
      </g>

      {/* bochechas */}
      <ellipse cx="32" cy="78" rx="7" ry="4.5" fill="#f472b6" opacity="0.55" />
      <ellipse cx="88" cy="78" rx="7" ry="4.5" fill="#f472b6" opacity="0.55" />

      {/* boca */}
      {humor === "feliz" && <path d="M47 86 Q60 99 73 86" stroke="#1e1b4b" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {humor === "uau" && <ellipse cx="60" cy="91" rx="7" ry="8" fill="#1e1b4b" />}
      {humor === "triste" && <path d="M49 94 Q60 86 71 94" stroke="#1e1b4b" strokeWidth="4" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
