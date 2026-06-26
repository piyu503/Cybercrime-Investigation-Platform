import { ReadinessScore } from "@/api/reasoning.api";

export function ReadinessGauge({ readiness }: { readiness: ReadinessScore }) {
  const { overall_score, status, positive_factors, negative_factors } = readiness;

  let color = "text-red-400";
  let bg = "bg-red-500";
  let shadow = "shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  if (overall_score >= 80) { 
    color = "text-emerald-400"; 
    bg = "bg-emerald-500"; 
    shadow = "shadow-[0_0_15px_rgba(16,185,129,0.5)]";
  } else if (overall_score >= 50) { 
    color = "text-amber-400"; 
    bg = "bg-amber-500"; 
    shadow = "shadow-[0_0_15px_rgba(245,158,11,0.5)]";
  }

  return (
    <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glass h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-wider text-white/80 uppercase">Readiness Score</h3>
        <span className={`text-2xl font-bold tracking-tight ${color}`}>{overall_score}%</span>
      </div>
      
      <div className="w-full bg-black/40 border border-white/5 h-3 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${bg} ${shadow} transition-all duration-1000 ease-out`} style={{ width: `${overall_score}%` }} />
      </div>
      
      <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase text-right">STATUS: {status}</p>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <h4 className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md w-max border border-emerald-500/20">Positive Factors</h4>
          {positive_factors?.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/5">
              <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
              <span>{f.reason}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-md w-max border border-red-500/20">Negative Factors</h4>
          {negative_factors?.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/5">
              <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
              <span>{f.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
