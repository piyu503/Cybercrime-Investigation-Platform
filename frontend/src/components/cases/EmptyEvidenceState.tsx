import { useNavigate } from "react-router-dom";
import { ShieldAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Props ─────────────────────────────────────────────────────────────────────
interface EmptyEvidenceStateProps {
  caseId: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function EmptyEvidenceState({ caseId }: EmptyEvidenceStateProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02]">
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <ShieldAlert className="h-5 w-5 text-white/30" />
        </div>

        {/* Message */}
        <h3 className="text-sm font-semibold text-white/80 mb-1">No evidence uploaded yet</h3>
        <p className="text-xs text-white/35 max-w-xs leading-relaxed mb-6">
          This case has no associated evidence files. Upload forensic evidence to begin the investigation.
        </p>

        {/* CTA */}
        <Button
          onClick={() => navigate(`/cases/${caseId}/upload`)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium h-9 px-5 gap-2"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Evidence
        </Button>
      </div>
    </div>
  );
}
