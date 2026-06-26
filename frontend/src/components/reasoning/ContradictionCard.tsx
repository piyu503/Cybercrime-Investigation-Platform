import { Contradiction } from "@/api/reasoning.api";
import { AlertTriangle, Activity, Info } from "lucide-react";

export function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-red-500/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <h4 className="text-xs font-bold tracking-wider uppercase text-red-400">Conflicting Evidence</h4>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-red-500/20">
              <Activity className="w-3.5 h-3.5" /> View Sources
           </span>
           <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/10">{contradiction.confidence} Conf</span>
        </div>
      </div>
      <p className="text-sm text-white/80 leading-relaxed mt-2 bg-black/20 p-3 rounded-lg border border-red-500/10 shadow-inner">
        {contradiction.reason}
      </p>
      <div className="mt-3 space-y-2">
        <div className="flex items-start gap-2.5 text-xs text-white/60 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span><strong className="text-blue-400 uppercase tracking-widest text-[10px] mr-2">Suggested Action:</strong> <span className="text-blue-100">{contradiction.suggested_verification}</span></span>
        </div>
      </div>
    </div>
  );
}
