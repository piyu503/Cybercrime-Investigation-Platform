import { useTimeline, useGenerateTimeline } from "@/hooks/useReasoning";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TimelineTab({ caseId }: { caseId: string }) {
  const { data: timeline, isLoading, isError } = useTimeline(caseId);
  const { mutate: generateTimeline, isPending } = useGenerateTimeline();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40">
        Failed to load timeline.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-white">Investigation Timeline</h2>
          <p className="text-xs text-white/40">Chronological reconstruction of events from correlated evidence</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isPending}
          onClick={() => generateTimeline(caseId)}
          className="border-white/10 text-xs"
        >
          {isPending ? "Generating..." : "Regenerate Timeline"}
        </Button>
      </div>

      {!timeline || timeline.length === 0 ? (
        <Card className="bg-[#0d0f14] border-white/10">
          <CardContent className="py-12 text-center text-white/40 text-sm">
            No events found. Generate timeline from processed evidence.
          </CardContent>
        </Card>
      ) : (
        <div className="relative border-l border-white/10 ml-4 space-y-8 pb-8 pt-4">
          {timeline.map((event, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Timeline dot */}
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-[#0d0f14]" />
              
              <Card className="bg-[#0d0f14] border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.timestamp || "Unknown Date"}
                    </div>
                    {event.reliability && (
                      <Badge variant="outline" className={`text-[10px] ${
                        event.reliability === 'High' ? 'text-green-400 border-green-400/20 bg-green-400/10' :
                        event.reliability === 'Medium' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10' :
                        'text-red-400 border-red-400/20 bg-red-400/10'
                      }`}>
                        {event.reliability} Confidence
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white">{event.event_type}</h3>
                    <p className="text-xs text-white/60 mt-1">{event.description}</p>
                  </div>
                  
                  {(event.related_entities?.length > 0 || event.locations?.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {event.locations?.map((loc, i) => (
                         <Badge key={`loc-${i}`} variant="secondary" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px]">
                           {loc}
                         </Badge>
                      ))}
                      {event.related_entities?.map((ent, i) => (
                         <Badge key={`ent-${i}`} variant="secondary" className="bg-white/5 text-white/60 hover:bg-white/10 text-[10px]">
                           {ent}
                         </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2 text-xs text-white/40 border-t border-white/5">
                    <FileText className="h-3.5 w-3.5" />
                    Source Evidence: 
                    <span className="text-white/60 truncate max-w-md">
                      {event.supporting_evidence.join(", ")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
