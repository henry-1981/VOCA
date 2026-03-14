import Link from "next/link";
import Image from "next/image";
import { getRewardPreview } from "@/lib/character/reward-preview";

const AVATAR_MAP: Record<string, string> = {
  "다온": "/avatars/daon-nobg.png",
  "지온": "/avatars/jion-nobg.png",
};

type CharacterTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  auraColor: string;
};

const CHARACTER_THEMES: Record<string, CharacterTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/character-lab-warm.png",
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/30",
    auraColor: "rgba(255,200,80,0.15)",
  },
  "지온": {
    backgroundSrc: "/backgrounds/character-lab-cool.png",
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/30",
    auraColor: "rgba(56,189,248,0.15)",
  },
};
const DEFAULT_THEME = CHARACTER_THEMES["다온"];

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
  const avatarSrc = AVATAR_MAP[childName] ?? AVATAR_MAP["다온"];
  const levelTitle = level >= 10 ? "Archmage" : level >= 5 ? "Apprentice Mage" : "Student Mage";
  const theme = CHARACTER_THEMES[childName] ?? DEFAULT_THEME;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden text-white">
      {/* Background image */}
      <Image
        src={theme.backgroundSrc}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Dark violet overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: "rgba(20,15,46,0.55)" }} />

      {/* Top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#140f2e]/80 to-transparent" />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1225]/80 to-transparent" />

      {/* Floating sparkle particles */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-violet-200/50 shadow-[0_0_12px_rgba(196,181,253,0.6)]" style={{ animationDelay: "0s" }} />
      <div className="pointer-events-none absolute right-[20%] top-[15%] h-1.5 w-1.5 animate-pulse rounded-full bg-amber-100/50 shadow-[0_0_10px_rgba(255,236,179,0.6)]" style={{ animationDelay: "0.4s" }} />
      <div className="pointer-events-none absolute left-[30%] top-[60%] h-2.5 w-2.5 animate-pulse rounded-full bg-sky-100/40 shadow-[0_0_14px_rgba(186,230,253,0.5)]" style={{ animationDelay: "0.8s" }} />
      <div className="pointer-events-none absolute right-[35%] top-[45%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-100/40 shadow-[0_0_10px_rgba(221,214,254,0.5)]" style={{ animationDelay: "1.2s" }} />
      <div className="pointer-events-none absolute left-[70%] top-[70%] h-2 w-2 animate-pulse rounded-full bg-amber-200/40 shadow-[0_0_12px_rgba(253,230,138,0.5)]" style={{ animationDelay: "1.6s" }} />
      <div className="pointer-events-none absolute right-[10%] top-[80%] h-1.5 w-1.5 animate-pulse rounded-full bg-violet-200/30 shadow-[0_0_10px_rgba(196,181,253,0.4)]" style={{ animationDelay: "2.0s" }} />

      {/* Content layer */}
      <div className="relative z-10 flex h-[100dvh] flex-col px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-1 flex-col gap-5 rounded-[2rem] bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
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
            <div className={`flex min-h-[32rem] items-center justify-center rounded-[2rem] border ${theme.cardBorder} bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_rgba(255,255,255,0.04)_60%,_transparent)]`}>
              {/* Avatar with magic aura */}
              <div className={`relative flex h-[28rem] w-80 flex-col items-center justify-center rounded-[2rem] ${theme.cardBg} text-center`} data-testid="avatar-card">
                {/* Magic aura glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[2rem]" style={{ background: `radial-gradient(circle at center, ${theme.auraColor}, rgba(128,90,255,0.08) 40%, transparent 70%)` }} />
                {/* Level title */}
                <p className="relative text-sm font-semibold tracking-widest text-violet-300/80 uppercase">{levelTitle}</p>
                {/* Avatar image */}
                <div className="animate-glow-pulse relative mt-3 flex h-48 w-48 items-center justify-center rounded-full shadow-[0_0_60px_rgba(168,85,247,0.3)]">
                  <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-violet-300/30 bg-[radial-gradient(circle,_rgba(168,85,247,0.2),_rgba(88,28,135,0.3))]" />
                  <Image
                    src={avatarSrc}
                    alt={`${childName} avatar`}
                    width={180}
                    height={180}
                    className="relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    priority
                  />
                </div>
                <p className="relative mt-5 text-4xl font-black">{childName}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <section className={`animate-glow-pulse rounded-[1.5rem] border ${theme.cardBorder} ${theme.cardBg} p-5 transition-transform hover:-translate-y-0.5`} data-testid="level-card">
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

              <section className={`animate-glow-pulse rounded-[1.5rem] border ${theme.cardBorder} bg-[linear-gradient(180deg,_rgba(255,214,111,0.18),_rgba(255,255,255,0.06))] p-5 transition-transform hover:-translate-y-0.5`} data-testid="streak-card">
                <p className="text-sm font-semibold text-amber-100/80">Streak</p>
                <p className="mt-2 text-2xl font-black">연속 학습 {streak}일</p>
                <p className="mt-2 text-sm text-white/70">{preview.streakMessage}</p>
                <p className="mt-2 text-sm text-amber-100/90">{preview.rewardMessage}</p>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
