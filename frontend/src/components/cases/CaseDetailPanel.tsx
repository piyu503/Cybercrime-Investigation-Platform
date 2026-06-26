import { CalendarDays, FileStack, AlignLeft, Hash } from "lucide-react";
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

// ─── Component ─────────────────────────────────────────────────────────────────
interface CaseDetailPanelProps {
  caseData: Case;
}

export default function CaseDetailPanel({ caseData }: CaseDetailPanelProps) {
  return (
    <div className="space-y-5">
      {/* Case Name + Description */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight leading-tight line-clamp-2">{caseData.case_name}</h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          {caseData.description}
        </p>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Stat Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-white/5">
           <div className="flex items-center gap-2 text-white/50">
             <Hash className="h-4 w-4" />
             <span className="text-xs font-medium">Project ID</span>
           </div>
           <span className="font-mono text-xs text-white/80">{caseData._id}</span>
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-white/5">
           <div className="flex items-center gap-2 text-white/50">
             <CalendarDays className="h-4 w-4" />
             <span className="text-xs font-medium">Created</span>
           </div>
           <span className="text-xs text-white/80">{formatDate(caseData.created_at)}</span>
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-white/5">
           <div className="flex items-center gap-2 text-white/50">
             <FileStack className="h-4 w-4" />
             <span className="text-xs font-medium">Evidence Files</span>
           </div>
           <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{caseData.files.length} Files</span>
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-white/5">
           <div className="flex items-center gap-2 text-white/50">
             <AlignLeft className="h-4 w-4" />
             <span className="text-xs font-medium">Details Length</span>
           </div>
           <span className="text-xs text-white/80">{caseData.description.length} chars</span>
        </div>
      </div>
    </div>
  );
}
