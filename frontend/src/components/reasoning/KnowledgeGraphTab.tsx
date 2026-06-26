import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useKnowledgeGraphQuery } from "@/hooks/useReasoning";
import { Loader2, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

export default function KnowledgeGraphTab({ caseId }: { caseId: string }) {
  const { data: graphData, isLoading, isError } = useKnowledgeGraphQuery(caseId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 600
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [graphData]);

  const processedNodes = useMemo(() => {
    if (!graphData) return [];
    
    const getGroupColor = (group: string, label: string = "") => {
      const g = group.toLowerCase();
      const l = label.toLowerCase();
      
      if (g === "person" || l.startsWith("person:")) return "#60a5fa"; // blue-400
      if (g === "location" || l.startsWith("location:")) return "#f87171"; // red-400
      if (g === "money" || l.startsWith("money:")) return "#4ade80"; // green-400
      if (g === "phone" || l.startsWith("phone:")) return "#34d399"; // emerald-400
      if (g === "vehicle" || l.startsWith("vehicle:")) return "#fb923c"; // orange-400
      if (g === "evidence" || g === "file" || g === "evidence_id" || l.startsWith("evidence:")) return "#9ca3af"; // gray-400
      
      switch (g) {
        case "date": return "#c084fc"; // purple-400
        case "time": return "#f472b6"; // pink-400
        case "organization": return "#818cf8"; // indigo-400
        case "email": return "#38bdf8"; // sky-400
        default: return "#a1a1aa"; // zinc-400
      }
    };

    return graphData.nodes.map(node => {
      const label = node.label || node.id;
      const isFile = node.group === "evidence" || node.group === "file";
      return {
        ...node,
        color: getGroupColor(node.group, label),
        val: isFile ? 25 : 12
      };
    });
  }, [graphData]);

  const graphComponent = useMemo(() => {
    if (!graphData || graphData.nodes.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
           <div className="p-8 border border-white/5 border-dashed rounded-3xl text-center bg-white/[0.02] max-w-sm">
             <GitMerge className="w-8 h-8 text-white/20 mx-auto mb-4" />
             <p className="text-sm font-medium text-white/40">No graph data. Awaiting evidence correlation.</p>
           </div>
        </div>
      );
    }
    return (
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes: processedNodes, links: graphData.edges }}
        nodeColor="color"
        linkColor={() => "rgba(255,255,255,0.15)"}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        backgroundColor="transparent"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label || node.id;
          const fontSize = 11 / globalScale;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          
          // Draw node circle with custom size
          const r = node.val ? Math.sqrt(node.val) * 1.5 : 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || "#9ca3af";
          ctx.fill();
          
          // Draw text label below the node
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          
          // Clean prefixes to show beautiful labels (e.g. Person: Arthur Vance -> Arthur Vance)
          let cleanLabel = label;
          if (cleanLabel.includes("::")) {
            cleanLabel = cleanLabel.split("::")[1];
          }
          if (cleanLabel.includes(": ")) {
            cleanLabel = cleanLabel.split(": ")[1];
          }
          
          ctx.fillText(cleanLabel, node.x, node.y + r + 3);
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          const r = node.val ? Math.sqrt(node.val) * 1.5 : 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
        }}
      />
    );
  }, [graphData, processedNodes, dimensions.width, dimensions.height]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass"
        >
           <Loader2 className="h-8 w-8 animate-spin text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
           <p className="text-sm text-white/50 tracking-widest uppercase">Generating Network Topology...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || !graphData) {
    return (
      <div className="h-full flex items-center justify-center text-red-400 font-medium text-sm tracking-widest uppercase">
        <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">
          Error: Graph Generation Failed
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400 ring-1 ring-white/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
             <GitMerge className="w-4 h-4" />
           </div>
           <span className="font-semibold text-sm tracking-wide text-white">Network Topology Map</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60">
            Nodes: <span className="text-blue-400 font-bold ml-1">{graphData.nodes.length}</span>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/60">
            Edges: <span className="text-purple-400 font-bold ml-1">{graphData.edges.length}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-black/20" ref={containerRef}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {graphComponent}
        </motion.div>
      </div>
    </div>
  );
}
