import Link from "next/link";
import { buildChildHref } from "@/lib/navigation/child-href";

type ReviewScreenProps = {
  childId: string;
  childName: string;
  batchSize: number;
  title: string;
};

export function ReviewScreen({
  childId,
  childName,
  batchSize,
  title
}: ReviewScreenProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f4f7ff_0%,_#edf2ff_24%,_#f7f9ff_58%,_#e9edf7_100%)] px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="world-panel world-panel-review relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/80 p-6 shadow-[0_28px_90px_rgba(94,109,148,0.22)] backdrop-blur-sm sm:p-8">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-44 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.92),_rgba(255,255,255,0))] blur-2xl" />
          <div className="pointer-events-none absolute -right-12 top-12 h-40 w-40 rounded-full border border-slate-200/40 bg-[radial-gradient(circle,_rgba(255,255,255,0.8),_rgba(203,213,225,0.2)_58%,_rgba(208,219,245,0))] shadow-[0_0_60px_rgba(203,213,225,0.3)]" />
          <div className="relative flex flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Calm Review Room
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-slate-800 sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  {childName}의 복습실에서 오늘 쌓인 단어를 차분하게 다시 정리합니다.
                </p>
              </div>
              <Link
                className="inline-flex rounded-full border border-slate-300/80 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_10px_30px_rgba(148,163,184,0.18)]"
                href={buildChildHref({ pathname: "/", childId })}
              >
                허브로
              </Link>
            </header>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
              <article className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(233,239,252,0.88))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_18px_50px_rgba(148,163,184,0.16)] sm:p-7">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1">
                    복습실
                  </span>
                  <span>오늘 배치 {batchSize}문제</span>
                </div>
                <p className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-[2.5rem]">
                  차분하게 다시 정리하고
                  <br />
                  틀렸던 단어를 부드럽게 회복해요.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  테스트처럼 빠르게 밀어붙이지 않고, 한 문제씩 다시 떠올리며 기억을 고르게
                  다듬는 시간입니다. 정답보다 복귀의 감각이 먼저 보이도록 화면의 속도와
                  대비를 낮췄습니다.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-white/80 bg-white/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Today
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">{batchSize} words</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">오늘 다시 펼칠 누적 오답</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/80 bg-white/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Pace
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">Slow Recall</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      서두르지 않고 음성과 선택지를 다시 확인
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/80 bg-white/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Mood
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">Moonlight</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      은빛 조용함 속에서 기억을 다시 정렬
                    </p>
                  </div>
                </div>
                <Link
                  className="big-button mt-7 bg-[linear-gradient(180deg,_#18253f,_#243457)] text-white shadow-[0_18px_40px_rgba(36,52,87,0.28),0_0_15px_rgba(203,213,225,0.2)]"
                  href={buildChildHref({ pathname: "/review/session", childId })}
                >
                  복습 시작
                </Link>
              </article>

              <aside className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(233,239,252,0.78),_rgba(247,249,255,0.94))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_40px_rgba(148,163,184,0.14)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Recovery Notes
                </p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                  <p>
                    오답은 실패 기록이 아니라, 다시 만날 단어를 모아 둔 작은 서랍입니다.
                  </p>
                  <p>
                    이번 세션은 시험을 반복하는 시간이 아니라 기억의 모서리를 둥글게
                    만드는 복습실입니다.
                  </p>
                </div>
                <div className="mt-6 rounded-[1.5rem] border border-white/80 bg-white/80 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-500">이번 복습 흐름</p>
                  <ol className="mt-3 space-y-3 text-sm text-slate-700">
                    <li>1. 문제를 다시 보고</li>
                    <li>2. 음성을 천천히 확인하고</li>
                    <li>3. 오늘 배치를 조용히 정리합니다</li>
                  </ol>
                </div>
              </aside>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
