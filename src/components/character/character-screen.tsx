import Link from "next/link";

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
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#140f2e,_#1c173e_50%,_#0f1225)] px-6 py-8 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[2rem] bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
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
            <div className="flex h-[28rem] w-80 items-center justify-center rounded-[2rem] bg-white/10 text-center text-5xl font-black">
              {childName}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white/70">Level 07</p>
              <p className="mt-2 text-2xl font-black">Level {String(level).padStart(2, "0")}</p>
              <p className="mt-2 text-sm text-white/70">
                XP {xp} / {xpGoal}
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-amber-200/20 bg-[linear-gradient(180deg,_rgba(255,214,111,0.18),_rgba(255,255,255,0.06))] p-5">
              <p className="text-sm font-semibold text-amber-100/80">Streak</p>
              <p className="mt-2 text-2xl font-black">연속 학습 {streak}일</p>
              <p className="mt-2 text-sm text-white/70">{currentDayTitle} 완료 시 유지 가능</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
