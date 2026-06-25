import { CalendarDays, FileStack, AlignLeft, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Case } from "@/types/case.types";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Stat Tile ─────────────────────────────────────────────────────────────────
interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="mt-0.5 text-indigo-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-white/90 break-all leading-snug">{value}</p>
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface CaseDetailPanelProps {
  caseData: Case;
}

export default function CaseDetailPanel({ caseData }: CaseDetailPanelProps) {
  return (
    <div className="space-y-4">
      {/* Case Name + Description */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">{caseData.case_name}</h2>
        <p className="mt-1 text-sm text-white/50 leading-relaxed max-w-2xl">
          {caseData.description}
        </p>
      </div>

      <Separator className="bg-white/8" />

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          icon={<Hash className="h-4 w-4" />}
          label="Case ID"
          value={<span className="font-mono text-xs">{caseData._id}</span>}
        />
        <StatTile
          icon={<CalendarDays className="h-4 w-4" />}
          label="Created"
          value={formatDate(caseData.created_at)}
        />
        <StatTile
          icon={<FileStack className="h-4 w-4" />}
          label="Evidence Files"
          value={caseData.files.length}
        />
        <StatTile
          icon={<AlignLeft className="h-4 w-4" />}
          label="Description Length"
          value={`${caseData.description.length} chars`}
        />
      </div>
    </div>
  );
}
