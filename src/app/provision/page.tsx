import { ProvisionComplete } from "@/components/provision/provision-complete";
import { FamilyProvisionForm } from "@/components/provision/family-provision-form";

export default function ProvisionPage() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[linear-gradient(180deg,_#0a0820,_#1a1040_40%,_#0f0a2e)]">
      {/* Top gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col gap-4 px-6 py-10">
        <ProvisionComplete />
        <FamilyProvisionForm />
      </div>
    </main>
  );
}
