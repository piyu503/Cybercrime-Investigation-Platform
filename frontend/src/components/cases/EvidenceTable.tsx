import EvidenceRow from "./EvidenceRow";
import EmptyEvidenceState from "./EmptyEvidenceState";
import { FileMetadata } from "@/types/case.types";

// ─── Props ─────────────────────────────────────────────────────────────────────
interface EvidenceTableProps {
  files: FileMetadata[];
  caseId: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function EvidenceTable({ files, caseId }: EvidenceTableProps) {
  if (files.length === 0) {
    return <EmptyEvidenceState caseId={caseId} />;
  }

  return (
    <div className="rounded-md border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 w-[25%]">
                Filename
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 w-[15%]">
                File Type
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 w-[15%]">
                Classification
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 w-[15%]">
                Status
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 w-[15%]">
                Upload Date
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <EvidenceRow key={`${file.filename}-${index}`} file={file} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="border-t border-white/8 bg-white/[0.02] px-4 py-2">
        <p className="text-[11px] text-white/30">
          {files.length} evidence file{files.length !== 1 ? "s" : ""} attached to this case
        </p>
      </div>
    </div>
  );
}
