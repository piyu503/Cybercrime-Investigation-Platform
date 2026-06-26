import { IntelligenceSummary } from "@/api/reasoning.api";

export function InvestigationSummary({ summary }: { summary: IntelligenceSummary }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-glass space-y-6 h-full flex flex-col justify-center">
      
      <div>
        <h4 className="text-xs tracking-wider uppercase text-white/50 font-bold mb-2">Project Overview</h4>
        <p className="text-sm text-white/90 leading-relaxed">
          {summary.case_overview}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
          <h4 className="text-[10px] tracking-widest uppercase text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
            Critical Findings
          </h4>
          <ul className="space-y-2">
            {(summary.critical_findings || []).map((finding, i) => (
              <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">»</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
          <h4 className="text-[10px] tracking-widest uppercase text-amber-400 font-bold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></span>
            Major Events
          </h4>
          <ul className="space-y-2">
            {(summary.major_events || []).map((event, i) => (
              <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 shrink-0">»</span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
        <h4 className="text-[10px] tracking-widest uppercase text-blue-400 font-bold mb-2">Strategic Assessment</h4>
        <p className="text-sm text-blue-50/80 leading-relaxed font-medium">
          {summary.overall_assessment}
        </p>
      </div>

    </div>
  );
}
