import { PageHeader } from "@/components/layout/PageHeader";
import { RecentCasesTable } from "@/components/dashboard/RecentCasesTable";

export default function Cases() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Module 02"
        title="Cases"
        description="Open, archived, and assigned case files across all units."
      />
      <RecentCasesTable />
    </div>
  );
}
