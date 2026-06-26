import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Folder, RefreshCw, AlertTriangle, Sparkles, UploadCloud, Bot, History, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useCase } from "@/hooks/useCase";
import { useProcessEvidence } from "@/hooks/useProcessEvidence";

import { CaseSummaryStrip } from "@/components/cases/CaseSummaryStrip";
import { CaseHeroSummary } from "@/components/cases/CaseHeroSummary";
import KnowledgeGraphTab from "@/components/reasoning/KnowledgeGraphTab";
import TimelineTab from "@/components/reasoning/TimelineTab";
import EvidenceTable from "@/components/cases/EvidenceTable";
import CaseDashboard from "@/components/cases/CaseDashboard";
import GlobalSearch from "@/components/cases/GlobalSearch";
import AuditTrail from "@/components/cases/AuditTrail";
import ReportPreview from "@/components/cases/ReportPreview";
import CopilotTab from "@/components/copilot/CopilotTab";
import { IntelligenceTab } from "@/components/reasoning/IntelligenceTab";

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 w-64 rounded-lg bg-white/5" />
      <div className="h-4 w-96 rounded-md bg-white/5" />
      <div className="grid grid-cols-4 gap-4 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/10" />
        ))}
      </div>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Failed to load project</p>
        <p className="text-sm text-white/50 mt-1 max-w-sm">
          The project may not exist or the server is unavailable.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-white/10 text-white/60 hover:text-white hover:bg-white/10 gap-2 mt-4"
      >
        <RefreshCw className="h-4 w-4" />
        Retry Connection
      </Button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CaseDetail() {
  const { case_id } = useParams<{ case_id: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "evidence";

  const {
    data: caseData,
    isLoading,
    isError,
    refetch,
  } = useCase(case_id || "");

  const { mutate, isPending, startPolling } = useProcessEvidence(case_id || "");
  const [isPolling, setIsPolling] = useState(false);

  if (isLoading) return <div className="h-[calc(100vh-var(--topbar-height))] flex flex-col"><DetailSkeleton /></div>;
  if (isError) return <div className="h-[calc(100vh-var(--topbar-height))]"><ErrorState onRetry={() => refetch()} /></div>;
  if (!caseData) return null;

  return (
    <div className="h-full flex-1 overflow-y-auto scrollbar-thin flex flex-col font-sans animate-fade-in relative -mt-4 pb-12">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ─── Dense Action Bar ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between px-2 pb-4 pt-2 gap-4 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-glass flex-shrink-0">
            <Folder className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {caseData.case_name || "Untitled Project"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-white/40">#{String(case_id).slice(-8).toUpperCase()}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-xs font-medium text-white/40">Investigation Command Center</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            size="default"
            onClick={() => {
              const toastId = toast.loading("🔬 AI Engine running... Gemma 4 is analysing evidence. This may take a few minutes.");
              setIsPolling(true);
              mutate(undefined, {
                onSuccess: () => {
                  // Backend accepted — now poll until processing_status = completed
                  startPolling(
                    () => {
                      setIsPolling(false);
                      toast.dismiss(toastId);
                      toast.success("✅ Evidence processed! Dashboard updated.");
                      refetch();
                    },
                    () => {
                      setIsPolling(false);
                      toast.dismiss(toastId);
                      toast.error("❌ Processing failed. Check backend logs.");
                    }
                  );
                },
                onError: (err) => {
                  setIsPolling(false);
                  toast.dismiss(toastId);
                  toast.error(`Failed to start AI Engine: ${err.message}`);
                }
              });
            }}
            disabled={isPending || isPolling}
            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] gap-2 rounded-xl"
          >
            <Sparkles className="h-4 w-4" />
            {isPending ? "Starting..." : isPolling ? "Processing..." : "Run AI Engine"}
          </Button>
          <Link to={`/cases/${case_id}/upload`}>
            <Button
              size="default"
              className="bg-white hover:bg-white/90 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] gap-2 rounded-xl"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Evidence
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="default" className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] gap-2 rounded-xl ml-2">
                 <Bot className="h-4 w-4" /> AI Copilot
              </Button>
            </SheetTrigger>
            <SheetContent className="!left-auto right-0 !border-l !border-r-0 data-[state=open]:slide-in-from-right w-full sm:max-w-md lg:max-w-lg p-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border-white/10 shadow-2xl">
                <Tabs defaultValue="copilot" className="w-full h-full flex flex-col min-h-0">
                  <div className="px-2 pt-2 bg-white/[0.02] border-b border-white/5 flex-shrink-0">
                    <TabsList className="bg-transparent h-10 p-0 flex w-full border-0 gap-2">
                      <TabsTrigger value="copilot" className="flex-1 rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-white/50 text-sm font-medium transition-all">
                        Agent
                      </TabsTrigger>
                      <TabsTrigger value="intelligence" className="flex-1 rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-white/50 text-sm font-medium transition-all">
                        Analysis
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex-1 overflow-hidden relative bg-black/20">
                    <TabsContent value="copilot" className="h-full m-0 data-[state=inactive]:hidden flex flex-col min-h-0">
                      <CopilotTab caseId={case_id!} />
                    </TabsContent>
                    <TabsContent value="intelligence" className="h-full m-0 data-[state=inactive]:hidden p-4 overflow-y-auto scrollbar-thin">
                      <IntelligenceTab caseId={case_id!} />
                    </TabsContent>
                  </div>
                </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ─── Top Level: Context & Metrics Strip ─── */}
      <div className="px-2 mb-6 relative z-10">
         <CaseSummaryStrip caseData={caseData} />
      </div>

      {/* ─── Hero Level: Investigation Summary & Knowledge Graph ─── */}
      <div className="px-2 mb-6 relative z-10 space-y-4">
         <CaseHeroSummary caseId={case_id!} />
         <div className="w-full h-[55vh] min-h-[500px] bg-black/40 border border-white/10 rounded-2xl shadow-glass overflow-hidden flex flex-col">
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-400" /> Interactive Knowledge Graph
               </h3>
               <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase font-bold tracking-wider">Scroll to zoom</span>
            </div>
            <div className="flex-1 relative">
               <KnowledgeGraphTab caseId={case_id!} />
            </div>
         </div>
      </div>

      {/* ─── Lower Level: Timeline, Evidence, and Utilities ─── */}
      <div className="px-2 grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
         
         {/* Left Side: Timeline */}
         <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-glass flex flex-col h-[600px] overflow-hidden">
               <div className="p-4 bg-white/[0.02] border-b border-white/5">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" /> Chronological Timeline
                 </h3>
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
                  <TimelineTab caseId={case_id!} />
               </div>
            </div>
         </div>

         {/* Right Side: Evidence & Utilities Tabs */}
         <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-glass flex flex-col h-[600px] overflow-hidden">
               <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
                 <div className="px-2 pt-2 bg-white/[0.02] border-b border-white/5 overflow-x-auto scrollbar-none">
                   <TabsList className="bg-transparent h-10 p-0 flex w-max border-0 justify-start gap-2">
                     <TabsTrigger value="evidence" className="rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 text-sm font-medium capitalize transition-all">Evidence</TabsTrigger>
                     <TabsTrigger value="dashboard" className="rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 text-sm font-medium capitalize transition-all">Metrics</TabsTrigger>
                     <TabsTrigger value="search" className="rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 text-sm font-medium capitalize transition-all">Search</TabsTrigger>
                     <TabsTrigger value="audit" className="rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 text-sm font-medium capitalize transition-all">Audit</TabsTrigger>
                     <TabsTrigger value="report" className="rounded-lg rounded-b-none px-4 py-2 border-0 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 text-sm font-medium capitalize transition-all">Report</TabsTrigger>
                   </TabsList>
                 </div>
                 <div className="flex-1 overflow-y-auto scrollbar-thin relative bg-black/20">
                   <TabsContent value="evidence" className="h-full m-0 data-[state=inactive]:hidden p-4 flex flex-col flex-1"><EvidenceTable files={caseData.files} caseId={case_id!} /></TabsContent>
                   <TabsContent value="dashboard" className="h-full m-0 data-[state=inactive]:hidden p-4 flex flex-col flex-1"><CaseDashboard caseId={case_id!} /></TabsContent>
                   <TabsContent value="search" className="h-full m-0 data-[state=inactive]:hidden p-4 flex flex-col flex-1"><GlobalSearch caseId={case_id!} /></TabsContent>
                   <TabsContent value="audit" className="h-full m-0 data-[state=inactive]:hidden p-4 flex flex-col flex-1"><AuditTrail caseId={case_id!} /></TabsContent>
                   <TabsContent value="report" className="h-full m-0 data-[state=inactive]:hidden p-4 flex flex-col flex-1"><ReportPreview caseId={case_id!} /></TabsContent>
                 </div>
               </Tabs>
            </div>
         </div>

      </div>
    </div>
  );
}
