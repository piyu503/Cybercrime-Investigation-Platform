import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RecentCasesTable } from "@/components/dashboard/RecentCasesTable";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, CheckCircle } from "lucide-react";
import { createDemoCase } from "@/api/demo.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PIPELINE_STEPS = [
  "Initializing project parameters...",
  "Running OCR and Text Extraction...",
  "Classifying evidence and extracting metadata...",
  "Extracting Entities and Locations...",
  "Generating chronological timeline...",
  "Building knowledge graph...",
  "Running Investigation Intelligence engine...",
  "Finalizing Court Report..."
];

export default function Cases() {
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [sampleCaseId, setSampleCaseId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showProgress && progressStep < PIPELINE_STEPS.length) {
      timer = setTimeout(() => {
        setProgressStep(p => p + 1);
      }, 800); // 800ms per step
    } else if (showProgress && progressStep >= PIPELINE_STEPS.length) {
      // Done
      setTimeout(() => {
        setShowProgress(false);
        if (sampleCaseId) {
          navigate(`/cases/${sampleCaseId}`);
        }
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [showProgress, progressStep, sampleCaseId, navigate]);

  const handleGenerateSample = async () => {
    setLoading(true);
    setProgressStep(0);
    setShowProgress(true);
    
    try {
      const result = await createDemoCase();
      setSampleCaseId(result.case_id);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cases.all });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate sample case");
      setShowProgress(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="Module 02"
          title="Cases"
          description="Open, archived, and assigned case files across all units."
        />
        <Button onClick={handleGenerateSample} disabled={loading} className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium border border-yellow-400/50 shadow-[0_0_15px_rgba(202,138,4,0.3)] gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Generate Sample Investigation
        </Button>
      </div>
      <RecentCasesTable />
      
      {showProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0c10] border border-white/10 rounded-xl p-8 w-[500px] shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Running Automated Workflow</h2>
                <p className="text-xs text-white/50">Processing sample digital evidence</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {idx < progressStep ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : idx === progressStep ? (
                    <Loader2 className="h-4 w-4 text-yellow-400 animate-spin shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />
                  )}
                  <span className={`text-sm transition-colors ${idx < progressStep ? 'text-white/60' : idx === progressStep ? 'text-white' : 'text-white/30'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300 ease-out"
                  style={{ width: `${(progressStep / PIPELINE_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
