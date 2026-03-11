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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#efe7ff,_#fff_45%,_#e7f2ff)] px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">Today</p>
          <h1 className="text-4xl font-black text-slate-950">{dayTitle}</h1>
          <p className="text-sm text-slate-600">
            {stage === "not_started" ? "아직 시작 전" : stage === "learn_completed" ? "Learn 완료" : stage === "test_completed" ? "Test 완료" : "Day 완료"}
          </p>
          <p className="text-sm text-slate-500">
            [ 시작 전 ] → [ Learn ] → [ Test ] → [ 완료 ]
          </p>
        </header>

        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-slate-300">오늘의 Day</p>
          <p className="mt-3 text-3xl font-black">{dayTitle}</p>
          <p className="mt-2 text-sm text-slate-300">
            {isCheckpoint ? "종합 점검 Day입니다." : "오늘 단어를 익히고 테스트합니다."}
          </p>
        </section>

        {!isCheckpoint ? (
          <>
            <Link
              className={`rounded-[1.75rem] px-6 py-6 text-left ${learnPrimary ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-950"}`}
              href={buildChildHref({
                pathname: "/today/learn",
                childId,
                params: { day: dayId }
              })}
            >
              <p className="text-sm font-semibold">LEARN</p>
              <p className="mt-2 text-2xl font-black">오늘 단어 익히기 시작</p>
            </Link>
            <Link
              className={`rounded-[1.75rem] px-6 py-6 text-left ${learnPrimary ? "bg-slate-100 text-slate-500" : "bg-slate-950 text-white"}`}
              href={buildChildHref({
                pathname: "/test",
                childId,
                params: { day: dayId }
              })}
            >
              <p className="text-sm font-semibold">TEST</p>
              <p className="mt-2 text-2xl font-black">
                {stage === "learn_completed" ? "이제 테스트 시작" : "Learn 완료 후 시작"}
              </p>
            </Link>
          </>
        ) : (
          <Link
            className="rounded-[1.75rem] bg-slate-950 px-6 py-6 text-left text-white"
            href={buildChildHref({
              pathname: "/test",
              childId,
              params: { day: dayId }
            })}
          >
            <p className="text-sm font-semibold">CHECKPOINT TEST</p>
            <p className="mt-2 text-2xl font-black">종합 테스트 시작</p>
          </Link>
        )}
      </div>
    </main>
  );
}
