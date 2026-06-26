import { Share2, Activity, Server, Clock, Database, BrainCircuit, ActivitySquare } from "lucide-react";
import { getDashboardMetrics } from "@/api/dashboard.api";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function CaseDashboard({ caseId }: { caseId: string }) {
  const { data: metrics, isLoading: loading } = useQuery({
    queryKey: ['dashboard', caseId],
    queryFn: () => getDashboardMetrics(caseId),
    refetchInterval: 3000,
  });

  if (loading || !metrics) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-6 p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass w-full max-w-md">
           <div className="relative flex items-center justify-center">
             <div className="absolute w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
             <Activity className="h-6 w-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
           </div>
           <div className="text-center space-y-2">
             <p className="text-sm font-bold text-white tracking-widest uppercase">Connecting to Copilot</p>
             <p className="text-[10px] text-white/40 tracking-wider font-mono">Synchronizing workspace data...</p>
           </div>
        </div>
      </div>
    );
  }

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
              <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-3 font-bold">Investigation Pipeline</h4>
              
              <div className="space-y-2">
                 <PipelineStep 
                    label="Evidence Processing" 
                    isDone={metrics.total_evidence > 0 && metrics.processed_evidence === metrics.total_evidence} 
                    isPending={metrics.total_evidence === 0} 
                    isActive={metrics.total_evidence > 0 && metrics.processed_evidence < metrics.total_evidence} 
                 />
                 <PipelineStep 
                    label="Entity Extraction" 
                    isDone={metrics.entities_count > 0} 
                    isPending={metrics.entities_count === 0 && metrics.processed_evidence < metrics.total_evidence}
                    isActive={metrics.total_evidence > 0 && metrics.processed_evidence === metrics.total_evidence && metrics.entities_count === 0}
                 />
                 <PipelineStep 
                    label="Timeline Generation" 
                    isDone={metrics.total_events > 0} 
                    isPending={metrics.total_events === 0 && metrics.entities_count === 0}
                    isActive={metrics.entities_count > 0 && metrics.total_events === 0}
                 />
                 <PipelineStep 
                    label="Knowledge Graph" 
                    isDone={metrics.total_nodes > 0} 
                    isPending={metrics.total_nodes === 0 && metrics.total_events === 0}
                    isActive={metrics.total_events > 0 && metrics.total_nodes === 0}
                 />
                 <PipelineStep 
                    label="Gap Analysis" 
                    isDone={metrics.readiness_score > 0 || metrics.gaps_count > 0} 
                    isPending={metrics.readiness_score === 0}
                    isActive={metrics.total_nodes > 0 && metrics.readiness_score === 0}
                 />
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

function IntelligenceRow({ label, count, color, bg, border }: any) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-xl border ${border} ${bg}`}>
       <span className="text-xs font-semibold text-white/70">{label}</span>
       <span className={`text-sm font-bold ${color}`}>{count}</span>
    </div>
  );
}

function PipelineStep({ label, isDone, isActive, isPending }: { label: string, isDone: boolean, isActive: boolean, isPending: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center justify-center w-4 h-4 shrink-0">
        {isDone && <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-[8px]">✓</div>}
        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        {isPending && <div className="w-2 h-2 rounded-full bg-white/20" />}
      </div>
      <span className={`font-medium ${isDone ? 'text-emerald-400/80' : isActive ? 'text-white' : 'text-white/30'}`}>
        {label}
      </span>
      {isActive && <span className="ml-auto text-[10px] font-mono text-blue-400 animate-pulse">Running...</span>}
      {isPending && <span className="ml-auto text-[10px] font-mono text-white/30">Pending</span>}
    </div>
  );
}
