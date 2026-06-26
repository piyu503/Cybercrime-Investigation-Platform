import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useCases } from "../../hooks/useCases";
import { getAuditLogs, AuditLog } from "../../api/audit.api";
import { formatDistanceToNow } from "date-fns";

const typeStyles: Record<string, { dot: string; dotGlow: string; label: string; labelColor: string }> = {
  "Case Created":  { dot: "bg-emerald-500", dotGlow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]", label: "NEW",      labelColor: "text-emerald-400" },
  "Evidence Uploaded": { dot: "bg-amber-400",   dotGlow: "shadow-[0_0_8px_rgba(251,191,36,0.5)]", label: "UPLOAD",   labelColor: "text-amber-400"   },
  "Evidence Processed":  { dot: "bg-blue-400",    dotGlow: "shadow-[0_0_8px_rgba(96,165,250,0.5)]", label: "AI ENGINE",   labelColor: "text-blue-400"    },
  "Intelligence Generated": { dot: "bg-purple-400", dotGlow: "shadow-[0_0_8px_rgba(168,85,247,0.5)]", label: "INTELL", labelColor: "text-purple-400" },
  "System":        { dot: "bg-white/50",    dotGlow: "shadow-none", label: "SYSTEM",   labelColor: "text-white/50"   },
};

export function ActivityFeed() {
  const { data: cases } = useCases();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllLogs() {
      if (!cases || cases.length === 0) return;
      setLoading(true);
      try {
        const recentCases = [...cases].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
        const logsPromises = recentCases.map(c => getAuditLogs(c._id).catch(() => [] as AuditLog[]));
        const results = await Promise.all(logsPromises);
        
        let allLogs = results.flat();
        allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(allLogs.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllLogs();
  }, [cases]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-full backdrop-blur-xl shadow-glass overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 ring-1 ring-white/10">
             <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            Activity Stream
          </h2>
        </div>
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2">
          {loading ? (
            <div className="flex justify-center py-8">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4 opacity-50">
               <Activity className="w-6 h-6 mb-2 text-white/30" />
               <p className="text-xs text-white/40">No recent activity detected.</p>
            </div>
          ) : logs.map((item, i) => {
            const s = typeStyles[item.action] || typeStyles["System"];
            const timeAgo = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true });
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={item._id} 
                className="group flex gap-4 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                {/* Dot */}
                <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot} ${s.dotGlow} transition-transform group-hover:scale-125`} />
                  {i !== logs.length - 1 && (
                    <div className="w-px h-full bg-white/5 my-1" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${s.labelColor}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-white/30 truncate max-w-[40%] text-right">{timeAgo}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-snug truncate group-hover:text-white transition-colors" title={item.details}>{item.details || item.action}</p>
                  <p className="text-[11px] font-medium text-white/40 mt-1">{item.user}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
