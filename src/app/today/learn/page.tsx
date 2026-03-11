import { LearnCard } from "@/components/learn/learn-card";
import { resolveDay } from "@/lib/content/resolve-day";

type LearnPageProps = {
  searchParams?: Promise<{
    day?: string;
    index?: string;
  }>;
};

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const params = (await searchParams) ?? {};
  const resolved = resolveDay(params.day);

  if (resolved.kind !== "learning") {
    return null;
  }

  const index = Math.max(0, Number(params.index ?? "0"));
  const word = resolved.day.words[Math.min(index, resolved.day.words.length - 1)];

  return (
    <LearnCard
      currentIndex={index + 1}
      total={resolved.day.words.length}
      topic={resolved.day.topic}
      word={word}
    />
  );
}
