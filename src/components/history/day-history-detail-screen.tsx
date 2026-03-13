import Link from "next/link";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";
import { buildChildHref } from "@/lib/navigation/child-href";

type DayHistoryDetailScreenProps = {
  childId: string;
  childName: string;
  entry: HistoryEntry;
};

export function DayHistoryDetailScreen({
  childId,
  childName,
  entry
}: DayHistoryDetailScreenProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#f4eee2,_#f8f3ea_42%,_#f1e7d7)] px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="world-panel relative overflow-hidden rounded-[2.25rem] border border-[#eadfcd] bg-[linear-gradient(180deg,_rgba(255,252,245,0.95),_rgba(250,246,239,0.98))] p-6 shadow-[0_30px_90px_rgba(96,73,42,0.16)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.86),_transparent_72%)]" />
          <div className="relative flex flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6e4b]">
                  Day 기록 열람실
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#2f2418] sm:text-5xl">
                  {entry.title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#6b5a44] sm:text-base">
                  {childName}의 보관된 Day 기록을 펼쳐 보고, 다시 확인해야 할 단어를 차례대로
                  정리합니다.
                </p>
                <p className="mt-3 text-sm font-semibold text-[#8b6e4b]">{entry.date}</p>
              </div>
              <Link
                className="inline-flex rounded-full border border-[#d6c3a7] bg-white/85 px-4 py-2 text-sm font-semibold text-[#6b5a44]"
                href={buildChildHref({ pathname: "/history", childId })}
              >
                기록 보관실로 돌아가기
              </Link>
            </header>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <article className="rounded-[1.8rem] border border-[#eadfcd] bg-[linear-gradient(180deg,_#fffdf8,_#fcf7ee)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                  Archive Summary
                </p>
                <p className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#2f2418]">
                  점수 {entry.score} / {entry.total}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6b5a44]">
                  틀린 단어 {entry.wrongWordCount}개
                </p>
                <p className="mt-2 text-sm leading-7 text-[#6b5a44]">
                  기록은 점수보다도, 어떤 단어를 다시 펼쳐야 하는지 남기는 데 의미가 있습니다.
                </p>
              </article>

              <aside className="rounded-[1.8rem] border border-[#eadfcd] bg-[#fff8eb] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                  Record Note
                </p>
                <p className="mt-4 text-sm leading-7 text-[#6b5a44]">
                  Day마다 잘 안 잡혔던 단어를 따로 남겨 다음 복습실로 자연스럽게 이어집니다.
                </p>
              </aside>
            </section>

            <section className="grid gap-3">
              {entry.wrongWords.length ? (
                entry.wrongWords.map((word, index) => (
                  <article
                    key={word}
                    className="flex items-center gap-4 rounded-[1.4rem] border border-[#e6d7c1] bg-[#fffaf1] px-5 py-4 shadow-[0_14px_30px_rgba(96,73,42,0.06)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d6c3a7] bg-white text-sm font-black text-[#8b6e4b]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7a56]">
                        Review Word
                      </p>
                      <p className="mt-1 text-xl font-black text-[#2f2418]">{word}</p>
                    </div>
                  </article>
                ))
              ) : (
                <article className="rounded-[1.6rem] border border-dashed border-[#d6c3a7] bg-[#fffaf1] px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7a56]">
                    Clean Record
                  </p>
                  <p className="mt-4 text-2xl font-black text-[#2f2418]">
                    이 Day는 다시 펼쳐볼 오답이 없습니다.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#6b5a44]">
                    깔끔하게 지나간 기록은 그대로 보관하고, 다음 Day로 이어가면 됩니다.
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
