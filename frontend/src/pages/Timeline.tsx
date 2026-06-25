import { History } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function Timeline() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Module 04"
        title="Timeline"
        description="Chronological reconstruction of events, actions, and system activity per case."
      />
      <PlaceholderPanel icon={History} module="Timeline" />
    </div>
  );
}
