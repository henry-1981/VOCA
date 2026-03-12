import { ProvisionComplete } from "@/components/provision/provision-complete";
import { FamilyProvisionForm } from "@/components/provision/family-provision-form";

export default function ProvisionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#efe7ff,_#fff_50%,_#e5f4ff)] px-6 py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <ProvisionComplete />
        <FamilyProvisionForm />
      </div>
    </main>
  );
}
