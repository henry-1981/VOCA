"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DayCompleteCelebration } from "@/components/effects/day-complete-celebration";
import { stopBgm } from "@/lib/audio/bgm";
import { playWordAudio } from "@/lib/audio/play-word-audio";
import { playSfx } from "@/lib/audio/sfx";
import { setMockDayStage } from "@/lib/mock/day-stage";
import { buildChildHref } from "@/lib/navigation/child-href";
import { syncTestCompletion } from "@/lib/sync/sync-day-completion";
import type { LearningTestQuestion } from "@/lib/test/generate-learning-test";

type LearningTestScreenProps = {
  childId?: string;
  dayId?: string;
  dayTitle: string;
  questions: LearningTestQuestion[];
  mode?: "test" | "review";
  completionHref?: string;
  completionLabel?: string;
};

/** Random sparkle positions seeded per render */
function randomSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${30 + Math.random() * 40}%`,
    left: `${20 + Math.random() * 60}%`,
    delay: `${i * 0.06}s`
  }));
}

export function LearningTestScreen({
  childId,
  dayId,
  dayTitle,
  questions,
  mode = "test",
  completionHref,
  completionLabel
}: LearningTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Gamification effect states
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [combo, setCombo] = useState(0);
  const [xpFloat, setXpFloat] = useState<string | null>(null);
  const [showComboAnim, setShowComboAnim] = useState(false);

  // Timeout cleanup refs
  const effectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const xpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comboAnimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stopBgm();
    return () => {
      if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
      if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
      if (comboAnimTimerRef.current) clearTimeout(comboAnimTimerRef.current);
    };
  }, []);

  const isReviewMode = mode === "review";
  const question = questions[currentIndex];
  const answered = selectedChoice !== null;
  const correctChoice = question.answer;
  const progressPips = questions.map((entry, index) => ({
    id: entry.id,
    active: index === currentIndex,
    passed: index < currentIndex
  }));
  const defaultCompletionHref = buildChildHref({
    pathname: "/today",
    childId,
    params: {
      day: dayId,
      stage: "test_completed"
    }
  });
  const resolvedCompletionHref = completionHref ?? defaultCompletionHref;
  const resolvedCompletionLabel =
    completionLabel ?? (isReviewMode ? "복습실로 돌아가기" : "Today로 돌아가기");
  const outerBackgroundClass = isReviewMode
    ? "bg-[linear-gradient(180deg,_#0f0c23,_#141030_50%,_#0c0f1a)] text-white"
    : "bg-[linear-gradient(180deg,_#140f2e,_#1c173e_50%,_#0f1225)] text-white";
  const frameClass = isReviewMode
    ? "border border-white/10 bg-white/8 shadow-[0_28px_90px_rgba(0,0,0,0.4)] backdrop-blur-sm"
    : "border border-white/10 bg-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-sm";
  const progressClass = isReviewMode
    ? "bg-[linear-gradient(90deg,_#d9e2f4,_#9fb2d8)]"
    : "bg-violet-600";
  const passedProgressClass = isReviewMode ? "bg-slate-500/40" : "bg-violet-400/40";
  const promptCardClass = isReviewMode
    ? "bg-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm ring-1 ring-white/10"
    : "bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(49,46,129,0.92))] text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]";
  const promptGlowClass = isReviewMode
    ? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.86),_transparent_72%)]"
    : "bg-[radial-gradient(circle_at_top,_rgba(255,226,148,0.18),_transparent_72%)]";
  const promptKickerClass = isReviewMode ? "text-white/60" : "text-slate-300";
  const promptSubKickerClass = isReviewMode ? "text-white/50" : "text-amber-100/80";
  const promptHintClass = isReviewMode ? "text-white/50" : "text-slate-300";
  const audioButtonClass = isReviewMode
    ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10 text-white"
    : "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";
  const tileLabel = isReviewMode ? "Review Tile" : "Magical Tile";

  function playAudio() {
    playWordAudio({
      text: question.audioText,
      audioMode: question.audioMode,
      audioUrl: question.audioUrl
    });
  }

  function choose(choice: string) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice(choice);
    const isCorrect = choice === question.answer;
    playSfx(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore((value) => value + 1);

      const newCombo = combo + 1;
      setCombo(newCombo);

      // Show effects (skip sparkle/combo in review mode)
      if (!isReviewMode) {
        setShowCorrectEffect(true);
        effectTimerRef.current = setTimeout(() => {
          setShowCorrectEffect(false);
        }, 300);

        // Show combo animation when reaching 3+
        if (newCombo >= 3) {
          setShowComboAnim(true);
          comboAnimTimerRef.current = setTimeout(() => {
            setShowComboAnim(false);
          }, 500);
        }
      }

      // XP float (shown in both modes, different style)
      const xpAmount = !isReviewMode && newCombo >= 5 ? 15 : 5;
      setXpFloat(`+${xpAmount} XP`);
      xpTimerRef.current = setTimeout(() => {
        setXpFloat(null);
      }, 600);
    } else {
      // Wrong answer
      setCombo(0);
      setWrongIds((prev) => [...prev, question.id]);

      if (!isReviewMode) {
        setShowWrongEffect(true);
        effectTimerRef.current = setTimeout(() => {
          setShowWrongEffect(false);
        }, 400);
      }
    }

    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        if (childId && dayId) {
          setMockDayStage(childId, dayId, "test_completed");

          // Compute final score/wrongIds including this answer
          const finalScore = isCorrect ? score + 1 : score;
          const finalWrongIds = isCorrect ? wrongIds : [...wrongIds, question.id];

          void syncTestCompletion({
            childId,
            dayId,
            score: finalScore,
            totalQuestions: questions.length,
            wrongWordIds: finalWrongIds
          });
        }
        // In test mode, show celebration overlay before results
        if (!isReviewMode) {
          setShowCelebration(true);
        } else {
          setCompleted(true);
        }
        return;
      }

      setCurrentIndex((value) => value + 1);
      setSelectedChoice(null);
    }, 250);
  }

  // Calculate XP total for celebration: 5 per correct answer (simplified)
  const totalXp = score * 5;

  if (showCelebration) {
    return (
      <DayCompleteCelebration
        dayTitle={dayTitle}
        totalXp={totalXp}
        onClose={() => {
          setShowCelebration(false);
          setCompleted(true);
        }}
      />
    );
  }

  if (completed) {
    return (
      <main className={`min-h-[100dvh] px-6 py-8 ${outerBackgroundClass}`}>
        <div
          className={`mx-auto flex max-w-2xl flex-col gap-4 rounded-[2rem] p-8 ${frameClass}`}
        >
          <div
            className={`rounded-[1.75rem] px-6 py-7 ${
              isReviewMode
                ? "bg-white/10 text-white backdrop-blur-sm"
                : "bg-amber-500/20 text-white backdrop-blur-sm"
            }`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                isReviewMode ? "text-white/60" : "text-white/70"
              }`}
            >
              {isReviewMode ? "Review Complete" : "Test Complete"}
            </p>
            <h1 className="mt-3 text-4xl font-black">{score} / {questions.length}</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {isReviewMode
                ? "복습 기록 정리를 마쳤습니다. 오늘의 오답 서랍이 한결 가벼워졌습니다."
                : "오늘의 테스트를 마쳤습니다. 연습실의 별빛 배지가 더 밝아졌습니다."}
            </p>
          </div>
          <Link
            className={`big-button ${
              isReviewMode
                ? "bg-[linear-gradient(180deg,_#18253f,_#243457)] text-white shadow-[0_18px_40px_rgba(36,52,87,0.28)]"
                : "bg-slate-950 text-white"
            }`}
            href={resolvedCompletionHref}
          >
            {resolvedCompletionLabel}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`relative min-h-[100dvh] px-6 py-8 ${outerBackgroundClass}`}>
      {/* Green flash overlay for correct answer */}
      {showCorrectEffect ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 bg-emerald-400 animate-flash-correct"
          data-testid="correct-effect"
        >
          {/* Sparkle characters */}
          {randomSparkles(4).map((s) => (
            <span
              key={s.id}
              className="absolute text-2xl text-amber-300 animate-sparkle"
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            >
              ✦
            </span>
          ))}
        </div>
      ) : null}

      {/* XP floating number */}
      {xpFloat ? (
        <div
          className={`pointer-events-none fixed top-1/3 left-1/2 z-50 -translate-x-1/2 animate-float-up font-black ${
            isReviewMode
              ? "text-lg text-slate-400"
              : xpFloat.includes("15")
                ? "text-3xl text-amber-400"
                : "text-xl text-amber-500"
          }`}
          data-testid="xp-float"
        >
          {xpFloat}
        </div>
      ) : null}

      <div
        className={`mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] p-8 ${frameClass}`}
      >
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-white/60">
            <span>{dayTitle}</span>
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="test progress">
            {progressPips.map((pip) => (
              <span
                key={pip.id}
                className={`h-2.5 rounded-full transition-all ${
                  pip.active
                    ? `w-8 ${progressClass}`
                    : pip.passed
                      ? `w-4 ${passedProgressClass}`
                      : "w-4 bg-white/15"
                }`}
              />
            ))}
          </div>
        </header>

        <section
          className={`relative overflow-hidden rounded-[1.9rem] p-6 ${promptCardClass}`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${promptGlowClass}`}
          />
          <div className="relative">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.18em] ${promptKickerClass}`}
            >
              {isReviewMode ? "Quiet Review Round" : `Round ${currentIndex + 1}`}
            </p>
            {isReviewMode ? (
              <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                Round {currentIndex + 1}
              </p>
            ) : null}
            <p
              className={`mt-2 text-xs font-semibold uppercase tracking-[0.16em] ${promptSubKickerClass}`}
            >
              {question.direction === "en_to_ko" ? "영어를 뜻으로 바꾸기" : "뜻을 영어로 찾기"}
            </p>
            <p className={`mt-4 text-sm font-semibold ${promptHintClass}`}>
              {isReviewMode
                ? "서두르지 말고 기억을 다시 맞춰보세요."
                : question.direction === "en_to_ko"
                  ? "영어 → 뜻"
                  : "뜻 → 영어"}
            </p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">{question.prompt}</h1>
            <div className="mt-5 flex items-center gap-3">
              <button
                aria-label="play audio"
                className={`inline-flex h-12 min-w-12 items-center justify-center rounded-full px-4 text-xl font-bold ${audioButtonClass}`}
                onClick={playAudio}
                type="button"
              >
                ▶
              </button>
              <p className={`text-sm ${promptHintClass}`}>
                {isReviewMode
                  ? "음성을 한 번 더 듣고 천천히 떠올려도 괜찮습니다."
                  : "힌트 음성으로 다시 확인할 수 있습니다."}
              </p>
            </div>
          </div>
        </section>

        {/* Combo counter */}
        {!isReviewMode && combo >= 3 ? (
          <div
            className={`flex items-center justify-center gap-2 ${showComboAnim ? "animate-scale-bounce" : ""}`}
            data-testid="combo-counter"
          >
            <span className={`font-black text-amber-500 ${combo >= 5 ? "text-3xl" : "text-xl"}`}>
              x{combo}
            </span>
            {combo >= 5 ? (
              <span className="text-sm font-bold text-amber-600">COMBO BONUS!</span>
            ) : null}
          </div>
        ) : null}

        <section
          className={`grid grid-cols-2 gap-3 ${showWrongEffect ? "animate-shake" : ""}`}
          data-testid={showWrongEffect ? "wrong-effect" : undefined}
        >
          {question.choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const isCorrect = answered && choice === correctChoice;
            const isWrong = isSelected && choice !== correctChoice;

            return (
              <button
                key={choice}
                className={`rounded-[1.6rem] border-2 px-5 py-5 text-left text-xl font-black shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition ${
                  isReviewMode
                    ? isCorrect
                      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                      : isWrong
                        ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                        : isSelected
                          ? "border-slate-400/40 bg-white/10 text-white"
                          : "border-white/10 bg-white/8 text-white hover:border-white/20 hover:bg-white/12"
                    : isCorrect
                      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                      : isWrong
                        ? "border-rose-400/40 bg-rose-500/20 text-rose-200"
                        : isSelected
                          ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                          : "border-white/10 bg-white/8 text-white hover:border-violet-400/30 hover:bg-violet-500/10"
                } ${answered ? "cursor-default" : "active:scale-[0.98]"}`}
                onClick={() => choose(choice)}
                type="button"
              >
                <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-white/40">
                  {tileLabel}
                </span>
                <span className="mt-3 block">{choice}</span>
              </button>
            );
          })}
        </section>

        {selectedChoice ? (
          <div
            className={`rounded-[1.5rem] px-5 py-4 text-center text-sm font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.15)] ${
              isReviewMode
                ? selectedChoice === question.answer
                  ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
                  : "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30"
                : selectedChoice === question.answer
                  ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
                  : "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30"
            }`}
          >
            {selectedChoice === question.answer
              ? isReviewMode
                ? "기억이 다시 맞춰졌습니다. 다음 카드로 조용히 넘어갑니다."
                : "정답입니다. 다음 라운드로 바로 넘어갑니다."
              : isReviewMode
                ? `괜찮아요. 정답은 ${question.answer} 입니다. 한 번 더 눈에 담고 넘어갈게요.`
                : `아쉽지만 정답은 ${question.answer} 입니다.`}
          </div>
        ) : null}
      </div>
    </main>
  );
}
