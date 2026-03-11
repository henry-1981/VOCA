import Link from "next/link";

type MainHubProps = {
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
};

export function MainHub({
  childName,
  level,
  streak,
  currentDayTitle,
  previewMode
}: MainHubProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#2e235c,_#120f28_50%,_#0d1020)] px-6 py-8 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-200/90">
              {previewMode ? "Preview Mode" : "Family Hub"}
            </p>
            <h1 className="mt-2 text-4xl font-black">{childName}</h1>
            <p className="mt-2 text-sm text-white/70">Level {level} · 연속 학습 {streak}일</p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100">
            Magic Academy
          </div>
        </header>

        <section className="relative min-h-[72vh] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(99,67,189,0.35),_rgba(13,16,32,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,230,170,0.28),_transparent_60%)]" />

          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
            <Link
              className="w-full max-w-md rounded-[1.75rem] border border-amber-200/30 bg-[linear-gradient(180deg,_rgba(255,214,111,0.95),_rgba(212,157,34,0.95))] px-6 py-6 text-center text-slate-950 shadow-[0_20px_50px_rgba(255,193,7,0.25)]"
              href={`/today?day=${currentDayTitle.includes("05") ? "day-005" : "day-001"}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Today</p>
              <p className="mt-2 text-3xl font-black">{currentDayTitle}</p>
            </Link>

            <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
              <Link
                className="rounded-[1.5rem] border border-white/10 bg-white/10 px-6 py-5 backdrop-blur"
                href="/review"
              >
                <p className="text-sm font-semibold text-white/70">Review</p>
                <p className="mt-2 text-2xl font-black">누적 오답 복습</p>
              </Link>
              <Link
                className="rounded-[1.5rem] border border-white/10 bg-white/10 px-6 py-5 backdrop-blur"
                href="/history"
              >
                <p className="text-sm font-semibold text-white/70">History</p>
                <p className="mt-2 text-2xl font-black">최근 Day 기록</p>
              </Link>
            </div>

            <div className="mt-6 flex min-h-72 w-full max-w-2xl items-end justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_rgba(255,255,255,0.03)_60%,_transparent)] px-8 pb-6 pt-10">
              <div className="flex h-80 w-72 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 text-center text-3xl font-black backdrop-blur">
                {childName}
              </div>
            </div>

            <Link
              className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-white/10 px-6 py-5 text-center backdrop-blur"
              href="/character"
            >
              <p className="text-sm font-semibold text-white/70">Character</p>
              <p className="mt-2 text-2xl font-black">XP / Level / 성장</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
