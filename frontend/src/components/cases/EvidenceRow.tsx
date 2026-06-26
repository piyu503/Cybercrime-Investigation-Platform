import { useState } from "react";
import { FileText, Image, Video, Music, Archive, File, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { FileMetadata } from "@/types/case.types";
import EntityPanel from "./EntityPanel";
// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').substring(0, 19);
}

function getFileIcon(filetype: string) {
  const t = filetype.toLowerCase();
  const cls = "h-4 w-4 shrink-0";
  if (t.includes("image")) return <Image className={`${cls} text-sky-400`} />;
  if (t.includes("video")) return <Video className={`${cls} text-violet-400`} />;
  if (t.includes("audio")) return <Music className={`${cls} text-pink-400`} />;
  if (t.includes("pdf") || t.includes("text") || t.includes("doc"))
    return <FileText className={`${cls} text-amber-400`} />;
  if (t.includes("zip") || t.includes("tar") || t.includes("rar"))
    return <Archive className={`${cls} text-orange-400`} />;
  return <File className={`${cls} text-white/40`} />;
}

function getTypeBadgeClass(filetype: string): string {
  const t = filetype.toLowerCase();
  if (t.includes("image")) return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  if (t.includes("video")) return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (t.includes("audio")) return "bg-pink-500/10 text-pink-400 border-pink-500/20";
  if (t.includes("pdf")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (t.includes("zip") || t.includes("tar"))
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-white/5 text-white/50 border-white/10";
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface EvidenceRowProps {
  file: FileMetadata;
  index: number;
}

export default function EvidenceRow({ file, index }: EvidenceRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className={`border-b border-white/5 transition-colors hover:bg-white/[0.05] group cursor-pointer ${index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`} onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-4 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shadow-sm group-hover:bg-white/10 transition-colors">
                {getFileIcon(file.filetype)}
              </div>
              <span className="text-sm font-medium text-white/90 truncate max-w-[240px] group-hover:text-blue-100 transition-colors" title={file.filename}>
                {file.filename}
              </span>
            </div>
            {file.sha256_hash && (
              <div className="pl-[38px] flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-medium text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title={`SHA-256: ${file.sha256_hash}`}>
                  SHA-256: {file.sha256_hash.substring(0, 12)}...
                </span>
              </div>
            )}
          </div>
        </td>

        {/* File Type */}
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getTypeBadgeClass(file.filetype)}`}
          >
            {file.filetype.split("/").pop() || file.filetype}
          </Badge>
        </td>

        {/* Classification */}
        <td className="px-4 py-3">
          <span className="text-xs font-medium text-white/70">
            {file.processed_data?.classification || "-"}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          {file.is_processed ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              PROCESSED
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-white/5 text-white/40 border-white/10 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
              PENDING
            </Badge>
          )}
        </td>

        {/* Upload Date */}
        <td className="px-4 py-3">
          <span className="text-xs font-mono text-white/50 whitespace-nowrap">
            {formatDate(file.uploaded_at)}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          {file.is_processed && (
            <div 
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 group-hover:text-blue-300 transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              {isExpanded ? "HIDE RESULTS" : "VIEW RESULTS"}
            </div>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0 border-b border-white/5 bg-black/40 shadow-inner">
            <EntityPanel file={file} />
          </td>
        </tr>
      )}
    </>
  );
}
