"use client";

export type DayInfo = {
  id: string;
  title: string;
  completed: boolean;
  isCheckpoint: boolean;
};

type DaySelectorModalProps = {
  days: DayInfo[];
  currentDayId: string;
  onSelect: (dayId: string) => void;
  onClose: () => void;
};

export function DaySelectorModal({
  days,
  currentDayId,
  onSelect,
  onClose
}: DaySelectorModalProps) {
  return (
    <div
      data-testid="day-selector-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border border-white/15 bg-[linear-gradient(180deg,_rgba(30,25,60,0.98),_rgba(15,12,35,0.98))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Day Selection
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              학습할 Day 선택
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/18"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {days.map((day) => {
            const isCurrent = day.id === currentDayId;

            return (
              <button
                key={day.id}
                type="button"
                data-testid={`day-item-${day.id}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`relative rounded-xl border px-3 py-3 text-center transition hover:-translate-y-0.5 ${
                  isCurrent
                    ? "border-amber-300/50 bg-amber-400/20 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                    : day.completed
                      ? "border-white/15 bg-white/8 text-white/80"
                      : "border-white/8 bg-white/4 text-white/50"
                } ${day.isCheckpoint ? "ring-1 ring-indigo-400/30" : ""}`}
                onClick={() => onSelect(day.id)}
              >
                {day.completed && (
                  <span className="absolute right-1.5 top-1.5 text-xs text-emerald-400">
                    ✓
                  </span>
                )}
                <p className="text-lg font-black">
                  {day.id.replace("day-", "").replace(/^0+/, "")}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  {day.isCheckpoint ? "Test" : "Day"}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-white/50">
                  {day.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
