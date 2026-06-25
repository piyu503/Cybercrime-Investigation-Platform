import { Contradiction } from "@/api/reasoning.api";
import { AlertTriangle, Info } from "lucide-react";

export function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  const isCritical = contradiction.severity === "Critical";
  
  return (
    <div className={`p-4 border rounded-sm ${isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-orange-500'}`} />
          <span className={`text-[11px] font-bold tracking-widest uppercase ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
            {contradiction.severity} Contradiction
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/50">{contradiction.confidence} Conf.</span>
      </div>
      
      <p className="mt-3 text-sm text-slate-200 leading-relaxed">
        {contradiction.reason}
      </p>
      
      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
        <div className="flex items-start gap-2 text-xs text-white/60">
          <Info className="w-3.5 h-3.5 mt-0.5 text-blue-400" />
          <span><strong className="text-white/80">Suggested Action:</strong> {contradiction.suggested_verification}</span>
        </div>
      </div>
    </div>
  );
}
