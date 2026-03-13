"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { CheckpointQuestion } from "@/lib/types/domain";

type CheckpointTestScreenProps = {
  childId?: string;
  dayId?: string;
  dayTitle: string;
  questions: CheckpointQuestion[];
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function getHelperText(question: CheckpointQuestion) {
  switch (question.type) {
    case "word_search":
      return "영어 단어를 직접 입력하세요.";
    case "translation":
      return "뜻을 번역해서 입력하세요.";
    case "fill_blank":
      return question.choices.length > 0
        ? "빈칸에 들어갈 말을 고르세요."
        : "빈칸에 들어갈 말을 직접 입력하세요.";
    case "choice":
      return "알맞은 표현을 고르세요.";
    default:
      return "";
  }
}

/** Random sparkle positions for correct effect overlay */
function randomSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${30 + Math.random() * 40}%`,
    left: `${20 + Math.random() * 60}%`,
    delay: `${i * 0.06}s`
  }));
}

export function CheckpointTestScreen({
  childId,
  dayId,
  dayTitle,
  questions
}: CheckpointTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Gamification effect states
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const effectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
    };
  }, []);

  const question = questions[currentIndex];
  const hasChoices = question.choices.length > 0;
  const isChoiceType = question.type === "choice" || (question.type === "fill_blank" && hasChoices);

  const progressPips = questions.map((_, index) => ({
    id: index,
    active: index === currentIndex,
    passed: index < currentIndex
  }));

  function advance(correct: boolean) {
    if (correct) {
      setScore((value) => value + 1);

      // Gamification: sparkle effect for choice-type
      if (isChoiceType) {
        setShowCorrectEffect(true);
        effectTimerRef.current = setTimeout(() => {
          setShowCorrectEffect(false);
        }, 300);
      }
    } else {
      // Gamification: shake effect for choice-type
      if (isChoiceType) {
        setShowWrongEffect(true);
        effectTimerRef.current = setTimeout(() => {
          setShowWrongEffect(false);
        }, 400);
      }
    }

    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        setCompleted(true);
        return;
      }

      setCurrentIndex((value) => value + 1);
      setTypedAnswer("");
      setSelectedChoice(null);
    }, 250);
  }

  function submitTypedAnswer() {
    advance(normalizeAnswer(typedAnswer) === normalizeAnswer(question.answer));
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e9f3ff,_#fff_50%,_#fff3dc)] px-6 py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(255,245,210,0.96),_rgba(255,234,167,0.88))] px-6 py-7 text-slate-950 shadow-[0_20px_50px_rgba(255,193,7,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Checkpoint Complete
            </p>
            <h1 className="mt-3 text-4xl font-black">
              {score} / {questions.length}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              종합 점검을 마쳤습니다. 연습실의 별빛 배지가 더 밝아졌습니다.
            </p>
          </div>
          <Link
            className="big-button bg-slate-950 text-white"
            href={buildChildHref({
              pathname: "/today",
              childId,
              params: {
                day: dayId,
                stage: "test_completed"
              }
            })}
          >
            Today로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,_#e9f3ff,_#fff_50%,_#fff3dc)] px-6 py-8">
      {/* Green flash overlay for correct answer (choice-type) */}
      {showCorrectEffect ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 bg-emerald-400 animate-flash-correct"
          data-testid="correct-effect"
        >
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

      <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
            <span>{dayTitle}</span>
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          {/* Progress pips matching LearningTestScreen */}
          <div className="flex flex-wrap gap-2" aria-label="test progress">
            {progressPips.map((pip) => (
              <span
                key={pip.id}
                className={`h-2.5 rounded-full transition-all ${
                  pip.active
                    ? "w-8 bg-violet-600"
                    : pip.passed
                      ? "w-4 bg-violet-200"
                      : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </header>

        {/* Prompt card — unified dark style matching LearningTestScreen */}
        <section className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(49,46,129,0.92))] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(255,226,148,0.18),_transparent_72%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              {question.section}
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{question.prompt}</h1>
            <p className="mt-3 text-sm text-slate-300">{getHelperText(question)}</p>
          </div>
        </section>

        {hasChoices ? (
          <section
            className={`grid grid-cols-2 gap-3 ${showWrongEffect ? "animate-shake" : ""}`}
            data-testid={showWrongEffect ? "wrong-effect" : undefined}
          >
            {question.choices.map((choice) => {
              const isSelected = selectedChoice === choice;
              const answered = selectedChoice !== null;
              const isCorrect = answered && normalizeAnswer(choice) === normalizeAnswer(question.answer);
              const isWrong = isSelected && normalizeAnswer(choice) !== normalizeAnswer(question.answer);

              return (
                <button
                  key={choice}
                  className={`rounded-[1.6rem] border-2 px-5 py-5 text-left text-xl font-black shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                      : isWrong
                        ? "border-rose-400 bg-rose-50 text-rose-950"
                        : isSelected
                          ? "border-violet-400 bg-violet-50 text-violet-950"
                          : "border-slate-200 bg-white text-slate-900 hover:border-violet-200 hover:bg-violet-50/40"
                  } ${answered ? "cursor-default" : "active:scale-[0.98]"}`}
                  onClick={() => {
                    if (selectedChoice) return;
                    setSelectedChoice(choice);
                    advance(normalizeAnswer(choice) === normalizeAnswer(question.answer));
                  }}
                  type="button"
                >
                  <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Checkpoint Tile
                  </span>
                  <span className="mt-3 block">{choice}</span>
                </button>
              );
            })}
          </section>
        ) : (
          <section className="grid gap-3">
            <input
              className="rounded-[1.5rem] border border-slate-200 px-5 py-4 text-xl font-bold"
              onChange={(event) => setTypedAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitTypedAnswer();
                }
              }}
              value={typedAnswer}
            />
            <button
              className="big-button border-0 bg-slate-950 text-white"
              onClick={submitTypedAnswer}
              type="button"
            >
              제출
            </button>
          </section>
        )}

        {selectedChoice ? (
          <div
            className={`rounded-[1.5rem] px-5 py-4 text-center text-sm font-semibold shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${
              normalizeAnswer(selectedChoice) === normalizeAnswer(question.answer)
                ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                : "bg-rose-50 text-rose-900 ring-1 ring-rose-200"
            }`}
          >
            {normalizeAnswer(selectedChoice) === normalizeAnswer(question.answer)
              ? "정답입니다. 다음 문제로 넘어갑니다."
              : `아쉽지만 정답은 ${question.answer} 입니다.`}
          </div>
        ) : null}
      </div>
    </main>
  );
}
