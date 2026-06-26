import { IntelligenceSummary } from "@/api/reasoning.api";
import { AlertTriangle, ActivitySquare, Link as LinkIcon, Database, CheckCircle2 } from "lucide-react";

export function InvestigationSummary({ summary }: { summary: IntelligenceSummary }) {
  return (
    <div className="bg-[#0b1121] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-8 flex flex-col justify-start overflow-y-auto max-h-[800px] scrollbar-thin">
      
      {/* Project Overview */}
      <div className="flex flex-col gap-2">
        <h4 className="text-[11px] tracking-widest uppercase text-indigo-400 font-bold mb-1">Project Overview</h4>
        <p className="text-[15px] text-white/90 leading-relaxed border-l-2 border-indigo-500/50 pl-4 py-1">
          {summary.project_overview || summary.case_overview}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Critical Findings */}
        <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/15">
          <h4 className="text-[11px] tracking-widest uppercase text-emerald-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            Critical Findings
          </h4>
          <ul className="space-y-5">
            {(summary.critical_findings || []).map((finding, i) => (
              <li key={i} className="flex flex-col gap-2 relative">
                <div className="text-[14px] text-emerald-50 font-medium leading-snug">
                  {typeof finding === 'string' ? finding : finding.finding}
                </div>
                {typeof finding !== 'string' && (
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold truncate max-w-[200px]">{finding.source_file}</span>
                       <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Conf: {finding.confidence}</span>
                    </div>
                    <span className="text-[13px] text-emerald-100/60 italic border-l-2 border-emerald-500/30 pl-3 py-0.5">"{finding.evidence_snippet}"</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Major Events */}
        <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/15">
          <h4 className="text-[11px] tracking-widest uppercase text-amber-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
            Major Events
          </h4>
          <ul className="space-y-4">
            {(summary.major_events || []).map((event, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span className="text-amber-500 mt-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ActivitySquare className="w-4 h-4" />
                </span>
                <div className="flex flex-col gap-1 w-full">
                  {typeof event === 'string' ? (
                    <span className="text-[14px] text-white/90">{event}</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">{event.time}</span>
                        <span className="text-[10px] text-amber-200/40 truncate max-w-[180px]">{event.source_file}</span>
                      </div>
                      <span className="text-[14px] text-amber-50/90 leading-snug">{event.event}</span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contradictions */}
        <div className="bg-red-950/20 p-5 rounded-2xl border border-red-500/15">
          <h4 className="text-[11px] tracking-widest uppercase text-red-400 font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Contradictions
          </h4>
          <ul className="space-y-4">
            {(summary.major_contradictions || []).map((c, i) => (
              <li key={i} className="flex flex-col gap-2">
                <span className="text-[14px] text-red-50 font-medium leading-snug">{typeof c === 'string' ? c : c.conflict}</span>
                {typeof c !== 'string' && (
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex flex-col gap-1.5">
                    <span className="text-[12px] text-red-200/80"><strong className="text-red-300/90 font-semibold">Why:</strong> {c.reason}</span>
                    <span className="text-[10px] text-red-400/50 font-mono mt-1 pt-1 border-t border-red-500/10 truncate">Src: {c.source_files.join(', ')}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Evidence */}
        <div className="bg-purple-950/20 p-5 rounded-2xl border border-purple-500/15">
          <h4 className="text-[11px] tracking-widest uppercase text-purple-400 font-bold mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Missing Evidence
          </h4>
          <ul className="space-y-4">
            {(summary.investigation_gaps || []).map((g, i) => (
              <li key={i} className="flex flex-col gap-1.5">
                <span className="text-[14px] text-purple-100 font-bold">{typeof g === 'string' ? g : g.missing_item}</span>
                {typeof g !== 'string' && (
                  <span className="text-[12px] text-purple-200/60 leading-relaxed border-l-2 border-purple-500/30 pl-2 py-0.5">Impact: {g.impact}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Assessment */}
      <div className="p-5 bg-blue-950/20 border border-blue-500/15 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600"></div>
        <h4 className="text-[11px] tracking-widest uppercase text-blue-400 font-bold mb-4 flex items-center gap-2 ml-1">
          <LinkIcon className="w-4 h-4" /> Strategic Assessment
        </h4>
        <ul className="space-y-3 ml-1">
            {(summary.strategic_assessment || []).map((s, i) => (
              <li key={i} className="flex flex-col gap-1.5 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 group hover:bg-blue-500/10 transition-colors">
                <span className="text-[14px] text-blue-100 font-bold tracking-tight">Action: {s.recommendation}</span>
                <span className="text-[13px] text-blue-200/70 leading-relaxed">{s.reason}</span>
              </li>
            ))}
        </ul>
      </div>
      
      {/* Readiness */}
      {summary.readiness && (
        <div className="p-5 bg-emerald-950/20 border border-emerald-500/15 rounded-2xl relative overflow-hidden flex flex-col gap-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
          <h4 className="text-[11px] tracking-widest uppercase text-emerald-400 font-bold mb-2 flex items-center gap-2 ml-1">
            <CheckCircle2 className="w-4 h-4" /> Investigation Readiness: <span className="text-white text-[14px] bg-emerald-500/20 px-2 py-0.5 rounded-lg ml-2">{summary.readiness.score}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 ml-1">
             <div className="text-[13px] text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5"><span className="text-emerald-400 font-bold block mb-1">Strengths</span> {summary.readiness.strengths}</div>
             <div className="text-[13px] text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5"><span className="text-red-400 font-bold block mb-1">Weaknesses</span> {summary.readiness.weaknesses}</div>
          </div>
          <div className="text-[13px] text-blue-300 mt-2 font-bold ml-1 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 flex items-center gap-2">
            <span className="uppercase text-[10px] tracking-wider text-blue-400/80">Next Action:</span> {summary.readiness.next_action}
          </div>
        </div>
      )}

    </div>
  );
}
