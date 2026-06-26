import { FileText, ShieldCheck, ActivitySquare, AlertTriangle, Link as LinkIcon, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "@/api/dashboard.api";

export default function ReportPreview({ caseId }: { caseId: string }) {
  const downloadUrl = `${API_BASE_URL}${API_ENDPOINTS.report.download(caseId)}`;
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard', caseId],
    queryFn: () => getDashboardMetrics(caseId),
  });

  if (isLoading || !metrics) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/50 tracking-widest uppercase">
        Generating Report Preview...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
         <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
               <FileText className="w-5 h-5 text-indigo-400" /> Official Case Report
            </h2>
            <p className="text-sm text-white/50 mt-1">Immutable intelligence summary prepared by Forensix AI Engine.</p>
         </div>
         <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] border-0">
               <DownloadCloud className="w-4 h-4" /> Download Court PDF
            </Button>
         </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
         {/* Strategic Assessment */}
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-glass flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
               <ShieldCheck className="w-4 h-4" /> Strategic Assessment
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
               The intelligence engine has identified <span className="text-white font-bold">{metrics.entities_count} key entities</span> across <span className="text-white font-bold">{metrics.total_events} timeline events</span>.
               The readiness score of the investigation is currently <span className="text-white font-bold">{metrics.readiness_score}%</span>.
            </p>
         </div>

         {/* Critical Findings */}
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-glass flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-wider">
               <AlertTriangle className="w-4 h-4" /> Critical Findings
            </div>
            <ul className="text-sm text-white/70 space-y-2">
               <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Detected Contradictions:</span>
                  <span className="text-red-400 font-bold">{metrics.contradictions_count}</span>
               </li>
               <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Intelligence Gaps:</span>
                  <span className="text-amber-400 font-bold">{metrics.gaps_count}</span>
               </li>
               <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Strategic Recommendations:</span>
                  <span className="text-emerald-400 font-bold">{metrics.recommendations_count}</span>
               </li>
            </ul>
         </div>

         {/* Evidence Inventory */}
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-glass flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
               <ActivitySquare className="w-4 h-4" /> Evidence Inventory
            </div>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 mt-auto">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">Processed Files</span>
                  <span className="text-lg font-bold text-white">{metrics.processed_evidence} / {metrics.total_evidence}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">Processing Time</span>
                  <span className="text-lg font-mono text-white">{metrics.processing_time_seconds}s</span>
               </div>
            </div>
         </div>

         {/* Graph Snapshot */}
         <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-glass flex flex-col gap-3">
            <div className="flex items-center gap-2 text-pink-400 text-sm font-bold uppercase tracking-wider">
               <LinkIcon className="w-4 h-4" /> Relational Topology
            </div>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 mt-auto">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">Graph Nodes</span>
                  <span className="text-lg font-bold text-white">{metrics.total_nodes}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">Correlated Edges</span>
                  <span className="text-lg font-bold text-white">{metrics.total_edges}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
