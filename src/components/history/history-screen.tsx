import Link from "next/link";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";
import { buildChildHref } from "@/lib/navigation/child-href";

type HistoryScreenProps = {
  childId: string;
  childName: string;
  entries: HistoryEntry[];
};

export function HistoryScreen({ childId, childName, entries }: HistoryScreenProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#f4eee2,_#f8f3ea_42%,_#f1e7d7)] px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="world-panel relative overflow-hidden rounded-[2.25rem] border border-[#eadfcd] bg-[linear-gradient(180deg,_rgba(255,252,245,0.94),_rgba(250,246,239,0.98))] p-6 shadow-[0_30px_90px_rgba(96,73,42,0.16)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.86),_transparent_72%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,_transparent,_rgba(163,138,98,0.4),_transparent)]" />
          <div className="relative flex flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6e4b]">
                  Record Archive Room
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#2f2418] sm:text-5xl">
                  {childName}의 Day 기록 보관실
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#6b5a44] sm:text-base">
                  최근 보관된 Day 기록을 날짜 순서대로 펼쳐 보고, 각 Day에서 다시 확인해야
                  하는 단어를 조용한 기록실 분위기 안에서 살펴봅니다.
                </p>
              </div>
              <Link
                className="inline-flex rounded-full border border-[#d6c3a7] bg-white/80 px-4 py-2 text-sm font-semibold text-[#6b5a44] shadow-[0_10px_30px_rgba(96,73,42,0.08)]"
                href={buildChildHref({ pathname: "/", childId })}
              >
                허브로
              </Link>
            </header>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-[1.9rem] border border-[#eadfcd] bg-[linear-gradient(180deg,_rgba(255,254,249,0.9),_rgba(248,241,230,0.94))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                  Recent Archive
                </p>
                <p className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#2f2418]">
                  최근 보관된 Day 기록 {entries.length}권
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6b5a44] sm:text-base">
                  점수 자체보다 어떤 Day를 거쳐 왔는지, 어떤 단어를 다시 펼쳐봐야 하는지가
                  먼저 읽히도록 Day 중심의 기록 흐름을 유지합니다.
                </p>
              </div>

              <aside className="rounded-[1.9rem] border border-[#eadfcd] bg-[#fffaf1] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                  Shelf Note
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#6b5a44]">
                  <p>기록은 단어 통계표가 아니라 Day별 학습 여정의 책장입니다.</p>
                  <p>각 카드에는 날짜, 점수, 다시 펼칠 단어 흔적을 함께 남깁니다.</p>
                </div>
              </aside>
            </section>

            <section className="grid gap-4">
              {entries.length ? (
                entries.map((entry) => {
                  const wrongWordPreview = entry.wrongWords.length
                    ? entry.wrongWords.slice(0, 3).join(", ")
                    : "깨끗하게 통과한 Day 기록";

                  return (
                    <article
                      key={`${entry.dayId}-${entry.date}`}
                      className="rounded-[1.75rem] border border-[#e6d7c1] bg-[linear-gradient(180deg,_#fffdf8,_#fcf7ee)] px-6 py-6 shadow-[0_18px_40px_rgba(96,73,42,0.08)]"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#8b6e4b]">
                            <span>{entry.date}</span>
                            <span className="h-1 w-1 rounded-full bg-[#c9af85]" />
                            <span>{entry.dayId.toUpperCase()}</span>
                          </div>
                          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#2f2418]">
                            {entry.title}
                          </h2>
                          <p className="mt-4 text-sm leading-7 text-[#6b5a44]">
                            틀린 단어 {entry.wrongWordCount}개
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[#6b5a44]">
                            다시 펼쳐볼 단어: {wrongWordPreview}
                          </p>
                        </div>
                        <div className="rounded-[1.3rem] border border-[#d8c4a7] bg-[#fff8eb] px-5 py-4 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7a56]">
                            Score
                          </p>
                          <p className="mt-2 text-2xl font-black text-[#2f2418]">
                            {entry.score} / {entry.total}
                          </p>
                        </div>
                      </div>
                      <Link
                        className="mt-5 inline-flex rounded-full border border-[#d6c3a7] bg-white/85 px-4 py-2 text-sm font-semibold text-[#6b5a44]"
                        href={buildChildHref({
                          pathname: `/history/${entry.dayId}`,
                          childId
                        })}
                      >
                        기록 펼치기
                      </Link>
                    </article>
                  );
                })
              ) : (
                <article className="rounded-[1.75rem] border border-dashed border-[#d6c3a7] bg-[#fffaf1] px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                    Empty Shelf
                  </p>
                  <p className="mt-4 text-2xl font-black text-[#2f2418]">
                    아직 보관된 Day 기록이 없습니다.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#6b5a44]">
                    첫 Day를 마치면 이 기록실 책장에 날짜와 결과가 차분히 쌓이기 시작합니다.
                  </p>
                </article>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
