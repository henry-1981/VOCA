import Link from "next/link";
import Image from "next/image";
import { buildChildHref } from "@/lib/navigation/child-href";

type MainHubSceneProps = {
  childId: string;
  currentDayId: string;
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
  avatarSrc: string;
};

export function MainHubScene({
  childId,
  currentDayId,
  childName,
  level,
  streak,
  currentDayTitle,
  previewMode,
  avatarSrc,
}: MainHubSceneProps) {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* ═══ SKY ═══ */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            #060418 0%,
            #0c0a28 10%,
            #151040 20%,
            #221860 30%,
            #3a2880 40%,
            #5e3e96 48%,
            #8a5a9a 55%,
            #c08060 63%,
            #e0a050 70%,
            #f0c870 78%,
            #ffe8a8 86%
          )`,
        }}
      />

      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { x: "7%", y: "3%", s: 3, d: 0 },
          { x: "20%", y: "5%", s: 2, d: 0.6 },
          { x: "35%", y: "2%", s: 2.5, d: 1.1 },
          { x: "50%", y: "6%", s: 2, d: 0.3 },
          { x: "65%", y: "3%", s: 3, d: 0.9 },
          { x: "80%", y: "5%", s: 2, d: 1.4 },
          { x: "93%", y: "4%", s: 2.5, d: 0.2 },
          { x: "14%", y: "10%", s: 1.5, d: 0.7 },
          { x: "42%", y: "9%", s: 1.5, d: 1.2 },
          { x: "72%", y: "8%", s: 2, d: 0.5 },
          { x: "88%", y: "11%", s: 1.5, d: 1.0 },
          { x: "28%", y: "13%", s: 1.5, d: 0.4 },
          { x: "58%", y: "12%", s: 2, d: 0.8 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute animate-pulse rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              animationDelay: `${star.d}s`,
              boxShadow: `0 0 ${star.s * 4}px rgba(255,255,255,0.9)`,
            }}
          />
        ))}
      </div>

      {/* Horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "52%",
          height: "22%",
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,200,100,0.3), transparent)",
        }}
      />

      {/* ═══ BUILDINGS (wide, substantial) ═══ */}

      {/* LEFT WING — full edge-to-center coverage */}
      {/* Far left wall */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-0 w-[30%]"
        style={{
          height: "clamp(100px, 18vh, 160px)",
          background: "linear-gradient(180deg, #1e1838 0%, #14102a 100%)",
          clipPath: "polygon(0% 0%, 100% 30%, 100% 100%, 0% 100%)",
        }}
      />
      {/* Left main building */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-0 w-[25%]"
        style={{
          height: "clamp(140px, 28vh, 230px)",
          background: "linear-gradient(180deg, #221a3e 0%, #181230 80%, #12102a 100%)",
          clipPath:
            "polygon(0% 22%, 15% 12%, 30% 18%, 50% 6%, 70% 14%, 85% 8%, 100% 20%, 100% 100%, 0% 100%)",
        }}
      />
      {/* Left tall tower */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-[12%] w-[16%]"
        style={{
          height: "clamp(200px, 42vh, 350px)",
          background: "linear-gradient(170deg, #2a2050 0%, #1e183e 50%, #161030 100%)",
          clipPath:
            "polygon(32% 0%, 40% 3%, 48% 0%, 52% 3%, 60% 0%, 68% 3%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)",
        }}
      />
      {/* Left tower rooftop detail */}
      <div
        className="pointer-events-none absolute left-[16%] w-[8%]"
        style={{
          bottom: "calc(35% + clamp(200px, 42vh, 350px) - 4px)",
          height: "12px",
          background: "#2a2050",
          clipPath: "polygon(20% 100%, 50% 0%, 80% 100%)",
        }}
      />
      {/* Left windows */}
      <div className="pointer-events-none absolute bottom-[48%] left-[17%] h-2.5 w-2 rounded-sm bg-amber-200/60 shadow-[0_0_12px_rgba(255,220,130,0.6)]" />
      <div className="pointer-events-none absolute bottom-[55%] left-[19%] h-2 w-2 rounded-full bg-amber-200/45 shadow-[0_0_10px_rgba(255,220,130,0.5)]" />
      <div className="pointer-events-none absolute bottom-[62%] left-[18%] h-2.5 w-2 rounded-sm bg-amber-200/35 shadow-[0_0_8px_rgba(255,220,130,0.4)]" />
      <div className="pointer-events-none absolute bottom-[42%] left-[8%] h-2 w-1.5 rounded-sm bg-amber-200/30 shadow-[0_0_6px_rgba(255,220,130,0.3)]" />
      <div className="pointer-events-none absolute bottom-[40%] left-[5%] h-1.5 w-1.5 rounded-sm bg-amber-100/25" />

      {/* RIGHT WING — mirror of left */}
      <div
        className="pointer-events-none absolute bottom-[35%] right-0 w-[30%]"
        style={{
          height: "clamp(100px, 18vh, 160px)",
          background: "linear-gradient(180deg, #1e1838 0%, #14102a 100%)",
          clipPath: "polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[35%] right-0 w-[25%]"
        style={{
          height: "clamp(130px, 26vh, 220px)",
          background: "linear-gradient(180deg, #201840 0%, #161030 80%, #100e28 100%)",
          clipPath:
            "polygon(0% 20%, 15% 8%, 30% 14%, 50% 6%, 70% 18%, 85% 10%, 100% 22%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[35%] right-[12%] w-[16%]"
        style={{
          height: "clamp(190px, 40vh, 330px)",
          background: "linear-gradient(190deg, #282048 0%, #1c163a 50%, #14102e 100%)",
          clipPath:
            "polygon(32% 0%, 40% 3%, 48% 0%, 52% 3%, 60% 0%, 68% 3%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)",
        }}
      />
      {/* Right windows */}
      <div className="pointer-events-none absolute bottom-[47%] right-[17%] h-2.5 w-2 rounded-sm bg-amber-200/55 shadow-[0_0_12px_rgba(255,220,130,0.5)]" />
      <div className="pointer-events-none absolute bottom-[54%] right-[19%] h-2 w-2 rounded-full bg-amber-200/40 shadow-[0_0_10px_rgba(255,220,130,0.4)]" />
      <div className="pointer-events-none absolute bottom-[60%] right-[18%] h-2.5 w-2 rounded-sm bg-amber-200/30 shadow-[0_0_8px_rgba(255,220,130,0.3)]" />
      <div className="pointer-events-none absolute bottom-[41%] right-[8%] h-2 w-1.5 rounded-sm bg-amber-200/30 shadow-[0_0_6px_rgba(255,220,130,0.3)]" />

      {/* CENTER WALL (connects left and right wings) */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-[24%] right-[24%]"
        style={{
          height: "clamp(75px, 15vh, 125px)",
          background: "linear-gradient(180deg, #241c44 0%, #1a1434 70%, #14102a 100%)",
        }}
      />
      {/* Wall crenellation */}
      <div
        className="pointer-events-none absolute left-[24%] right-[24%]"
        style={{
          bottom: "calc(35% + clamp(75px, 15vh, 125px) - 2px)",
          height: "8px",
          background:
            "repeating-linear-gradient(90deg, #241c44 0px, #241c44 12px, transparent 12px, transparent 18px)",
        }}
      />

      {/* CENTRAL TOWER (tallest, dramatic) */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-1/2 w-[20%] -translate-x-1/2"
        style={{
          height: "clamp(260px, 52vh, 440px)",
          background: `linear-gradient(180deg,
            #322860 0%,
            #28204e 30%,
            #1e183c 60%,
            #161030 90%,
            #12102a 100%
          )`,
          clipPath:
            "polygon(35% 0%, 42% 3%, 48% 0%, 52% 3%, 58% 0%, 65% 3%, 100% 16%, 98% 100%, 2% 100%, 0% 16%)",
        }}
      />
      {/* Tower spire */}
      <div
        className="pointer-events-none absolute left-1/2 w-[6%] -translate-x-1/2"
        style={{
          bottom: "calc(35% + clamp(260px, 52vh, 440px) - 6px)",
          height: "20px",
          background: "#322860",
          clipPath: "polygon(30% 100%, 50% 0%, 70% 100%)",
        }}
      />
      {/* Tower top window (beacon) */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "calc(35% + clamp(220px, 44vh, 370px))" }}
      >
        <div className="h-5 w-5 rounded-full bg-amber-200/90 shadow-[0_0_20px_rgba(255,220,130,0.9),0_0_50px_rgba(255,200,80,0.5),0_0_80px_rgba(255,180,50,0.2)]" />
      </div>
      {/* Tower mid windows */}
      <div className="pointer-events-none absolute bottom-[56%] left-[48%] h-3 w-2 rounded-sm bg-amber-200/50 shadow-[0_0_10px_rgba(255,220,130,0.5)]" />
      <div className="pointer-events-none absolute bottom-[56%] left-[51%] h-3 w-2 rounded-sm bg-amber-200/50 shadow-[0_0_10px_rgba(255,220,130,0.5)]" />
      <div className="pointer-events-none absolute bottom-[50%] left-1/2 h-2.5 w-2 -translate-x-1/2 rounded-sm bg-amber-200/35 shadow-[0_0_8px_rgba(255,220,130,0.3)]" />

      {/* GATE ARCH */}
      <div
        className="pointer-events-none absolute bottom-[35%] left-1/2 w-[20%] -translate-x-1/2"
        style={{
          height: "clamp(100px, 20vh, 170px)",
          background: "linear-gradient(180deg, #181430 0%, #0c0a1c 100%)",
          clipPath:
            "polygon(0% 25%, 6% 14%, 16% 6%, 28% 1%, 42% -1%, 50% -2%, 58% -1%, 72% 1%, 84% 6%, 94% 14%, 100% 25%, 100% 100%, 66% 100%, 66% 40%, 60% 26%, 50% 20%, 40% 26%, 34% 40%, 34% 100%, 0% 100%)",
        }}
      />

      {/* Gate interior warm glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "35%", width: "6.4%", height: "clamp(60px, 12vh, 100px)" }}
      >
        <div className="h-full w-full rounded-t-[40%] bg-gradient-to-t from-amber-400/50 via-amber-300/25 to-amber-200/10" />
      </div>
      {/* Gate outer glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "34%", width: "16%", height: "clamp(80px, 16vh, 130px)" }}
      >
        <div className="absolute inset-0 animate-pulse rounded-t-full bg-gradient-to-t from-amber-300/12 via-amber-200/6 to-transparent blur-2xl" />
      </div>

      {/* ═══ GROUND ═══ */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "36%",
          background: `linear-gradient(180deg,
            #2a2240 0%,
            #221a34 12%,
            #1c162c 30%,
            #161224 55%,
            #10101e 100%
          )`,
        }}
      />

      {/* Cobblestone path with perspective */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "50%",
          height: "35%",
          background: `linear-gradient(180deg,
            rgba(65, 55, 52, 0.35) 0%,
            rgba(75, 63, 58, 0.45) 40%,
            rgba(85, 72, 65, 0.5) 100%
          )`,
          clipPath: "polygon(40% 0%, 60% 0%, 88% 100%, 12% 100%)",
        }}
      />

      {/* Path center line */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "2%",
          height: "34%",
          background: "linear-gradient(180deg, rgba(255,220,170,0.08), rgba(255,220,170,0.03))",
          clipPath: "polygon(0% 0%, 100% 0%, 120% 100%, -20% 100%)",
        }}
      />

      {/* Foliage / bushes at ground line */}
      {[
        { left: "2%", w: "10%", h: 14, opacity: 0.3 },
        { left: "8%", w: "8%", h: 10, opacity: 0.25 },
        { left: "80%", w: "10%", h: 12, opacity: 0.28 },
        { left: "88%", w: "9%", h: 11, opacity: 0.22 },
      ].map((bush, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            bottom: "33%",
            left: bush.left,
            width: bush.w,
            height: bush.h,
            background: `rgba(30,50,25,${bush.opacity})`,
            filter: "blur(3px)",
          }}
        />
      ))}

      {/* ═══ INTERACTIVE LAYER ═══ */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        {/* ── HUD ── */}
        <header className="flex items-start justify-between px-4 pt-4 sm:px-6 sm:pt-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/45">
              {previewMode ? "Preview" : "Magic Academy"}
            </p>
            <h1
              className="text-2xl font-semibold text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {childName}
            </h1>
          </div>
          <div className="flex gap-1.5 text-[10px] font-semibold">
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-white/60 backdrop-blur-sm">
              Lv.{level}
            </span>
            <span className="rounded-full border border-amber-300/15 bg-amber-950/30 px-2.5 py-1 text-amber-200/70 backdrop-blur-sm">
              {streak}일 연속
            </span>
          </div>
        </header>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── TODAY PORTAL (above gate) ── */}
        <div className="relative z-20 flex justify-center">
          <Link
            href={buildChildHref({
              pathname: "/today",
              childId,
              params: { day: currentDayId },
            })}
            className="group relative flex flex-col items-center text-center"
          >
            <div className="absolute -inset-6 rounded-full bg-amber-400/8 blur-3xl transition-all duration-500 group-hover:bg-amber-400/15" />

            <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-b from-amber-300/20 via-amber-400/12 to-amber-600/8 shadow-[0_0_24px_rgba(255,200,80,0.25),inset_0_0_16px_rgba(255,200,80,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-amber-200/60 group-hover:shadow-[0_0_40px_rgba(255,200,80,0.4),inset_0_0_20px_rgba(255,200,80,0.2)] sm:h-28 sm:w-28">
              <div className="pointer-events-none absolute inset-1.5 rounded-full border border-amber-200/15 animate-[pulse_3s_ease-in-out_infinite]" />
              <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-amber-200/60">
                Today
              </p>
              <p
                className="text-base font-semibold leading-tight text-amber-50 sm:text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {currentDayTitle}
              </p>
            </div>

            <span className="mt-1.5 text-[10px] font-semibold text-amber-200/50 transition group-hover:text-amber-200/80">
              오늘의 Day 시작 →
            </span>
          </Link>
        </div>

        {/* ── REVIEW & HISTORY + AVATAR as one integrated zone ── */}
        <div className="relative mt-1 flex flex-1 flex-col items-center">
          {/* Review/History flanking */}
          <div className="relative z-30 flex w-full items-start justify-between px-2 sm:px-4">
            <Link
              href={buildChildHref({ pathname: "/review", childId })}
              className="group flex w-[80px] flex-col items-center rounded-lg border border-sky-300/12 bg-sky-950/25 px-2 py-2 text-center backdrop-blur-sm transition-all hover:border-sky-300/25 hover:bg-sky-900/25 sm:w-[100px]"
            >
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-sky-300/45">
                Review
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-sky-50">복습실</p>
              <p className="text-[8px] text-sky-200/35">누적 오답</p>
            </Link>

            <Link
              href={buildChildHref({ pathname: "/history", childId })}
              className="group flex w-[80px] flex-col items-center rounded-lg border border-amber-300/12 bg-amber-950/20 px-2 py-2 text-center backdrop-blur-sm transition-all hover:border-amber-300/25 hover:bg-amber-900/20 sm:w-[100px]"
            >
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-amber-300/50">
                History
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-amber-50">기록실</p>
              <p className="text-[8px] text-amber-200/40">Day 기록</p>
            </Link>
          </div>

          {/* Avatar (overlapping gate zone, protagonist) */}
          <div className="relative z-20 -mt-1 flex flex-1 items-end justify-center pb-0">
            {/* Ground shadow */}
            <div className="absolute bottom-1 h-5 w-40 rounded-[100%] bg-black/50 blur-xl" />

            {/* Avatar with scene-matched blending */}
            <div className="relative w-[68vw] max-w-[310px]">
              {/* Vignette overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `radial-gradient(ellipse 62% 68% at 50% 48%,
                    transparent 35%,
                    rgba(20,14,32,0.4) 52%,
                    rgba(16,12,28,0.78) 65%,
                    rgba(14,10,24,0.96) 78%
                  )`,
                }}
              />
              {/* Soft edge mask */}
              <div
                style={{
                  maskImage:
                    "radial-gradient(ellipse 75% 82% at 50% 50%, black 32%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 75% 82% at 50% 50%, black 32%, transparent 70%)",
                }}
              >
                <Image
                  src={avatarSrc}
                  alt={childName}
                  width={500}
                  height={600}
                  className="h-auto w-full saturate-[0.85] contrast-[1.05]"
                  priority
                />
              </div>
              {/* Warm glow at feet */}
              <div className="pointer-events-none absolute inset-x-[20%] bottom-[5%] z-10 h-8 rounded-[100%] bg-amber-400/8 blur-xl" />
            </div>

            {/* Sparkles */}
            {[
              { x: "14%", y: "40%", s: 2, d: 0 },
              { x: "82%", y: "35%", s: 1.5, d: 0.6 },
              { x: "20%", y: "55%", s: 1.5, d: 1.2 },
              { x: "78%", y: "50%", s: 2, d: 0.3 },
              { x: "30%", y: "30%", s: 1, d: 0.9 },
            ].map((sp, i) => (
              <div
                key={i}
                className="pointer-events-none absolute animate-pulse rounded-full bg-amber-200/50"
                style={{
                  left: sp.x,
                  bottom: sp.y,
                  width: sp.s,
                  height: sp.s,
                  animationDelay: `${sp.d}s`,
                  boxShadow: `0 0 ${sp.s * 6}px rgba(255,220,150,0.6)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── CHARACTER (ground-level, below avatar) ── */}
        <div className="relative z-30 -mt-6 flex justify-center px-6 pb-5">
          <Link
            href={buildChildHref({ pathname: "/character", childId })}
            className="group flex items-center gap-2.5 rounded-xl border border-violet-300/12 bg-gradient-to-r from-violet-950/35 via-indigo-950/25 to-violet-950/35 px-4 py-2.5 backdrop-blur-sm transition-all hover:border-violet-300/25 hover:bg-violet-900/25"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-300/15 bg-violet-800/25 text-xs text-amber-200/60">
              ✦
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/90">{childName}의 성장</p>
              <p className="text-[9px] text-violet-200/40">XP · Level · 배지</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
