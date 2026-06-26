import { useEffect, useState } from "react";
import { Share2, Activity, Server, Clock, Database, BrainCircuit, ActivitySquare } from "lucide-react";
import { DashboardMetrics, getDashboardMetrics } from "@/api/dashboard.api";
import { motion } from "framer-motion";

export default function CaseDashboard({ caseId }: { caseId: string }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await getDashboardMetrics(caseId);
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [caseId]);

  if (loading || !metrics) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass">
           <Activity className="h-8 w-8 animate-pulse text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
           <p className="text-sm text-white/50 tracking-widest uppercase">Initializing Uplink...</p>
        </div>
      </div>
    );
  }

  const processingProgress = metrics.total_evidence > 0 ? Math.round((metrics.processed_evidence / metrics.total_evidence) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <MetricBox title="Extracted Key Entities" value={metrics.entities_count} icon={<Database className="w-5 h-5 text-purple-400" />} delay={0.1} />
        <MetricBox title="Timeline Events" value={metrics.total_events} icon={<Clock className="w-5 h-5 text-indigo-400" />} delay={0.2} />
        <MetricBox title="Graph Nodes" value={metrics.total_nodes} icon={<Share2 className="w-5 h-5 text-pink-400" />} delay={0.3} />
      </div>

      {/* Middle Row: System Health & Intelligence Engine */}
      <div className="flex flex-col gap-6">
        
        {/* System Health */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glass backdrop-blur-md relative overflow-hidden flex flex-col min-h-[220px]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px]"></div>
           <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5 relative z-10">
              <h3 className="text-xs font-semibold tracking-wider text-white/60 uppercase flex items-center gap-2">
                 <Server className="w-4 h-4 text-emerald-400" /> System Health
              </h3>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
           </div>
           
           <div className="space-y-3 relative z-10 flex-1">
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02]">
                 <span className="text-sm text-white/60">Engine Status</span>
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Online</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02]">
                 <span className="text-sm text-white/60">Compute Time</span>
                 <span className="font-mono text-sm text-white font-medium">{metrics.processing_time_seconds}s</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02]">
                 <span className="text-sm text-white/60">Inv. Status</span>
                 <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">{metrics.investigation_status}</span>
              </div>
           </div>

           <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
              <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-bold">Processing Queue</h4>
              <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-white/70">Evidence Processed</span>
                    <span className="text-white">{metrics.processed_evidence} / {metrics.total_evidence}</span>
                 </div>
                 <div className="w-full bg-black/40 rounded-full h-1.5 shadow-inner">
                    <div className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${processingProgress}%` }}></div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Intelligence Readiness */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glass backdrop-blur-md relative overflow-hidden flex flex-col">
           <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]"></div>
           <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5 relative z-10">
              <h3 className="text-xs font-semibold tracking-wider text-white/60 uppercase flex items-center gap-2">
                 <BrainCircuit className="w-4 h-4 text-purple-400" /> Intelligence Engine
              </h3>
           </div>
           
           <div className="flex items-center gap-6 relative z-10">
              <div className="flex flex-col items-center justify-center border-r border-white/5 pr-6">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 text-center">Score</span>
                 <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {metrics.readiness_score}<span className="text-white/30 text-2xl">%</span>
                 </div>
              </div>
              
              <div className="flex-1 space-y-2">
                 <IntelligenceRow label="Recs" count={metrics.recommendations_count} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                 <IntelligenceRow label="Conflicts" count={metrics.contradictions_count} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" />
                 <IntelligenceRow label="Gaps" count={metrics.gaps_count} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
              </div>
           </div>
        </motion.div>
      </div>

      {/* Bottom Row: Live Operations Stream */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glass flex-1 flex flex-col backdrop-blur-md min-h-[200px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
           <h3 className="text-xs font-semibold tracking-wider text-white/60 uppercase flex items-center gap-2">
              <ActivitySquare className="w-4 h-4 text-blue-400" /> Live Operations Stream
           </h3>
        </div>
        <ul className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin">
          {metrics.recent_activity.map((log, i) => (
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} key={log._id} className="text-sm flex flex-col gap-1 border-l-2 border-blue-500 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-r-lg pl-3 py-2 pr-2">
              <div className="flex justify-between items-center">
                 <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">{log.action}</span>
                 <span className="text-white/40 font-mono text-[10px]">
                   {new Date(log.timestamp).toISOString().split('T')[1].substring(0,8)} UTC
                 </span>
              </div>
              <span className="text-white/80 text-xs">{log.details}</span>
            </motion.li>
          ))}
          {metrics.recent_activity.length === 0 && (
            <li className="text-sm text-white/40 italic p-4 text-center">Awaiting uplink...</li>
          )}
        </ul>
      </motion.div>

    </div>
  );
}

function MetricBox({ title, value, icon, delay }: { title: string, value: string | number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col shadow-glass backdrop-blur-md relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-center justify-between mb-2 relative z-10">
         <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{title}</span>
         <div className="p-1 bg-white/5 rounded-lg border border-white/10">
           {icon}
         </div>
      </div>
      <span className="text-3xl font-bold text-white tracking-tight relative z-10">{value}</span>
    </motion.div>
  );
}

function IntelligenceRow({ label, count, color, bg, border }: { label: string, count: number, color: string, bg: string, border: string }) {
   return (
      <div className={`flex justify-between items-center px-3 py-1.5 rounded-lg border ${bg} ${border}`}>
         <span className={`text-[10px] font-bold tracking-wider uppercase ${color}`}>{label}</span>
         <span className={`font-mono text-xs font-bold ${color}`}>{count}</span>
      </div>
   );
}
