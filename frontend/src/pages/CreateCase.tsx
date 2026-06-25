import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, FolderPlus } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CaseForm from "@/components/cases/CaseForm";
import { useCreateCase } from "@/hooks/useCase";

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CreateCase() {
  const navigate = useNavigate();
  const mutation = useCreateCase();

  return (
    <div className="min-h-full p-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-white/40">
        <Link to="/cases" className="hover:text-white/70 transition-colors">Cases</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white/60">New Case</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10">
          <FolderPlus className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Open New Case</h1>
          <p className="text-xs text-white/40 mt-0.5">
            Create a new investigation file in the system
          </p>
        </div>
      </div>

      <Separator className="bg-white/8" />

      {/* Form Card */}
      <Card className="bg-[#0d0f14] border border-white/10 max-w-2xl rounded-lg shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Case Information</CardTitle>
          <CardDescription className="text-xs text-white/40">
            All fields are required. The case will be accessible immediately after creation.
          </CardDescription>
        </CardHeader>

        <Separator className="bg-white/8" />

        <CardContent className="pt-5">
          <CaseForm
            onSubmit={(values) => mutation.mutate(values, { 
              onSuccess: (data) => {
                toast.success("Case created successfully");
                navigate(`/cases/${data.case_id}`);
              },
              onError: () => {
                toast.error("Failed to create case");
              }
            })}
            isLoading={mutation.isPending}
            error={
              mutation.isError
                ? "Failed to create case. Check your connection and try again."
                : undefined
            }
          />
        </CardContent>
      </Card>

    </div>
  );
}
