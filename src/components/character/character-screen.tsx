import Link from "next/link";
import { getRewardPreview } from "@/lib/character/reward-preview";

type CharacterScreenProps = {
  childName: string;
  level: number;
  xp: number;
  xpGoal: number;
  streak: number;
  currentDayTitle: string;
};

export function CharacterScreen({
  childName,
  level,
  xp,
  xpGoal,
  streak,
  currentDayTitle
}: CharacterScreenProps) {
  const preview = getRewardPreview({
    currentDayTitle,
    streak,
    reviewBonusXp: 50
  });

  const xpPercent = xpGoal > 0 ? Math.min((xp / xpGoal) * 100, 100) : 0;
  const initial = childName.charAt(0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#140f2e,_#1c173e_50%,_#0f1225)] px-6 py-8 text-white">
      {/* Ambient magic aura overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(128,90,255,0.08),_transparent_60%)]" />

      {/* Floating sparkle particles */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-violet-200/50 shadow-[0_0_12px_rgba(196,181,253,0.6)]" style={{ animationDelay: "0s" }} />
      <div className="pointer-events-none absolute right-[20%] top-[15%] h-1.5 w-1.5 animate-pulse rounded-full bg-amber-100/50 shadow-[0_0_10px_rgba(255,236,179,0.6)]" style={{ animationDelay: "0.4s" }} />
      <div className="pointer-events-none absolute left-[30%] top-[60%] h-2.5 w-2.5 animate-pulse rounded-full bg-sky-100/40 shadow-[0_0_14px_rgba(186,230,253,0.5)]" style={{ animationDelay: "0.8s" }} />
      <div className="pointer-events-none absolute right-[35%] top-[45%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-100/40 shadow-[0_0_10px_rgba(221,214,254,0.5)]" style={{ animationDelay: "1.2s" }} />
      <div className="pointer-events-none absolute left-[70%] top-[70%] h-2 w-2 animate-pulse rounded-full bg-amber-200/40 shadow-[0_0_12px_rgba(253,230,138,0.5)]" style={{ animationDelay: "1.6s" }} />
      <div className="pointer-events-none absolute right-[10%] top-[80%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-200/30 shadow-[0_0_10px_rgba(196,181,253,0.4)]" style={{ animationDelay: "2.0s" }} />

      <div className="relative mx-auto flex max-w-4xl flex-col gap-5 rounded-[2rem] bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        {/* Bookshelf silhouette decoration */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-[0.04]" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 62px), linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }} />

        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white/60">Character</p>
            <h1 className="mt-2 text-4xl font-black">{childName}의 연구실</h1>
          </div>
          <Link className="text-sm font-semibold text-white/60" href="/">
            홈으로
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_rgba(255,255,255,0.04)_60%,_transparent)]">
            {/* Avatar with magic aura */}
            <div className="relative flex h-[28rem] w-80 flex-col items-center justify-center rounded-[2rem] bg-white/10 text-center">
              {/* Magic aura glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15),_rgba(128,90,255,0.08)_40%,_transparent_70%)]" />
              {/* Avatar circle */}
              <div className="animate-glow-pulse relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-violet-300/30 bg-[radial-gradient(circle,_rgba(168,85,247,0.3),_rgba(88,28,135,0.5))] shadow-[0_0_40px_rgba(168,85,247,0.25)]">
                <span className="text-5xl font-black text-white" data-testid="avatar-initial">{initial}</span>
              </div>
              <p className="relative mt-6 text-5xl font-black">{childName}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="animate-glow-pulse rounded-[1.5rem] border border-white/10 bg-white/10 p-5 transition-transform hover:-translate-y-0.5" data-testid="level-card">
              <p className="text-sm font-semibold text-white/70">Level 07</p>
              <p className="mt-2 text-2xl font-black">Level {String(level).padStart(2, "0")}</p>
              <p className="mt-2 text-sm text-white/70">
                XP {xp} / {xpGoal}
              </p>
              {/* XP progress bar */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_#a78bfa,_#c084fc)] transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                  data-testid="xp-bar"
                />
              </div>
            </section>

            <section className="animate-glow-pulse rounded-[1.5rem] border border-amber-200/20 bg-[linear-gradient(180deg,_rgba(255,214,111,0.18),_rgba(255,255,255,0.06))] p-5 transition-transform hover:-translate-y-0.5" data-testid="streak-card">
              <p className="text-sm font-semibold text-amber-100/80">Streak</p>
              <p className="mt-2 text-2xl font-black">연속 학습 {streak}일</p>
              <p className="mt-2 text-sm text-white/70">{preview.streakMessage}</p>
              <p className="mt-2 text-sm text-amber-100/90">{preview.rewardMessage}</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
