import { useState } from "react";
import { FileText, Image, Video, Music, Archive, File, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { FileMetadata } from "@/types/case.types";
import EntityPanel from "./EntityPanel";
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
      <tr className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${index % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
        {/* Filename */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            {getFileIcon(file.filetype)}
            <span className="text-sm font-medium text-white/90 truncate max-w-[240px]">
              {file.filename}
            </span>
          </div>
        </td>

        {/* File Type */}
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${getTypeBadgeClass(file.filetype)}`}
          >
            {file.filetype.split("/").pop() || file.filetype}
          </Badge>
        </td>

        {/* Classification */}
        <td className="px-4 py-3">
          <span className="text-sm text-white/70">
            {file.processed_data?.classification || "-"}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          {file.is_processed ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase">
              Processed
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-white/5 text-white/40 border-white/10 text-[10px] uppercase">
              Pending
            </Badge>
          )}
        </td>

        {/* Upload Date */}
        <td className="px-4 py-3">
          <span className="text-sm text-white/50 whitespace-nowrap">
            {formatDate(file.uploaded_at)}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          {file.is_processed && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {isExpanded ? "Hide Results" : "View Results"}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0 border-b border-white/5 bg-[#0d0f14]/50">
            <EntityPanel file={file} />
          </td>
        </tr>
      )}
    </>
  );
}
