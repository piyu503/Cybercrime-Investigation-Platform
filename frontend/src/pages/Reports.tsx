import { FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Module 05"
        title="Reports"
        description="Generated case summaries, forensic findings, and export-ready documentation."
      />
      <PlaceholderPanel icon={FileText} module="Reports" />
    </div>
  );
}
