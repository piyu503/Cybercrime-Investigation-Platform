import { InvestigationGap } from "@/api/reasoning.api";
import { Search } from "lucide-react";

export function GapCard({ gap }: { gap: InvestigationGap }) {
  return (
    <div className="p-4 bg-[#0a0c10] border border-white/10 rounded-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
            Investigation Gap
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-sm">
          Priority: {gap.priority}
        </span>
      </div>
      
      <p className="text-sm text-slate-300 mb-2">
        {gap.reason}
      </p>
      
      <div className="p-2 mt-3 bg-white/5 rounded text-xs text-white/70 font-mono">
        <span className="text-white/40 block mb-1 uppercase tracking-widest text-[9px]">Recommended Evidence</span>
        {gap.recommended_evidence}
      </div>
      
      <div className="mt-3 flex gap-2">
        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50">
          Confidence: {gap.confidence}
        </span>
      </div>
    </div>
  );
}
