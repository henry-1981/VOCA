"use client";

import { useEffect, useRef } from "react";

type DayCompleteCelebrationProps = {
  dayTitle: string;
  totalXp: number;
  onClose: () => void;
};

const CONFETTI_SYMBOLS = ["✦", "★", "◆", "●"];

export function DayCompleteCelebration({
  dayTitle,
  totalXp,
  onClose
}: DayCompleteCelebrationProps) {
  const closedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  function handleClose() {
    if (!closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  }

  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    symbol: CONFETTI_SYMBOLS[i % CONFETTI_SYMBOLS.length],
    left: `${(i * 5) % 100}%`,
    delay: `${(i * 0.07).toFixed(2)}s`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0" data-testid="confetti-container">
        {confettiParticles.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 text-2xl text-amber-300 animate-confetti-fall"
            style={{ left: p.left, animationDelay: p.delay }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Center card */}
      <div className="relative z-10 flex flex-col items-center gap-4 rounded-3xl border border-amber-200/30 bg-[linear-gradient(180deg,_rgba(20,24,49,0.95),_rgba(40,28,80,0.92))] px-10 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <h1
          className="text-4xl font-black text-amber-300 animate-scale-bounce sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {dayTitle} 완료!
        </h1>
        <p className="text-2xl font-bold text-amber-100">+{totalXp} XP</p>
        <button
          className="mt-2 rounded-full bg-amber-400 px-8 py-3 text-lg font-bold text-slate-900 shadow-[0_10px_30px_rgba(251,191,36,0.3)] transition hover:bg-amber-300"
          onClick={handleClose}
          type="button"
        >
          계속하기
        </button>
      </div>
    </div>
  );
}
