import Link from "next/link";
import { ReviewScreen } from "@/components/review/review-screen";

export default function ReviewPreviewPage() {
  return (
    <div className="relative">
      <ReviewScreen
        childId="daon"
        childName="다온"
        batchSize={10}
        title="누적 오답 복습"
      />
      <Link
        href="/design-preview"
        className="fixed bottom-3 left-3 z-50 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/80"
      >
        &larr; Back to previews
      </Link>
    </div>
  );
}
