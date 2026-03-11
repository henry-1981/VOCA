import Link from "next/link";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";

type HistoryScreenProps = {
  childName: string;
  entries: HistoryEntry[];
};

export function HistoryScreen({ childName, entries }: HistoryScreenProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6efe4,_#fff_45%,_#f7f3eb)] px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">History</p>
            <h1 className="mt-2 text-4xl font-black">{childName}의 최근 Day 기록</h1>
          </div>
          <Link className="text-sm font-semibold text-slate-500" href="/">
            홈으로
          </Link>
        </header>

        <section className="grid gap-4">
          {entries.map((entry) => (
            <article
              key={`${entry.dayId}-${entry.date}`}
              className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,_#fffdf8,_#fff)] px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{entry.date}</p>
                  <h2 className="mt-2 text-2xl font-black">{entry.title}</h2>
                </div>
                <p className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                  {entry.score} / {entry.total}
                </p>
              </div>
              <p className="mt-4 text-base text-slate-700">틀린 단어 {entry.wrongWordCount}개</p>
              <Link
                className="mt-4 inline-flex text-sm font-semibold text-slate-600"
                href={`/history/${entry.dayId}`}
              >
                상세 보기
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
