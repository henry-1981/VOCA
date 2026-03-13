import Link from "next/link";

const previews = [
  { href: "/design-preview/hub", label: "Hub", desc: "아카데미 정문 — 게임 로비" },
  { href: "/design-preview/today", label: "Today", desc: "오늘의 Day — Learn/Test 스테이지" },
  { href: "/design-preview/test", label: "Test", desc: "4지선다 테스트 화면" },
  { href: "/design-preview/character", label: "Character", desc: "캐릭터 성장 — XP/Level/Streak" },
  { href: "/design-preview/review", label: "Review", desc: "달빛 복습실 랜딩" },
  { href: "/design-preview/history", label: "History", desc: "도서관 기록 보관실" },
  { href: "/design-preview/effects", label: "Effects", desc: "Day 완료 + 레벨업 이펙트" },
];

export default function DesignPreviewIndex() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight">Design Preview</h1>
        <p className="mt-2 text-sm text-slate-400">
          각 화면의 디자인을 목 데이터로 미리 확인합니다.
        </p>
        <nav className="mt-8 flex flex-col gap-3">
          {previews.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-lg font-bold text-white group-hover:text-amber-300">
                {p.label}
              </span>
              <span className="ml-3 text-sm text-slate-400">{p.desc}</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
