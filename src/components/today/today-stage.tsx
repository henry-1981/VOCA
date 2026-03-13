import Link from "next/link";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { DayKind } from "@/lib/types/domain";

type TodayStageProps = {
  childId?: string;
  dayId: string;
  dayKind: DayKind;
  dayTitle: string;
  stage: "not_started" | "learn_completed" | "test_completed" | "completed";
};

export function TodayStage({
  childId,
  dayId,
  dayKind,
  dayTitle,
  stage
}: TodayStageProps) {
  const isCheckpoint = dayKind === "checkpoint_test";
  const learnPrimary = !isCheckpoint && stage === "not_started";
  const testPrimary = !isCheckpoint && stage === "learn_completed";
  const dayComplete = stage === "test_completed" || stage === "completed";
  const statusMessage =
    dayComplete
      ? "오늘의 학습이 완료되었습니다."
      : isCheckpoint
        ? "지금 바로 종합 테스트를 시작하세요."
        : "오늘 단어를 익히고 테스트합니다.";
  const stageLabel =
    stage === "not_started"
      ? "아직 시작 전"
      : stage === "learn_completed"
        ? "Learn 완료"
        : dayComplete
          ? "Day 완료"
          : "진행 중";
  const progressLabels = isCheckpoint
    ? ["준비", "Checkpoint Test", "완료"]
    : ["시작 전", "Learn", "Test", "완료"];

  return (
    <main
      className={`min-h-screen px-6 py-8 ${
        isCheckpoint
          ? "bg-[radial-gradient(circle_at_top,_#dfe3ff,_#f7f8ff_44%,_#eef0ff)]"
          : "bg-[radial-gradient(circle_at_top,_#f2e8ff,_#fff9ef_42%,_#edf4ff)]"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <header
          className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${
            isCheckpoint
              ? "border-indigo-200/60 bg-[linear-gradient(160deg,_rgba(255,255,255,0.96),_rgba(230,235,255,0.92))]"
              : "border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.97),_rgba(251,245,255,0.94))]"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
              isCheckpoint
                ? "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_70%)]"
                : "bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_70%)]"
            }`}
          />
          <div className="relative space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isCheckpoint ? "Checkpoint Today" : "Today"}
              </p>
              <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">{dayTitle}</h1>
              <p className="text-sm font-semibold text-slate-700">{stageLabel}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {progressLabels.map((label, index) => {
                const active =
                  isCheckpoint
                    ? (stage === "not_started" && index === 0) ||
                      (!dayComplete && stage !== "not_started" && index === 1) ||
                      (dayComplete && index === 2)
                    : (stage === "not_started" && index === 0) ||
                      (stage === "learn_completed" && index === 2) ||
                      (dayComplete && index === 3) ||
                      (stage !== "not_started" && !testPrimary && index === 1);

                return (
                  <span
                    key={label}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${
                      active
                        ? isCheckpoint
                          ? "bg-indigo-600 text-white"
                          : "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </header>

        <section
          className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] ${
            isCheckpoint
              ? "bg-[linear-gradient(180deg,_rgba(79,70,229,0.96),_rgba(30,41,59,0.96))]"
              : "bg-[linear-gradient(180deg,_rgba(28,25,41,0.96),_rgba(15,23,42,0.98))]"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
              isCheckpoint
                ? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_72%)]"
                : "bg-[radial-gradient(circle_at_top,_rgba(255,214,111,0.16),_transparent_72%)]"
            }`}
          />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
              {isCheckpoint ? "종합 점검 Day" : "개인 연습실"}
            </p>
            <p className="mt-3 text-3xl font-black sm:text-4xl">{dayTitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/90">
              {statusMessage}
            </p>
          </div>
        </section>

        {!isCheckpoint ? (
          <>
            <Link
              className={`rounded-[1.9rem] border px-6 py-6 text-left shadow-[0_18px_40px_rgba(109,40,217,0.12)] transition ${
                learnPrimary
                  ? "border-violet-500 bg-[linear-gradient(180deg,_rgba(124,58,237,0.96),_rgba(91,33,182,0.96))] text-white"
                  : "border-violet-200 bg-[linear-gradient(180deg,_rgba(245,243,255,0.98),_rgba(237,233,254,0.92))] text-violet-950"
              }`}
              href={buildChildHref({
                pathname: "/today/learn",
                childId,
                params: { day: dayId }
              })}
            >
              <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${learnPrimary ? "text-violet-100" : "text-violet-700"}`}>
                Learn
              </p>
              <p className="mt-3 text-2xl font-black sm:text-3xl">오늘 단어 익히기 시작</p>
              <p className={`mt-3 text-sm leading-6 ${learnPrimary ? "text-violet-100/90" : "text-violet-900/70"}`}>
                단어, 뜻, 발음, 예문을 한 장씩 보고 오늘의 연습실을 먼저 탐험합니다.
              </p>
              <div className="mt-5 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold">
                {learnPrimary ? "먼저 여기서 시작" : "완료됨 · 다시 보기 가능"}
              </div>
            </Link>
            <Link
              className={`rounded-[1.9rem] border px-6 py-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition ${
                testPrimary || dayComplete
                  ? "border-slate-900 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))] text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
              href={buildChildHref({
                pathname: "/test",
                childId,
                params: { day: dayId }
              })}
            >
              <p
                className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                  testPrimary || dayComplete ? "text-slate-300" : "text-slate-400"
                }`}
              >
                Test
              </p>
              <p className="mt-2 text-2xl font-black">
                {testPrimary
                  ? "이제 테스트 시작"
                  : dayComplete
                    ? "오늘 테스트 완료"
                    : "Learn 완료 후 시작"}
              </p>
              <p
                className={`mt-3 text-sm leading-6 ${
                  testPrimary || dayComplete ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {testPrimary
                  ? "준비가 끝났습니다. 지금 바로 문제를 풀어 오늘 Day를 마무리합니다."
                  : dayComplete
                    ? "오늘 테스트를 끝냈습니다. 필요하면 다시 들어가 확인할 수 있습니다."
                    : "먼저 Learn에서 20개 단어를 모두 살펴본 뒤 테스트가 열립니다."}
              </p>
              <div
                className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                  testPrimary || dayComplete ? "bg-white/10" : "bg-slate-100 text-slate-500"
                }`}
              >
                {testPrimary
                  ? "지금 바로 이동"
                  : dayComplete
                    ? "완료됨"
                    : "아직 잠겨 있음"}
              </div>
            </Link>
          </>
        ) : (
          <Link
            className="rounded-[2rem] border border-indigo-500 bg-[linear-gradient(180deg,_rgba(55,48,163,0.98),_rgba(15,23,42,0.98))] px-6 py-7 text-left text-white shadow-[0_22px_55px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5"
            href={buildChildHref({
              pathname: "/test",
              childId,
              params: { day: dayId }
            })}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">
              Checkpoint Test
            </p>
            <p className="mt-3 text-3xl font-black sm:text-4xl">종합 테스트 시작</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/90">
              이 Day는 학습 카드가 아니라 종합 점검용입니다. 지금 해야 할 일은 하나, 바로 테스트를
              시작하는 것입니다.
            </p>
            <div className="mt-5 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white">
              지금 바로 종합 테스트 시작
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
