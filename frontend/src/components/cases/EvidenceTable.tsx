import EvidenceRow from "./EvidenceRow";
import EmptyEvidenceState from "./EmptyEvidenceState";
import { FileMetadata } from "@/types/case.types";
import { motion } from "framer-motion";

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 shadow-glass backdrop-blur-md">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-black/40 backdrop-blur-md">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50 w-[25%]">
                Filename
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50 w-[15%]">
                File Type
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50 w-[15%]">
                Classification
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50 w-[15%]">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50 w-[15%]">
                Upload Date
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {files.map((file, index) => (
              <EvidenceRow key={`${file.filename}-${index}`} file={file} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 flex justify-between items-center">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">
          {files.length} ITEMS DETECTED
        </span>
      </div>
    </motion.div>
  );
}
