import { ReadinessScore } from "@/api/reasoning.api";

export function ReadinessGauge({ readiness }: { readiness: ReadinessScore }) {
  const { overall_score, status, positive_factors, negative_factors } = readiness;

  let color = "text-red-500";
  let bg = "bg-red-500";
  if (overall_score >= 80) { color = "text-emerald-500"; bg = "bg-emerald-500"; }
  else if (overall_score >= 50) { color = "text-amber-500"; bg = "bg-amber-500"; }

  // Simple progress bar for the gauge
  return (
    <div className="flex flex-col gap-4 bg-[#0d0f14] border border-white/10 rounded-sm p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-widest text-slate-300 uppercase">Investigation Readiness</h3>
        <span className={`text-2xl font-mono font-bold ${color}`}>{overall_score}%</span>
      </div>
      
      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
        <div className={`h-full ${bg} transition-all duration-1000`} style={{ width: `${overall_score}%` }} />
      </div>
      
      <p className="text-xs text-white/50 font-mono tracking-widest uppercase text-right">Status: {status}</p>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <h4 className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Positive Factors</h4>
          {positive_factors?.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/70">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{f.reason}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Negative Factors</h4>
          {negative_factors?.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/70">
              <span className="text-red-400 mt-0.5">⚠</span>
              <span>{f.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
