import { useState } from "react";
import { IntelligenceRecommendation } from "@/api/reasoning.api";
import { Lightbulb, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RecommendationCard({ rec }: { rec: IntelligenceRecommendation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-md shadow-glass hover:bg-white/[0.07] transition-colors">
      <div 
        className="p-4 flex items-start gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 truncate">
              {rec.type}
            </span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest border ${
              rec.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              rec.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {rec.priority} Priority
            </span>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">{rec.action}</p>
        </div>
        <div className="text-white/40 bg-white/5 p-1 rounded-md mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-4 space-y-4">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 font-bold flex items-center justify-between">
                  <span>Investigation Audit Trail</span>
                  <span className="text-blue-400 text-xs font-bold flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-500/20 transition-colors">
                    <Activity className="w-3.5 h-3.5" /> View in Timeline
                  </span>
                </span>
                <p className="text-white/70 text-sm leading-relaxed pl-3 border-l-2 border-emerald-500/30">
                  {rec.reason}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] tracking-widest uppercase text-white/40 block mb-1 font-bold">Confidence</span>
                  <p className="text-white/80 text-sm font-medium">
                    {rec.confidence}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] tracking-widest uppercase text-white/40 block mb-1 font-bold">Expected Outcome</span>
                  <p className="text-white/80 text-sm font-medium">
                    {rec.expected_outcome}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
