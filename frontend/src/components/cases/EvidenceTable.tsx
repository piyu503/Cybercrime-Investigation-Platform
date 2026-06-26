import { useState, useMemo } from "react";
import EvidenceRow from "./EvidenceRow";
import EmptyEvidenceState from "./EmptyEvidenceState";
import { FileMetadata } from "@/types/case.types";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Props ─────────────────────────────────────────────────────────────────────
interface EvidenceTableProps {
  files: FileMetadata[];
  caseId: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function EvidenceTable({ files, caseId }: EvidenceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (f.sha256_hash && f.sha256_hash.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === "all" || f.filetype.toLowerCase().includes(typeFilter.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, [files, searchQuery, typeFilter]);

  if (files.length === 0) {
    return <EmptyEvidenceState caseId={caseId} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full rounded-2xl border border-white/10 overflow-hidden bg-white/5 shadow-glass backdrop-blur-md">
      
      {/* Utility Bar */}
      <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename or hash..." 
            className="pl-9 h-8 bg-black/40 border-white/10 text-xs rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-32 h-8 bg-black/40 border border-white/10 text-xs text-white rounded-lg px-2 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="pdf">Documents</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin">
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
            {filteredFiles.map((file, index) => (
              <EvidenceRow key={`${file.filename}-${index}`} file={file} index={index} />
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/40 italic">
                  No evidence matches the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 flex justify-between items-center">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">
          {filteredFiles.length} / {files.length} ITEMS SHOWN
        </span>
      </div>
    </motion.div>
  );
}
