import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useKnowledgeGraphQuery } from "@/hooks/useReasoning";
import {
  Loader2, GitMerge, Search, Maximize, Minimize,
  RefreshCw, Pause, Play, Download, X, Route,
  Link as LinkIcon, FileText, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

// --- Configuration ---
const ENTITY_TYPES: Record<string, { color: string, icon: string, label: string }> = {
  person: { color: "#3b82f6", icon: "👤", label: "Person" },
  organization: { color: "#a855f7", icon: "🏢", label: "Organization" },
  location: { color: "#ef4444", icon: "📍", label: "Location" },
  evidence: { color: "#9ca3af", icon: "📄", label: "Evidence" },
  file: { color: "#9ca3af", icon: "📄", label: "File" },
  money: { color: "#22c55e", icon: "💵", label: "Transaction" },
  phone: { color: "#06b6d4", icon: "📱", label: "Phone" },
  email: { color: "#f97316", icon: "✉️", label: "Email" },
  vehicle: { color: "#eab308", icon: "🚗", label: "Vehicle" },
  date: { color: "#8b5cf6", icon: "📅", label: "Date" },
  time: { color: "#8b5cf6", icon: "⏰", label: "Time" },
  event: { color: "#d946ef", icon: "⚡", label: "Event" },
  evidence_id: { color: "#64748b", icon: "🏷️", label: "Identifier" }
};
const DEFAULT_TYPE = { color: "#a1a1aa", icon: "🔹", label: "Entity" };

const EDGE_TYPES: Record<string, { color: string, label: string }> = {
  co_occurs: { color: "#9ca3af", label: "Mentioned Together" },
  appears_in: { color: "#9ca3af", label: "Found In" },
  mentioned_in: { color: "#9ca3af", label: "Found In" },
  transferred_to: { color: "#22c55e", label: "Transferred To" },
  called: { color: "#3b82f6", label: "Contacted" },
  contacted: { color: "#3b82f6", label: "Contacted" },
  owns_phone: { color: "#a855f7", label: "Owns Phone" },
  owns_vehicle: { color: "#a855f7", label: "Owns Vehicle" },
  located_at: { color: "#f97316", label: "Location" },
  visited: { color: "#f97316", label: "Visited" },
  belongs_to: { color: "#a855f7", label: "Belongs To" },
  identified_by: { color: "#a855f7", label: "Identified By" },
  associated_with: { color: "#facc15", label: "Associated With" },
  related_to: { color: "#facc15", label: "Related To" },
};
const DEFAULT_EDGE = { color: "#ffffff", label: "Relationship" };

const FOCUS_MODES = [
  { id: "all", label: "Show All", activeClasses: "bg-white/20 text-white border-white/30" },
  { id: "money", label: "Money Trail", activeClasses: "bg-green-500/20 text-green-300 border-green-500/30" },
  { id: "comms", label: "Communications", activeClasses: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "locations", label: "Locations", activeClasses: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  { id: "evidence", label: "Evidence Chain", activeClasses: "bg-gray-500/20 text-gray-300 border-gray-500/30" },
  { id: "timeline", label: "Timeline", activeClasses: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  { id: "suspects", label: "Only Suspects", activeClasses: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
];

export default function KnowledgeGraphTab({ caseId }: { caseId: string }) {
  const { data: rawGraphData, isLoading, isError } = useKnowledgeGraphQuery(caseId);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusMode, setFocusMode] = useState("all");

  // Interaction State
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [hoverLink, setHoverLink] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [selectedPathTarget, setSelectedPathTarget] = useState<any>(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<any>());

  // Resize observer
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
  }, [rawGraphData]);

  // Process data (apply filters)
  const graphData = useMemo(() => {
    if (!rawGraphData) return { nodes: [], links: [] };

    let nodes = rawGraphData.nodes.map(n => {
      const group = (n.group || "unknown").toLowerCase();
      const typeConfig = ENTITY_TYPES[group] || DEFAULT_TYPE;

      let cleanLabel = n.label || n.id;
      // Clean Developer Tags
      if (cleanLabel.includes("::")) cleanLabel = cleanLabel.split("::")[1];
      if (cleanLabel.includes(": ")) cleanLabel = cleanLabel.split(": ")[1];
      // Clean Timestamps from Filenames (e.g., 202606261234_File.txt -> File.txt)
      cleanLabel = cleanLabel.replace(/^\d{14,}_/, "").replace(/_/g, " ");

      const isFile = group === "evidence" || group === "file";
      const isSuspect = group === "person"; // Simplify suspect logic to all persons for now

      return {
        ...n,
        cleanLabel,
        typeConfig,
        val: isFile ? 20 : (isSuspect ? 15 : 10),
      };
    });

    let links = rawGraphData.edges.map((e: any) => {
      const rawLabel = (e.label || "").toLowerCase();
      const edgeConfig = EDGE_TYPES[rawLabel] || DEFAULT_EDGE;
      return {
        ...e,
        edgeConfig,
        cleanLabel: edgeConfig.label
      };
    });

    // Remove completely isolated nodes (Degree 0)
    let degreeMap = new Map<string, number>();
    nodes.forEach(n => degreeMap.set(n.id, 0));
    links.forEach((l: any) => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      degreeMap.set(srcId, (degreeMap.get(srcId) || 0) + 1);
      degreeMap.set(tgtId, (degreeMap.get(tgtId) || 0) + 1);
    });

    nodes = nodes.filter(n => (degreeMap.get(n.id) || 0) > 0);

    // Connected Components Analysis to remove tiny isolated islands (size <= 2)
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    links.forEach((l: any) => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      if (adj.has(srcId)) adj.get(srcId)!.push(tgtId);
      if (adj.has(tgtId)) adj.get(tgtId)!.push(srcId);
    });

    const visited = new Set<string>();
    const validNodeIds = new Set<string>();

    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        const component: string[] = [];
        const q = [n.id];
        visited.add(n.id);

        while (q.length > 0) {
          const curr = q.shift()!;
          component.push(curr);
          for (const neighbor of (adj.get(curr) || [])) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              q.push(neighbor);
            }
          }
        }

        // Keep components with more than 2 nodes, or if the total graph is very small
        if (component.length > 2 || nodes.length < 10) {
          component.forEach(id => validNodeIds.add(id));
        }
      }
    });

    nodes = nodes.filter(n => validNodeIds.has(n.id));

    // Apply Focus Modes
    if (focusMode !== "all") {
      let allowedGroups = new Set<string>();
      let allowedEdgeColors = new Set<string>();

      if (focusMode === "money") {
        allowedGroups = new Set(["person", "organization", "money"]);
        allowedEdgeColors = new Set(["#22c55e", "#a855f7"]);
      } else if (focusMode === "comms") {
        allowedGroups = new Set(["person", "phone", "email", "organization"]);
        allowedEdgeColors = new Set(["#3b82f6", "#a855f7"]);
      } else if (focusMode === "locations") {
        allowedGroups = new Set(["person", "location", "vehicle"]);
        allowedEdgeColors = new Set(["#f97316"]);
      } else if (focusMode === "evidence") {
        allowedGroups = new Set(["evidence", "file"]);
        allowedEdgeColors = new Set(["#9ca3af"]);
      } else if (focusMode === "timeline") {
        allowedGroups = new Set(["date", "time", "event", "person"]);
        allowedEdgeColors = new Set(["#facc15", "#8b5cf6"]);
      } else if (focusMode === "suspects") {
        allowedGroups = new Set(["person", "organization"]);
        allowedEdgeColors = new Set(["#a855f7"]);
      }

      nodes = nodes.filter(n => allowedGroups.has((n.group || "").toLowerCase()));
      const nodeIds = new Set(nodes.map(n => n.id));

      links = links.filter((e: any) =>
        nodeIds.has(typeof e.source === 'object' ? e.source.id : e.source) &&
        nodeIds.has(typeof e.target === 'object' ? e.target.id : e.target) &&
        (allowedEdgeColors.has(e.edgeConfig.color) || allowedGroups.has("evidence"))
      );
    }

    return { nodes, links };
  }, [rawGraphData, focusMode]);

  // Handle Graph Hover Effects
  const updateHighlight = useCallback((node: any, link: any = null) => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());

    if (node) {
      const newHighlightNodes = new Set<string>([node.id]);
      const newHighlightLinks = new Set<any>();

      graphData.links.forEach((l: any) => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;

        if (srcId === node.id || tgtId === node.id) {
          newHighlightLinks.add(l);
          newHighlightNodes.add(srcId);
          newHighlightNodes.add(tgtId);
        }
      });

      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    }

    if (link) {
      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
      setHighlightNodes(new Set([srcId, tgtId]));
      setHighlightLinks(new Set([link]));
    }
  }, [graphData]);

  // BFS Shortest Path (Path Analysis)
  const highlightPath = useCallback((nodeA: any, nodeB: any) => {
    if (!nodeA || !nodeB) return;

    const adjList = new Map();
    graphData.nodes.forEach((n: any) => adjList.set(n.id, []));
    graphData.links.forEach((l: any) => {
      const src = typeof l.source === 'object' ? l.source.id : l.source;
      const tgt = typeof l.target === 'object' ? l.target.id : l.target;
      adjList.get(src)?.push({ target: tgt, link: l });
      adjList.get(tgt)?.push({ target: src, link: l });
    });

    const queue = [[nodeA.id]];
    const visited = new Set([nodeA.id]);
    const parentMap = new Map();

    let found = false;

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === nodeB.id) {
        found = true;
        break;
      }

      const neighbors = adjList.get(current) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          parentMap.set(edge.target, { parent: current, link: edge.link });
          queue.push([...path, edge.target]);
        }
      }
    }

    if (found) {
      const pathNodes = new Set<string>();
      const pathLinks = new Set<any>();
      let curr = nodeB.id;
      pathNodes.add(curr);

      while (curr !== nodeA.id) {
        const trace = parentMap.get(curr);
        pathLinks.add(trace.link);
        curr = trace.parent;
        pathNodes.add(curr);
      }

      setHighlightNodes(pathNodes);
      setHighlightLinks(pathLinks);
    }
  }, [graphData]);

  const handleNodeClick = useCallback((node: any, event: any) => {
    setSelectedLink(null);
    if (event.shiftKey && selectedNode && selectedNode.id !== node.id) {
      // Path finding
      setSelectedPathTarget(node);
      highlightPath(selectedNode, node);
      return;
    }

    setSelectedNode(node);
    setSelectedPathTarget(null);
    updateHighlight(node);

    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(2.5, 800);
    }
  }, [selectedNode, updateHighlight, highlightPath]);

  const handleLinkClick = useCallback((link: any) => {
    setSelectedNode(null);
    setSelectedPathTarget(null);
    setSelectedLink(link);
    updateHighlight(null, link);
  }, [updateHighlight]);

  // Physics tuning
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(80);
      fgRef.current.d3Force('collide', () => { });
    }
  }, [graphData]);

  // Controls
  const togglePhysics = () => {
    if (isPhysicsActive) fgRef.current?.d3Force('charge').strength(0);
    else fgRef.current?.d3Force('charge').strength(-300);
    setIsPhysicsActive(!isPhysicsActive);
  };

  const handleExport = () => {
    if (!fgRef.current) return;
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `graph_${caseId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Rendering
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;

    const baseR = Math.sqrt(node.val) * 1.5;
    const r = isSelected ? baseR * 1.3 : baseR;

    // Draw Node Body
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = isHighlighted ? node.typeConfig.color : '#374151'; // heavily dimmed

    if (isSelected) {
      ctx.shadowColor = node.typeConfig.color;
      ctx.shadowBlur = 15;
    }

    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Inner Dark Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, r * 0.75, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#111827';
    ctx.fill();

    // Draw Icon
    if (isHighlighted || globalScale > 1.5) {
      ctx.font = `${r}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(node.typeConfig.icon, node.x, node.y);
    }

    // Smart Label Rendering
    // Display labels if zoomed in, OR if highlighted, OR if it's a main node
    const isMainNode = ["person", "organization", "evidence"].includes(node.group);
    if ((isHighlighted && globalScale > 0.8 && isMainNode) || globalScale > 1.2 || isSelected || hoverNode?.id === node.id) {
      const fontSize = 12 / globalScale;
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isHighlighted ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.3)';
      ctx.fillText(node.cleanLabel, node.x, node.y + r + 4);
    }
  }, [highlightNodes, hoverNode, selectedNode]);

  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const isHighlighted = highlightLinks.has(link);
    const isSelected = selectedLink === link;
    const isDimmed = highlightNodes.size > 0 && !isHighlighted;

    if (isDimmed) return; // Hide dimmed links for professional clean look

    const start = link.source;
    const end = link.target;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    // Confidence-based thickness
    const conf = link.confidence || 0.5;
    let baseWidth = Math.max(0.5, conf * 2.5);

    if (conf < 0.7) {
      ctx.setLineDash([4, 4]); // Dashed for low confidence
    } else {
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = isHighlighted ? link.edgeConfig.color : `${link.edgeConfig.color}60`; // Add transparency to default
    ctx.lineWidth = isHighlighted || isSelected ? baseWidth * 2 : baseWidth;

    if (isSelected || hoverLink === link) {
      ctx.shadowColor = link.edgeConfig.color;
      ctx.shadowBlur = 10;
    }

    ctx.stroke();
    ctx.setLineDash([]); // Reset
    ctx.shadowBlur = 0;

    // Edge Label Tooltip (ONLY ON HOVER)
    if (hoverLink === link || isSelected) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      ctx.font = `bold 10px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = link.cleanLabel;

      const padding = 4;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(midX - textWidth / 2 - padding, midY - 6 - padding, textWidth + padding * 2, 12 + padding * 2);
      ctx.strokeStyle = link.edgeConfig.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(midX - textWidth / 2 - padding, midY - 6 - padding, textWidth + padding * 2, 12 + padding * 2);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, midX, midY);
    }
  }, [highlightLinks, highlightNodes, hoverLink, selectedLink]);

  // Search
  const filteredSearchNodes = useMemo(() => {
    if (!searchQuery) return [];
    return graphData.nodes.filter(n => n.cleanLabel.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, graphData.nodes]);

  // Loading States
  if (isLoading) return <LoadingState />;
  if (isError || !rawGraphData) return <ErrorState />;

  return (
    <div className="h-[750px] flex flex-col relative font-sans bg-[#020617] rounded-xl overflow-hidden border border-white/10 shadow-2xl">

      {/* ─── TOOLBAR (Prevents Overlapping) ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-white/10 bg-black/40 gap-3 shrink-0">
        <div className="relative w-full sm:w-72 z-50">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="pl-9 bg-black/60 border-white/10 text-white h-9 text-sm w-full"
          />
          {filteredSearchNodes.length > 0 && (
            <div className="absolute mt-1 w-full bg-[#0f172a] border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50">
              {filteredSearchNodes.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    handleNodeClick(n, {});
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm text-white/80 flex items-center gap-2"
                >
                  <span style={{ color: n.typeConfig.color }} className="shrink-0">{n.typeConfig.icon}</span> 
                  <span className="truncate">{n.cleanLabel}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto px-1 pb-1 sm:pb-0">
          {FOCUS_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setFocusMode(mode.id);
                setSelectedNode(null);
                setSelectedLink(null);
                setHighlightNodes(new Set());
                setHighlightLinks(new Set());
              }}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-full transition-all border shrink-0 ${focusMode === mode.id
                  ? mode.activeClasses
                  : "bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── GRAPH CANVAS ─── */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {graphData.nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeCanvasObject={paintNode}
            linkCanvasObject={paintLink}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={link => highlightLinks.has(link) || selectedLink === link ? 4 : (isPhysicsActive ? 1 : 0)}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={link => (link.confidence || 0.5) * 0.01}
            linkDirectionalParticleColor={link => link.edgeConfig.color}
            onNodeHover={(node) => {
              setHoverNode(node);
              if (!selectedNode && !selectedLink) updateHighlight(node);
            }}
            onLinkHover={(link) => {
              setHoverLink(link);
              if (!selectedNode && !selectedLink) updateHighlight(null, link);
            }}
            onNodeClick={handleNodeClick}
            onLinkClick={handleLinkClick}
            onBackgroundClick={() => {
              setSelectedNode(null);
              setSelectedLink(null);
              setSelectedPathTarget(null);
              setHighlightNodes(new Set());
              setHighlightLinks(new Set());
            }}
            nodePointerAreaPaint={(node: any, color, ctx) => {
              ctx.beginPath();
              ctx.arc(node.x, node.y, Math.sqrt(node.val) * 2 + 2, 0, 2 * Math.PI, false);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            linkPointerAreaPaint={(link: any, color, ctx) => {
              const start = link.source;
              const end = link.target;
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.lineWidth = 15; // Hitbox width
              ctx.strokeStyle = color;
              ctx.stroke();
            }}
            onEngineStop={() => setIsPhysicsActive(false)}
          />
        )}
      </div>

      {/* Search and Focus Modes were moved to the toolbar above */}

      {/* ─── BOTTOM LEFT: CONTROLS & LEGEND ─── */}
      <div className="absolute bottom-4 left-4 flex gap-4 items-end z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-xl">
            <ControlButton icon={<Maximize />} onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.2, 400)} tooltip="Zoom In" />
            <ControlButton icon={<Minimize />} onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.2, 400)} tooltip="Zoom Out" />
            <ControlButton icon={<RefreshCw />} onClick={() => fgRef.current?.zoomToFit(400)} tooltip="Fit to Screen" />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ControlButton icon={isPhysicsActive ? <Pause /> : <Play />} onClick={togglePhysics} tooltip="Toggle Physics" active={isPhysicsActive} />
            <ControlButton icon={<Download />} onClick={handleExport} tooltip="Export PNG" />
          </div>
          <div className="text-[10px] text-white/30 font-medium px-2 bg-black/40 py-1 rounded w-max border border-white/5 backdrop-blur-sm">
            Nodes: {graphData.nodes.length} | Relationships: {graphData.links.length}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl flex flex-col gap-1.5">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 border-b border-white/10 pb-1">Legend</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-white/70">
            <LegendItem color="#3b82f6" label="Communication" />
            <LegendItem color="#22c55e" label="Financial" />
            <LegendItem color="#f97316" label="Location" />
            <LegendItem color="#a855f7" label="Identity" />
            <LegendItem color="#9ca3af" label="Evidence" />
            <LegendItem color="#facc15" label="Timeline" />
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE INSPECTORS ─── */}
      <AnimatePresence>

        {/* NODE INSPECTOR */}
        {selectedNode && !selectedLink && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col z-30"
          >
            <div className="p-5 border-b border-white/10 flex items-start justify-between shrink-0">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/5 shrink-0" style={{ backgroundColor: selectedNode.typeConfig.color + '20' }}>
                  {selectedNode.typeConfig.icon}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: selectedNode.typeConfig.color }}>
                    {selectedNode.typeConfig.label}
                  </span>
                  <h2 className="text-lg font-bold text-white leading-tight mt-0.5 truncate">
                    {selectedNode.cleanLabel}
                  </h2>
                </div>
              </div>
              <button onClick={() => { setSelectedNode(null); setHighlightNodes(new Set()); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 shrink-0 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin pb-12">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/60">AI Confidence</span>
                  <span className="text-xs font-bold text-white">{Math.round((selectedNode.confidence || 0.5) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(selectedNode.confidence || 0.5) * 100}%`, backgroundColor: selectedNode.typeConfig.color }} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/60">
                <div className="font-semibold text-white/80 mb-1 flex items-center gap-2"><Route className="w-3 h-3" /> Path Analysis</div>
                Shift+Click another node to find the shortest relationship path.
                {selectedPathTarget && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-emerald-400 font-medium">
                    Showing path to: {selectedPathTarget.cleanLabel}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Direct Connections
                </h3>
                <div className="flex flex-col gap-2">
                  {graphData.links
                    .filter((l: any) => l.source.id === selectedNode.id || l.target.id === selectedNode.id)
                    .slice(0, 8)
                    .map((l: any, i: number) => {
                      const isSource = l.source.id === selectedNode.id;
                      const relatedNode = isSource ? l.target : l.source;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer border border-white/5 transition-colors" onClick={() => handleNodeClick(relatedNode, {})}>
                          <span className="text-base">{relatedNode.typeConfig?.icon}</span>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-white/40 font-medium">{l.cleanLabel}</span>
                            <span className="text-sm font-medium text-white/90 truncate">{relatedNode.cleanLabel}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* EDGE INSPECTOR */}
        {selectedLink && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col z-30"
          >
            <div className="p-5 border-b border-white/10 flex items-start justify-between shrink-0">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/5 shrink-0" style={{ backgroundColor: selectedLink.edgeConfig.color + '20' }}>
                  <LinkIcon className="w-6 h-6" style={{ color: selectedLink.edgeConfig.color }} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Relationship</span>
                  <h2 className="text-lg font-bold text-white leading-tight mt-0.5 truncate">
                    {selectedLink.cleanLabel}
                  </h2>
                </div>
              </div>
              <button onClick={() => { setSelectedLink(null); setHighlightNodes(new Set()); setHighlightLinks(new Set()); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 shrink-0 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin pb-12">

              <div className="flex flex-col items-center gap-3 my-4">
                <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10" onClick={() => handleNodeClick(selectedLink.source, {})}>
                  <span className="text-xl">{ENTITY_TYPES[selectedLink.source.group?.toLowerCase()]?.icon || "🔹"}</span>
                  <span className="text-sm font-semibold truncate">{selectedLink.source.cleanLabel || selectedLink.source.id}</span>
                </div>
                <div className="h-6 border-l-2 border-dashed" style={{ borderColor: selectedLink.edgeConfig.color }} />
                <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10" onClick={() => handleNodeClick(selectedLink.target, {})}>
                  <span className="text-xl">{ENTITY_TYPES[selectedLink.target.group?.toLowerCase()]?.icon || "🔹"}</span>
                  <span className="text-sm font-semibold truncate">{selectedLink.target.cleanLabel || selectedLink.target.id}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/60">Correlation Confidence</span>
                  <span className="text-xs font-bold text-white">{Math.round((selectedLink.confidence || 0.5) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(selectedLink.confidence || 0.5) * 100}%`, backgroundColor: selectedLink.edgeConfig.color }} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Why Connected
                </h3>
                <div className="text-sm text-white/80 bg-white/5 p-3 rounded-lg border border-white/10 leading-relaxed">
                  The intelligence engine correlated these entities with high confidence based on shared contextual extraction.
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Supporting Evidence
                </h3>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto scrollbar-thin pr-1">
                  {(selectedLink.evidence_file ? selectedLink.evidence_file.split(',') : ["System Correlated"]).map((file: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-sm font-medium shrink-0">
                      <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="break-words leading-tight">{file.trim().replace(/^\d{14,}_/, "").replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Subcomponents
function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function ControlButton({ icon, onClick, tooltip, active = false }: any) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg transition-colors ${active ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="h-[700px] flex items-center justify-center bg-[#020617] rounded-xl border border-white/10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-glass">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <p className="text-sm text-white/50 tracking-widest uppercase">Rendering Intelligence Graph...</p>
      </motion.div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="h-[700px] flex items-center justify-center bg-[#020617] rounded-xl border border-white/10 text-red-400 font-medium text-sm tracking-widest uppercase">
      <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl">Error: Visualization Failed</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="p-8 border border-white/5 border-dashed rounded-3xl text-center bg-white/[0.02] max-w-sm">
        <GitMerge className="w-8 h-8 text-white/20 mx-auto mb-4" />
        <p className="text-sm font-medium text-white/40">No relationships discovered yet.</p>
      </div>
    </div>
  );
}
