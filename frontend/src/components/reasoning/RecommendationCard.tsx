import { useState } from "react";
import { IntelligenceRecommendation } from "@/api/reasoning.api";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

export function RecommendationCard({ rec }: { rec: IntelligenceRecommendation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-white/10 rounded-sm overflow-hidden bg-slate-900/50">
      <div 
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">
              {rec.type}
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${
              rec.priority === 'High' ? 'bg-red-500/20 text-red-300' : 
              rec.priority === 'Medium' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
            }`}>
              {rec.priority} Priority
            </span>
          </div>
          <p className="text-sm text-slate-200">{rec.action}</p>
        </div>
        <div className="text-white/30">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-white/5 bg-slate-950/50 text-xs">
          <div className="mt-3 space-y-3">
            <div>
              <span className="text-[10px] tracking-widest uppercase text-slate-500 block mb-1 font-bold">Investigation Audit Trail (Reason)</span>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed pl-2 border-l-2 border-emerald-500/30">
                {rec.reason}
              </p>
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-slate-500 block mb-1 font-bold">Confidence</span>
              <p className="text-slate-400">
                {rec.confidence}
              </p>
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-slate-500 block mb-1 font-bold">Expected Outcome</span>
              <p className="text-slate-400">
                {rec.expected_outcome}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
