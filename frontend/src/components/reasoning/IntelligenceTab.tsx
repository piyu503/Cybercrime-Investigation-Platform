import { useIntelligence, useGenerateIntelligence } from "@/hooks/useReasoning";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, Activity } from "lucide-react";
import { ReadinessGauge } from "./ReadinessGauge";
import { ContradictionCard } from "./ContradictionCard";
import { GapCard } from "./GapCard";
import { RecommendationCard } from "./RecommendationCard";
import { InvestigationSummary } from "./InvestigationSummary";

export function IntelligenceTab({ caseId }: { caseId: string }) {
  const { data: intelligence, isLoading } = useIntelligence(caseId);
  const { mutate: generateIntelligence, isPending } = useGenerateIntelligence();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin mb-4" />
        <p className="text-sm font-mono tracking-widest uppercase">Fetching Intelligence Platform...</p>
      </div>
    );
  }

  if (!intelligence || !intelligence.readiness) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">Investigation Intelligence</h3>
        <p className="text-sm text-slate-400 max-w-md mb-8">
          Run the deterministic reasoning engines to identify gaps, contradictions, and calculate investigation readiness.
        </p>
        <Button 
          onClick={() => generateIntelligence(caseId)}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
          {isPending ? "Running Engines..." : "Run Intelligence Pipeline"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Top Row: Gauge & Exec Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReadinessGauge readiness={intelligence.readiness} />
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center">
           {intelligence.summary ? (
             <InvestigationSummary summary={intelligence.summary} />
           ) : (
             <div className="h-full border border-white/10 border-dashed rounded flex flex-col items-center justify-center text-slate-500 p-8">
               <span className="text-xs uppercase tracking-widest font-mono">Summary Generating...</span>
             </div>
           )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Contradictions & Gaps */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase">Detected Contradictions</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                {intelligence.contradictions.length}
              </span>
            </div>
            
            {intelligence.contradictions.length === 0 ? (
              <div className="p-4 border border-white/5 border-dashed rounded text-center text-slate-500 text-xs">
                No contradictions detected in evidence.
              </div>
            ) : (
              <div className="space-y-3">
                {intelligence.contradictions.map((c, i) => <ContradictionCard key={i} contradiction={c} />)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase">Investigation Gaps</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                {intelligence.gaps.length}
              </span>
            </div>
            
            {intelligence.gaps.length === 0 ? (
              <div className="p-4 border border-white/5 border-dashed rounded text-center text-slate-500 text-xs">
                No critical gaps identified.
              </div>
            ) : (
              <div className="space-y-3">
                {intelligence.gaps.map((g, i) => <GapCard key={i} gap={g} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold tracking-widest text-emerald-400 uppercase">AI Recommendations</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-900/30 text-[10px] text-emerald-500 font-mono">
              {intelligence.recommendations.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {intelligence.recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
