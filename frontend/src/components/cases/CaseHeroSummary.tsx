import { useIntelligence } from "@/hooks/useReasoning";
import { InvestigationSummary } from "@/components/reasoning/InvestigationSummary";
import { BrainCircuit } from "lucide-react";

export function CaseHeroSummary({ caseId }: { caseId: string }) {
  const { data: intelligence, isLoading } = useIntelligence(caseId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl animate-pulse shadow-glass backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <BrainCircuit className="w-4 h-4 text-white/30" />
        </div>
        <div className="flex flex-col gap-2 flex-1">
           <div className="h-3 w-1/4 bg-white/10 rounded" />
           <div className="h-2 w-3/4 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!intelligence || !intelligence.summary) {
    return null;
  }

  return (
    <div className="w-full">
      <InvestigationSummary summary={intelligence.summary} />
    </div>
  );
}
