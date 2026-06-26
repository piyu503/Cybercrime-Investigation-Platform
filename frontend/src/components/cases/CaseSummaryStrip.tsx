import { useEffect, useState } from "react";
import { Case } from "@/types/case.types";
import { DashboardMetrics, getDashboardMetrics } from "@/api/dashboard.api";
import { Database, Clock, Share2, CalendarDays, FileStack } from "lucide-react";
import { motion } from "framer-motion";

export function CaseSummaryStrip({ caseData }: { caseData: Case }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await getDashboardMetrics(caseData._id);
        setMetrics(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMetrics();
  }, [caseData._id]);

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl shadow-glass backdrop-blur-md">
      {/* Context info */}
      <div className="flex items-center gap-6 pr-6 border-r border-white/10">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/40" />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Created</span>
            <span className="text-xs font-medium text-white/80">{new Date(caseData.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FileStack className="h-4 w-4 text-white/40" />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Evidence Files</span>
            <span className="text-xs font-bold text-blue-400">{caseData.files.length}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics ? (
        <div className="flex items-center gap-6 flex-1 justify-around lg:justify-start">
          <MetricItem icon={<Database className="w-4 h-4 text-purple-400" />} label="Key Entities" value={metrics.entities_count} />
          <MetricItem icon={<Clock className="w-4 h-4 text-indigo-400" />} label="Events" value={metrics.total_events} />
          <MetricItem icon={<Share2 className="w-4 h-4 text-pink-400" />} label="Graph Nodes" value={metrics.total_nodes} />
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-2 text-xs text-white/40">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Loading metrics...
        </div>
      )}
    </div>
  );
}

function MetricItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
      <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{label}</span>
        <span className="text-lg font-bold text-white leading-none">{value}</span>
      </div>
    </motion.div>
  );
}
