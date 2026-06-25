import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

export default function ReportPreview({ caseId }: { caseId: string }) {
  const downloadUrl = `${API_BASE_URL}${API_ENDPOINTS.report.download(caseId)}`;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-lg bg-white/5 space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
        <FileText className="w-10 h-10 text-indigo-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">Official Court Report</h2>
        <p className="text-sm text-white/50 max-w-md mt-2">
          Generate a comprehensive, immutable PDF document containing the investigation's executive summary, timelines, extracted entities, identified contradictions, and readiness score.
        </p>
      </div>
      <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
      </a>
    </div>
  );
}
