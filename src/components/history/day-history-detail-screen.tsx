import Link from "next/link";
import Image from "next/image";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";
import { buildChildHref } from "@/lib/navigation/child-href";
import { getScreenBackground, getProfileAccent } from "@/lib/theme/profile-themes";

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
  const accent = getProfileAccent(childName);
  const backgroundSrc = getScreenBackground("history", childName);
  const theme = { ...accent, backgroundSrc };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={theme.backgroundSrc}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(40,28,12,0.65)]" />

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content layer */}
      <div className="relative z-10 flex h-[100dvh] flex-col px-4 sm:px-6">
        {/* Header */}
        <header className="shrink-0 pb-4 pt-6 sm:pt-8">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme.labelText}`}>
                Day 기록 열람실
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
                {entry.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
                {childName}의 보관된 Day 기록을 펼쳐 보고, 다시 확인해야 할 단어를 차례대로
                정리합니다.
              </p>
              <p className={`mt-3 text-sm font-semibold ${theme.labelText}`}>{entry.date}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link
                className={`inline-flex rounded-full border ${theme.cardBorder} ${theme.cardBg} px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm`}
                href={buildChildHref({ pathname: "/", childId })}
              >
                홈으로
              </Link>
              <Link
                className={`inline-flex rounded-full border ${theme.cardBorder} ${theme.cardBg} px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm`}
                href={buildChildHref({ pathname: "/history", childId })}
              >
                기록 보관실로 돌아가기
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <section className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto pb-6">
          <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-6 backdrop-blur-sm`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                Archive Summary
              </p>
              <p className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">
                점수 {entry.score} / {entry.total}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">
                틀린 단어 {entry.wrongWordCount}개
              </p>
              <p className="mt-2 text-sm leading-7 text-white/60">
                기록은 점수보다도, 어떤 단어를 다시 펼쳐야 하는지 남기는 데 의미가 있습니다.
              </p>
            </article>

            <aside className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-6 backdrop-blur-sm`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                Record Note
              </p>
              <p className="mt-4 text-sm leading-7 text-white/60">
                Day마다 잘 안 잡혔던 단어를 따로 남겨 다음 복습실로 자연스럽게 이어집니다.
              </p>
            </aside>
          </div>

          <div className="grid gap-3">
            {entry.wrongWords.length ? (
              entry.wrongWords.map((word, index) => (
                <article
                  key={word}
                  className={`flex items-center gap-4 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} px-5 py-4 backdrop-blur-sm`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${theme.cardBorder} bg-white/10 text-sm font-black text-white/80`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.labelText}`}>
                      Review Word
                    </p>
                    <p className={`mt-1 text-xl font-black ${theme.accentText}`}>{word}</p>
                  </div>
                </article>
              ))
            ) : (
              <article className={`rounded-2xl border border-dashed ${theme.cardBorder} ${theme.cardBg} px-6 py-10 text-center backdrop-blur-sm`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                  Clean Record
                </p>
                <p className="mt-4 text-2xl font-black text-white">
                  이 Day는 다시 펼쳐볼 오답이 없습니다.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  깔끔하게 지나간 기록은 그대로 보관하고, 다음 Day로 이어가면 됩니다.
                </p>
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
