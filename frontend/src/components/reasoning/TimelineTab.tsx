import { useState } from "react";
import { useTimeline, useGenerateTimeline } from "@/hooks/useReasoning";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, FileText, Play, Download, Clock } from "lucide-react";
import TimelineReplay from "./TimelineReplay";
import { motion } from "framer-motion";

export default function TimelineTab({ caseId }: { caseId: string }) {
  const { data: timeline, isLoading, isError } = useTimeline(caseId);
  const { mutate: generateTimeline, isPending } = useGenerateTimeline();
  const [isReplayMode, setIsReplayMode] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass"
        >
           <Loader2 className="h-8 w-8 animate-spin text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
           <p className="text-sm text-white/50 tracking-widest uppercase">Reconstructing Chronology...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center text-red-400 font-medium text-sm tracking-widest uppercase">
        <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">
          Error: Chronology Reconstruction Failed
        </div>
      </div>
    );
  }

  const exportTimeline = () => {
    if (!timeline) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `timeline_${caseId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (isReplayMode && timeline) {
    return <TimelineReplay events={timeline} onExit={() => setIsReplayMode(false)} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400 ring-1 ring-white/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
             <Clock className="w-4 h-4" />
           </div>
           <span className="font-semibold text-sm tracking-wide text-white">Event Chronology</span>
        </div>
        <div className="flex gap-3">
          {timeline && timeline.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportTimeline}
                className="border-white/10 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors h-8 px-3 rounded-lg gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReplayMode(true)}
                className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 text-xs font-medium transition-colors h-8 px-3 rounded-lg gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Replay Matrix
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm"
            disabled={isPending}
            onClick={() => generateTimeline(caseId)}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 text-xs font-medium transition-colors h-8 px-3 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            {isPending ? "Reconstructing..." : "Regenerate"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-black/20">
         {!timeline || timeline.length === 0 ? (
           <div className="h-full flex items-center justify-center">
             <div className="p-8 border border-white/5 border-dashed rounded-3xl text-center bg-white/[0.02] max-w-sm">
               <Clock className="w-8 h-8 text-white/20 mx-auto mb-4" />
               <p className="text-sm font-medium text-white/40">No events detected. Generate timeline to begin.</p>
             </div>
           </div>
         ) : (
           <div className="relative border-l-2 border-blue-500/20 ml-4 space-y-8 pb-8 pt-4">
             {timeline.map((event, idx) => (
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 key={idx} 
                 className="relative pl-8"
               >
                 {/* Timeline dot */}
                 <div className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-[#0F172A] border-[3px] border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-colors shadow-glass group">
                     <div className="flex justify-between items-start mb-3 pb-3 border-b border-white/5">
                       <div className="flex items-center gap-2.5 text-blue-400 text-sm font-medium">
                         <div className="p-1.5 bg-blue-500/10 rounded-md">
                           <Calendar className="h-3.5 w-3.5" />
                         </div>
                         {event.timestamp || "Unknown Date"}
                       </div>
                       {event.reliability && (
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border shadow-inner ${
                           event.reliability === 'High' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                           event.reliability === 'Medium' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' :
                           'text-red-400 border-red-400/20 bg-red-400/10'
                         }`}>
                           {event.reliability}
                         </span>
                       )}
                     </div>
                     
                     <div className="mb-4">
                       <h3 className="text-base font-semibold text-white tracking-tight mb-1.5 group-hover:text-blue-100 transition-colors">{event.event_type}</h3>
                       <p className="text-sm text-white/60 leading-relaxed">{event.description}</p>
                     </div>
                     
                     {((event.related_entities?.length || 0) > 0 || (event.locations?.length || 0) > 0) && (
                       <div className="flex flex-wrap gap-2 mb-4">
                         {event.locations?.map((loc, i) => (
                            <span key={`loc-${i}`} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium px-2 py-1 rounded-md">
                              {loc}
                            </span>
                         ))}
                         {event.related_entities?.map((ent, i) => (
                            <span key={`ent-${i}`} className="bg-white/5 border border-white/10 text-white/70 text-[10px] font-medium px-2 py-1 rounded-md">
                              {ent}
                            </span>
                         ))}
                       </div>
                     )}
                     
                     {event.supporting_evidence && event.supporting_evidence.length > 0 && (
                       <div className="flex items-center gap-2 text-xs text-white/40 bg-black/20 p-2 rounded-lg border border-white/5">
                         <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                         <span className="text-white/60 truncate font-mono">Src: {event.supporting_evidence.join(", ")}</span>
                       </div>
                     )}
                 </div>
               </motion.div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
