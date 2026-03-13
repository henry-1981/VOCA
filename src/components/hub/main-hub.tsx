import Link from "next/link";
import { buildChildHref } from "@/lib/navigation/child-href";

type MainHubProps = {
  childId: string;
  currentDayId: string;
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
};

export function MainHub({
  childId,
  currentDayId,
  childName,
  level,
  streak,
  currentDayTitle,
  previewMode
}: MainHubProps) {
  const supportCards = [
    {
      label: "Review",
      title: "누적 오답 복습",
      description: "조용한 복습실에서 다시 도전합니다.",
      href: buildChildHref({ pathname: "/review", childId }),
      accent:
        "from-sky-200/40 via-slate-200/10 to-white/5 ring-sky-100/20 text-sky-50"
    },
    {
      label: "History",
      title: "최근 Day 기록",
      description: "완료한 Day와 실수한 단어를 돌아봅니다.",
      href: buildChildHref({ pathname: "/history", childId }),
      accent:
        "from-amber-200/30 via-orange-100/10 to-white/5 ring-amber-100/20 text-amber-50"
    }
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#3b2d73,_#19142f_44%,_#090d18_78%)] px-5 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(20,24,49,0.92),_rgba(40,28,80,0.84))] px-5 py-5 shadow-[0_25px_80px_rgba(5,8,20,0.5)] sm:px-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,224,145,0.22),_transparent_32%),radial-gradient(circle_at_top_left,_rgba(166,136,255,0.16),_transparent_35%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/90">
              {previewMode ? "Preview Mode" : "Family Hub"}
            </p>
              <h1
                className="mt-3 text-4xl font-semibold tracking-[0.02em] text-white sm:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {childName}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
                오늘의 마법학교 탐험은 <span className="font-semibold text-amber-100">{currentDayTitle}</span>에서
                시작합니다. 연속 학습을 이어서 주인공의 레벨을 올려 주세요.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5">
                  Level {level}
                </span>
                <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1.5 text-amber-50">
                  연속 학습 {streak}일
                </span>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_10px_30px_rgba(255,214,111,0.12)] backdrop-blur">
              Magic Academy
            </div>
          </div>
        </header>

        <section className="relative min-h-[74vh] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(57,42,115,0.42),_rgba(11,14,27,0.93))] p-5 shadow-[0_35px_120px_rgba(0,0,0,0.4)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,230,170,0.3),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-x-8 top-16 h-56 rounded-full bg-[radial-gradient(circle,_rgba(128,122,255,0.12),_transparent_66%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,_transparent,_rgba(7,10,19,0.92))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <div className="h-28 w-[78%] rounded-[100%] bg-[radial-gradient(circle,_rgba(97,119,255,0.18),_rgba(8,10,18,0.02)_60%,_transparent_70%)] blur-2xl" />
          </div>
          <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/30">
            <span>North Tower</span>
            <span>Front Gate</span>
            <span>Moon Hall</span>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
            <Link
              className="group relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-amber-100/35 bg-[linear-gradient(180deg,_rgba(255,228,154,0.98),_rgba(217,165,45,0.96))] px-6 py-7 text-center text-slate-950 shadow-[0_25px_60px_rgba(255,193,7,0.24)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(255,193,7,0.34)] sm:px-8 sm:py-8"
              href={buildChildHref({
                pathname: "/today",
                childId,
                params: { day: currentDayId }
              })}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_55%)] opacity-80" />
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-800/70">Today</p>
                <h2
                  className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {currentDayTitle}
                </h2>
                <p className="mt-3 text-sm font-medium text-slate-800/75 sm:text-base">
                  오늘의 연습실 문이 열렸습니다. 가장 먼저 이 수업으로 들어가세요.
                </p>
                <div className="mt-5 inline-flex items-center rounded-full border border-slate-900/10 bg-slate-950/10 px-4 py-2 text-sm font-bold text-slate-900/85">
                  오늘의 Day 시작
                </div>
              </div>
            </Link>

            <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
              {supportCards.map((card) => (
                <Link
                  key={card.label}
                  className={`group rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.12),_rgba(255,255,255,0.05))] px-6 py-5 shadow-[0_14px_35px_rgba(4,6,16,0.25)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white/20 ${card.accent}`}
                  href={card.href}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">
                    {card.label}
                  </p>
                  <p className="mt-3 text-2xl font-black text-white">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{card.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-2 flex min-h-[25rem] w-full max-w-3xl items-end justify-center px-4 pb-2 pt-4">
              <div className="relative flex w-full flex-col items-center">
                <div className="pointer-events-none absolute -top-3 h-8 w-48 rounded-full bg-amber-100/20 blur-xl" />
                <div className="pointer-events-none absolute bottom-6 h-20 w-64 rounded-full bg-indigo-200/18 blur-2xl" />
                <div className="pointer-events-none absolute left-[20%] top-12 h-2 w-2 rounded-full bg-amber-100/60 shadow-[0_0_18px_rgba(255,236,179,0.75)]" />
                <div className="pointer-events-none absolute right-[22%] top-20 h-1.5 w-1.5 rounded-full bg-violet-100/70 shadow-[0_0_16px_rgba(220,205,255,0.75)]" />

                <div className="relative flex h-[22rem] w-[17rem] items-center justify-center rounded-[2.4rem] border border-white/12 bg-[linear-gradient(180deg,_rgba(251,251,255,0.14),_rgba(255,255,255,0.05))] px-6 text-center text-white shadow-[0_25px_70px_rgba(5,8,20,0.35)] backdrop-blur-md sm:h-[24rem] sm:w-[19rem]">
                  <div className="absolute inset-x-4 bottom-4 h-12 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,218,124,0.22),_rgba(255,255,255,0.04)_55%,_transparent_72%)] blur-xl" />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                      Student Mage
                    </p>
                    <p
                      className="mt-4 text-4xl font-semibold leading-none sm:text-5xl"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {childName}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-white/72">
                      오늘의 수업을 끝내면 별빛 배지가 하나 더 밝아집니다.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                    오늘의 수업 {currentDayTitle}
                  </span>
                  <span className="rounded-full border border-violet-100/15 bg-violet-200/10 px-3 py-1.5">
                    Academy Gate Open
                  </span>
                </div>
              </div>
            </div>

            <Link
              className="group w-full max-w-md rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.12),_rgba(255,255,255,0.05))] px-6 py-5 text-center shadow-[0_18px_40px_rgba(4,6,16,0.25)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white/20"
              href={buildChildHref({ pathname: "/character", childId })}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">
                Character
              </p>
              <p className="mt-3 text-2xl font-black text-white sm:text-3xl">XP / Level / 성장</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                주인공 연구실로 내려가 연속 학습과 레벨 상승을 확인합니다.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
