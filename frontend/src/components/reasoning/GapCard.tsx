import { InvestigationGap } from "@/api/reasoning.api";
import { Search, Activity } from "lucide-react";

export function GapCard({ gap }: { gap: InvestigationGap }) {
  return (
    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20">
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
            Investigation Gap
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2 py-1 bg-white/5 border border-white/10 text-white/50 rounded-md uppercase tracking-widest">
            {gap.confidence} Conf
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 border rounded-md uppercase tracking-widest ${
            gap.priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            gap.priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {gap.priority} Priority
          </span>
        </div>
      </div>
      
      <p className="text-sm text-white/80 mb-3 leading-relaxed bg-black/20 p-3 rounded-lg border border-blue-500/10 shadow-inner">
        {gap.reason}
      </p>
      
      <div className="p-3 mt-3 bg-white/[0.02] border border-white/5 rounded-lg text-sm text-white/70">
        <span className="text-white/40 block mb-2 uppercase tracking-widest text-[10px] flex justify-between items-center font-bold">
          <span>Recommended Evidence</span>
          <span className="text-blue-400 flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/10 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-blue-500/20">
             <Activity className="w-3.5 h-3.5" /> View Sources
          </span>
        </span>
        <span className="text-blue-100">{gap.recommended_evidence}</span>
      </div>
    </div>
  );
}
