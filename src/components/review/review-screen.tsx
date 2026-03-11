import Link from "next/link";

type ReviewScreenProps = {
  childName: string;
  batchSize: number;
  title: string;
};

export function ReviewScreen({
  childName,
  batchSize,
  title
}: ReviewScreenProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#e8eef9,_#fff_45%,_#f7f9ff)] px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Review</p>
            <h1 className="mt-2 text-4xl font-black">{title}</h1>
          </div>
          <Link className="text-sm font-semibold text-slate-500" href="/">
            홈으로
          </Link>
        </header>

        <section className="rounded-[1.75rem] bg-[linear-gradient(180deg,_#eef2ff,_#f9fbff)] p-6">
          <p className="text-sm font-semibold text-slate-500">{childName}</p>
          <p className="mt-3 text-3xl font-black">오늘 복습 배치 {batchSize}문제</p>
          <p className="mt-2 text-sm text-slate-600">
            누적 오답에서 오늘의 차분한 복습 세션을 시작할 수 있습니다.
          </p>
          <Link className="big-button mt-6 bg-slate-950 text-white" href="/test?day=day-005">
            복습 시작
          </Link>
        </section>
      </div>
    </main>
  );
}
