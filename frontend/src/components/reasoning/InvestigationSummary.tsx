import { IntelligenceSummary } from "@/api/reasoning.api";

export function InvestigationSummary({ summary }: { summary: IntelligenceSummary }) {
  return (
    <div className="bg-[#0a0c10] border border-white/10 p-5 rounded-sm space-y-6">
      
      <div>
        <h4 className="text-[10px] tracking-widest uppercase text-slate-500 font-bold mb-2">Case Overview</h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          {summary.case_overview}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-[10px] tracking-widest uppercase text-emerald-500 font-bold mb-2">Critical Findings</h4>
          <ul className="space-y-2">
            {summary.critical_findings.map((finding, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] tracking-widest uppercase text-amber-500 font-bold mb-2">Major Events</h4>
          <ul className="space-y-2">
            {summary.major_events.map((event, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 bg-slate-900/50 border border-white/5 rounded-sm">
        <h4 className="text-[10px] tracking-widest uppercase text-slate-500 font-bold mb-2">Overall Assessment</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          {summary.overall_assessment}
        </p>
      </div>

    </div>
  );
}
