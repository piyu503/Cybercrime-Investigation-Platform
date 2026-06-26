import { useIntelligence, useGenerateIntelligence } from "@/hooks/useReasoning";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, Activity } from "lucide-react";
import { ReadinessGauge } from "./ReadinessGauge";
import { ContradictionCard } from "./ContradictionCard";
import { GapCard } from "./GapCard";
import { RecommendationCard } from "./RecommendationCard";
import { InvestigationSummary } from "./InvestigationSummary";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function IntelligenceTab({ caseId }: { caseId: string }) {
  const { data: intelligence, isLoading } = useIntelligence(caseId);
  const { mutate: generateIntelligence, isPending } = useGenerateIntelligence();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass"
        >
           <Loader2 className="h-8 w-8 animate-spin text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
           <p className="text-sm text-white/50 tracking-widest uppercase">Fetching Intelligence Platform...</p>
        </motion.div>
      </div>
    );
  }

  if (!intelligence || !intelligence.readiness) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        >
          <BrainCircuit className="w-10 h-10 text-purple-400" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold tracking-tight text-white mb-2"
        >
          Investigation Intelligence
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-white/50 max-w-md mb-8 leading-relaxed"
        >
          Run deterministic reasoning engines to identify gaps, contradictions, and calculate investigation readiness.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={() => {
              toast.loading("Running Intelligence Pipeline...");
              generateIntelligence(caseId, {
                onSuccess: () => {
                  toast.dismiss();
                  toast.success("Intelligence Pipeline Complete");
                },
                onError: () => {
                  toast.dismiss();
                  toast.error("Pipeline Failed");
                }
              });
            }}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-xl h-12 px-8 transition-all hover:scale-105 active:scale-95"
          >
            {isPending ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Activity className="w-5 h-5 mr-3" />}
            {isPending ? "Running Engines..." : "Run Pipeline"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in overflow-y-auto scrollbar-thin">
      
      {/* Top Row: Gauge & Exec Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-1">
          <ReadinessGauge readiness={intelligence.readiness} />
        </div>
        <div className="xl:col-span-2 flex flex-col justify-center">
           {intelligence.summary ? (
             <InvestigationSummary summary={intelligence.summary} />
           ) : (
             <div className="h-full border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-white/30 p-8 bg-white/[0.02]">
               <span className="text-xs uppercase tracking-widest font-semibold">Generating Summary...</span>
             </div>
           )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        
        {/* Left Column: Contradictions & Gaps */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">Detected Contradictions</h3>
              <span className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold shadow-inner">
                {intelligence.contradictions.length}
              </span>
            </div>
            
            {intelligence.contradictions.length === 0 ? (
              <div className="p-6 border border-white/5 border-dashed rounded-2xl text-center text-white/30 text-sm font-medium bg-white/[0.02]">
                No contradictions detected.
              </div>
            ) : (
              <div className="space-y-3">
                {intelligence.contradictions.map((c, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i}>
                    <ContradictionCard contradiction={c} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">Investigation Gaps</h3>
              <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-bold shadow-inner">
                {intelligence.gaps.length}
              </span>
            </div>
            
            {intelligence.gaps.length === 0 ? (
              <div className="p-6 border border-white/5 border-dashed rounded-2xl text-center text-white/30 text-sm font-medium bg-white/[0.02]">
                No critical gaps identified.
              </div>
            ) : (
              <div className="space-y-3">
                {intelligence.gaps.map((g, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i}>
                    <GapCard gap={g} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-semibold tracking-wide text-emerald-400 uppercase">AI Recommendations</h3>
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold shadow-inner">
              {intelligence.recommendations.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {intelligence.recommendations.map((rec, i) => (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i}>
                <RecommendationCard rec={rec} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
