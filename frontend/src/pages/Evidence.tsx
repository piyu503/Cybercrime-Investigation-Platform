import { Fingerprint } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function Evidence() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Module 03"
        title="Evidence"
        description="Chain-of-custody tracking for physical and digital evidence items."
      />
      <PlaceholderPanel icon={Fingerprint} module="Evidence" />
    </div>
  );
}
