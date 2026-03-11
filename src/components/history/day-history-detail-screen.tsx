import Link from "next/link";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";

type DayHistoryDetailScreenProps = {
  childName: string;
  entry: HistoryEntry;
};

export function DayHistoryDetailScreen({
  childName,
  entry
}: DayHistoryDetailScreenProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6efe4,_#fff_45%,_#f7f3eb)] px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">{childName}의 기록</p>
            <h1 className="mt-2 text-4xl font-black">{entry.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{entry.date}</p>
          </div>
          <Link className="text-sm font-semibold text-slate-500" href="/history">
            목록으로
          </Link>
        </header>

        <section className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,_#fffdf8,_#fff)] p-6">
          <p className="text-lg font-bold">점수 {entry.score} / {entry.total}</p>
          <p className="mt-2 text-sm text-slate-600">틀린 단어 {entry.wrongWordCount}개</p>
        </section>

        <section className="grid gap-3">
          {entry.wrongWords.map((word) => (
            <article
              key={word}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4 text-lg font-bold"
            >
              {word}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
