import { useParams, Link } from "react-router-dom";
import { ChevronRight, Folder, RefreshCw, AlertTriangle, FileSearch, GitMerge, Clock, Zap } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CaseDetailPanel from "@/components/cases/CaseDetailPanel";
import EvidenceTable from "@/components/cases/EvidenceTable";
import { useCase } from "@/hooks/useCase";
import { useProcessEvidence } from "@/hooks/useProcessEvidence";

import KnowledgeGraphTab from "@/components/reasoning/KnowledgeGraphTab";
import TimelineTab from "@/components/reasoning/TimelineTab";
import { IntelligenceTab } from "@/components/reasoning/IntelligenceTab";
import CaseDashboard from "@/components/cases/CaseDashboard";
import GlobalSearch from "@/components/cases/GlobalSearch";
import AuditTrail from "@/components/cases/AuditTrail";
import ReportPreview from "@/components/cases/ReportPreview";

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-64 rounded bg-white/8" />
      <div className="h-4 w-96 rounded bg-white/5" />
      <div className="grid grid-cols-4 gap-3 pt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-md bg-white/5 border border-white/8" />
        ))}
      </div>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/70">Failed to load case</p>
        <p className="text-xs text-white/35 mt-1">
          The case may not exist or the server is unavailable.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 gap-2 text-xs"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CaseDetail() {
  const { case_id } = useParams<{ case_id: string }>();

  const {
    data: caseData,
    isLoading,
    isError,
    refetch,
  } = useCase(case_id || "");

  const processMutation = useProcessEvidence(case_id || "");

  return (
    <div className="min-h-full p-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-white/40">
        <Link to="/cases" className="hover:text-white/70 transition-colors">Cases</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white/60 truncate max-w-[240px]">
          {isLoading ? "Loading…" : (caseData?.case_name ?? case_id)}
        </span>
      </nav>

      {/* Page Title */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10">
          <Folder className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Investigation Workspace</h1>
          <p className="text-xs text-white/40 mt-0.5">
            Full investigation record, evidence processing, and intelligence dashboard
          </p>
        </div>
      </div>

      <Separator className="bg-white/8" />

      {isLoading && <DetailSkeleton />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {caseData && (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 bg-black/40 border border-white/10 h-auto p-1 flex flex-wrap gap-1 w-full justify-start">
            <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <Zap className="h-3.5 w-3.5 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <FileSearch className="h-3.5 w-3.5 mr-2" /> Evidence
            </TabsTrigger>
            <TabsTrigger value="graph" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <GitMerge className="h-3.5 w-3.5 mr-2" /> Knowledge Graph
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <Clock className="h-3.5 w-3.5 mr-2" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <AlertTriangle className="h-3.5 w-3.5 mr-2" /> Analysis
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <FileSearch className="h-3.5 w-3.5 mr-2" /> Search
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <Clock className="h-3.5 w-3.5 mr-2" /> Audit Trail
            </TabsTrigger>
            <TabsTrigger value="report" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white flex-grow-0">
              <Folder className="h-3.5 w-3.5 mr-2" /> Court Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <CaseDashboard caseId={case_id!} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* ── Case Overview Card ─────────────────────────────────────────── */}
            <Card className="bg-[#0d0f14] border border-white/10 rounded-lg shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white">Case Overview</CardTitle>
              </CardHeader>
              <Separator className="bg-white/8" />
              <CardContent className="pt-5">
                <CaseDetailPanel caseData={caseData} />
              </CardContent>
            </Card>

            {/* ── Evidence Card ──────────────────────────────────────────────── */}
            <Card className="bg-[#0d0f14] border border-white/10 rounded-lg shadow-none">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-white">Evidence Files</CardTitle>
                  <p className="text-xs text-white/40 mt-0.5">
                    Digital evidence attached to this case
                  </p>
                </div>
                {caseData.files.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.loading("Processing Evidence...");
                        processMutation.mutate(undefined, {
                          onSuccess: () => {
                            toast.dismiss();
                            toast.success("Evidence processed successfully");
                            refetch();
                          },
                          onError: () => {
                            toast.dismiss();
                            toast.error("Failed to process evidence");
                          }
                        });
                      }}
                      disabled={processMutation.isPending}
                      className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs h-8 px-4"
                    >
                      {processMutation.isPending ? "Processing..." : "Process Evidence"}
                    </Button>
                    <Link to={`/cases/${case_id}/upload`}>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-4"
                      >
                        Upload Evidence
                      </Button>
                    </Link>
                  </div>
                )}
              </CardHeader>
              <Separator className="bg-white/8" />
              <CardContent className="pt-5">
                <EvidenceTable files={caseData.files} caseId={case_id!} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
             <KnowledgeGraphTab caseId={case_id!} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
             <TimelineTab caseId={case_id!} />
          </TabsContent>

          <TabsContent value="intelligence" className="mt-0">
             <IntelligenceTab caseId={case_id!} />
          </TabsContent>

          <TabsContent value="search" className="mt-0">
            <GlobalSearch caseId={case_id!} />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <AuditTrail caseId={case_id!} />
          </TabsContent>

          <TabsContent value="report" className="mt-0">
            <ReportPreview caseId={case_id!} />
          </TabsContent>

        </Tabs>
      )}
    </div>
  );
}
