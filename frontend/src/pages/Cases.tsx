import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RecentCasesTable } from "@/components/dashboard/RecentCasesTable";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { createDemoCase } from "@/api/demo.api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { toast } from "sonner";

export default function Cases() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDemo = async () => {
    setLoading(true);
    toast.loading("Generating Demo Case...");
    try {
      await createDemoCase();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cases.all });
      toast.dismiss();
      toast.success("Demo Case Generated Successfully");
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Failed to generate Demo Case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="Module 02"
          title="Cases"
          description="Open, archived, and assigned case files across all units."
        />
        <Button onClick={handleDemo} disabled={loading} className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium border border-yellow-400/50 shadow-[0_0_15px_rgba(202,138,4,0.3)] gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Demo Case (Judge View)
        </Button>
      </div>
      <RecentCasesTable />
    </div>
  );
}
