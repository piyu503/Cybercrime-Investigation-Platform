import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, Calendar, FileText } from "lucide-react";
import { TimelineEvent } from "@/api/reasoning.api";

export default function TimelineReplay({ events, onExit }: { events: TimelineEvent[], onExit: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (isPlaying && currentIndex < sortedEvents.length) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2000 / speed);
    } else if (currentIndex >= sortedEvents.length) {
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, speed, sortedEvents.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(e.target.value));
  };

  if (sortedEvents.length === 0) return null;

  const visibleEvents = sortedEvents.slice(0, currentIndex + 1);

  return (
    <div className="h-full flex flex-col bg-[#0B1020]">
      {/* Controls Bar */}
      <div className="bg-[#111827] border-b border-white/5 p-3 flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="border-white/10 w-7 h-7 rounded-sm" onClick={reset}>
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" onClick={togglePlay} className="bg-blue-600 hover:bg-blue-500 w-7 h-7 rounded-sm text-white">
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)}
              className="border-white/10 text-[9px] font-mono h-7 px-2 rounded-sm"
            >
              {speed}x
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={onExit} className="text-white/60 hover:text-white text-[9px] font-mono uppercase tracking-wider h-7 px-2">
            [ EXIT MATRIX ]
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-white/40 font-mono">0</span>
          <input 
            type="range" 
            min="0" 
            max={sortedEvents.length - 1} 
            value={Math.min(currentIndex, sortedEvents.length - 1)} 
            onChange={handleSeek}
            className="flex-1 accent-blue-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-white/40 font-mono">{sortedEvents.length - 1}</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="relative border-l border-blue-500/30 ml-2 space-y-6 pb-8 pt-2 transition-all duration-500">
          {visibleEvents.map((event, idx) => (
            <div 
              key={idx} 
              className="relative pl-6 animate-in slide-in-from-left-4 fade-in duration-500 fill-mode-both"
              style={{ animationDelay: `${idx === currentIndex && isPlaying ? '0ms' : '0ms'}` }}
            >
              <div className={`absolute -left-1.5 top-2 h-3 w-3 rounded-full border-2 ${
                idx === currentIndex ? 'bg-blue-400 border-blue-400 ring-4 ring-blue-500/20 animate-pulse' : 'bg-[#0B1020] border-white/20'
              }`} />
              
              <div className={`bg-[#111827] rounded-sm p-3 transition-all ${idx === currentIndex ? 'border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border border-white/5'}`}>
                  <div className="flex justify-between items-start mb-2 pb-2 border-b border-white/5">
                    <div className={`flex items-center gap-2 text-xs font-mono font-medium ${idx === currentIndex ? 'text-blue-400' : 'text-white/60'}`}>
                      <Calendar className="h-3 w-3" />
                      {event.timestamp || "Unknown Date"}
                    </div>
                    {event.reliability && (
                      <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                        event.reliability === 'High' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                        event.reliability === 'Medium' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' :
                        'text-red-400 border-red-400/20 bg-red-400/10'
                      }`}>
                        {event.reliability} CONF
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${idx === currentIndex ? 'text-white' : 'text-white/80'}`}>{event.event_type}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{event.description}</p>
                  </div>
                  
                  {(event.related_entities?.length > 0 || event.locations?.length > 0) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.locations?.map((loc, i) => (
                         <span key={`loc-${i}`} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                           LOC: {loc}
                         </span>
                      ))}
                      {event.related_entities?.map((ent, i) => (
                         <span key={`ent-${i}`} className="bg-white/5 border border-white/10 text-white/60 text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                           ENT: {ent}
                         </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                    <FileText className="h-3 w-3" />
                    SRC: <span className="text-white/60 truncate max-w-md">{event.supporting_evidence?.join(", ")}</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
