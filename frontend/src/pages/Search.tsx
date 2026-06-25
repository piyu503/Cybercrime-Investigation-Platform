import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function Search() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Global"
        title="Search Records"
        description="Search across all cases, evidence, and investigation timelines."
      />
      <PlaceholderPanel icon={SearchIcon} module="Search" />
    </div>
  );
}
