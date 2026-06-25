import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useKnowledgeGraphQuery } from "@/hooks/useReasoning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function KnowledgeGraphTab({ caseId }: { caseId: string }) {
  const { data: graphData, isLoading, isError } = useKnowledgeGraphQuery(caseId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 600
      });
    }
  }, [graphData]);

  if (isLoading) {
    return (
      <Card className="bg-[#0d0f14] border-white/10">
        <CardContent className="h-[600px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !graphData) {
    return (
      <Card className="bg-[#0d0f14] border-white/10">
        <CardContent className="h-[600px] flex items-center justify-center text-white/40">
          Failed to load Knowledge Graph. Make sure evidence is processed.
        </CardContent>
      </Card>
    );
  }

  // Pre-process nodes for color coding
  const getGroupColor = (group: string) => {
    switch (group) {
      case "person": return "#60a5fa"; // blue-400
      case "phone": return "#34d399"; // emerald-400
      case "vehicle": return "#fb923c"; // orange-400
      case "location": return "#f87171"; // red-400
      case "evidence": return "#9ca3af"; // gray-400
      case "date": return "#c084fc"; // purple-400
      case "time": return "#f472b6"; // pink-400
      case "organization": return "#818cf8"; // indigo-400
      case "email": return "#38bdf8"; // sky-400
      case "money": return "#4ade80"; // green-400
      case "evidence_id": return "#facc15"; // yellow-400
      default: return "#9ca3af";
    }
  };

  const processedNodes = graphData.nodes.map(node => ({
    ...node,
    color: getGroupColor(node.group),
    val: node.group === "evidence" ? 15 : 10 // Make evidence nodes slightly larger
  }));

  return (
    <Card className="bg-[#0d0f14] border-white/10 overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-sm font-semibold text-white flex justify-between items-center">
          Knowledge Graph
          <span className="text-xs text-white/40 font-normal">
            {graphData.nodes.length} Nodes | {graphData.edges.length} Edges
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative" ref={containerRef}>
        {graphData.nodes.length === 0 ? (
          <div className="h-[600px] flex items-center justify-center text-white/40">
            No entities found. Process evidence to generate the graph.
          </div>
        ) : (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={{ nodes: processedNodes, links: graphData.edges }}
            nodeLabel={(node: any) => node.label || node.id}
            nodeColor="color"
            nodeRelSize={1}
            linkColor={() => "rgba(255,255,255,0.1)"}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            backgroundColor="#0a0a0a"
            onNodeClick={(node) => {
               // Future: Open side panel with node details
               console.log("Clicked:", node);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
