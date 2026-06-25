// NOTE: All system status indicators below are MOCK / PLACEHOLDER data.
// Real health-check endpoints are not yet available from the backend.
// Replace with actual polling when /health or equivalent endpoint is available.

interface ServiceStatus {
  id: string;
  name: string;
  detail: string;
  status: "operational" | "degraded" | "offline";
  latencyMs?: number;
  isPlaceholder: boolean;
}

const MOCK_SERVICES: ServiceStatus[] = [
  {
    id: "api",
    name: "Backend API",
    detail: "FastAPI · localhost:8000",
    status: "operational",
    latencyMs: 12,
    isPlaceholder: false, // Derived from query hook availability — partially real
  },
  {
    id: "mongo",
    name: "MongoDB",
    detail: "Primary node · replica set",
    status: "operational",
    latencyMs: 4,
    isPlaceholder: true,
  },
  {
    id: "storage",
    name: "File Storage",
    detail: "Local volume · /data/uploads",
    status: "operational",
    latencyMs: undefined,
    isPlaceholder: true,
  },
  {
    id: "auth",
    name: "Auth Service",
    detail: "JWT · token validation",
    status: "operational",
    latencyMs: undefined,
    isPlaceholder: true,
  },
];

const statusConfig = {
  operational: {
    dot: "bg-emerald-500 shadow-[0_0_6px_1px_rgba(52,211,153,0.5)]",
    label: "Operational",
    labelColor: "text-emerald-400",
    animate: true,
  },
  degraded: {
    dot: "bg-amber-500",
    label: "Degraded",
    labelColor: "text-amber-400",
    animate: false,
  },
  offline: {
    dot: "bg-red-500",
    label: "Offline",
    labelColor: "text-red-400",
    animate: false,
  },
};

export function SystemOverview() {
  const allOperational = MOCK_SERVICES.every((s) => s.status === "operational");

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-4 rounded-sm bg-emerald-500 inline-block" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-300">
            System Status
          </h2>
        </div>
        {/* Global status pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-semibold tracking-wider uppercase border ${
            allOperational
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
              : "bg-amber-950/60 text-amber-400 border-amber-800/50"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${allOperational ? "bg-emerald-500" : "bg-amber-500"}`} />
          {allOperational ? "All Systems Go" : "Degraded"}
        </div>
      </div>

      {/* Service list */}
      <div className="divide-y divide-slate-800/60">
        {MOCK_SERVICES.map((svc) => {
          const cfg = statusConfig[svc.status];
          return (
            <div key={svc.id} className="flex items-center gap-3 px-5 py-3">
              {/* Animated pulse dot */}
              <div className="relative flex-shrink-0 w-2.5 h-2.5">
                {cfg.animate && (
                  <span
                    className="absolute inset-0 rounded-full bg-emerald-500 opacity-40 animate-ping"
                    style={{ animationDuration: "2.5s" }}
                  />
                )}
                <span className={`relative block w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              </div>

              {/* Name + detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] text-slate-200 font-medium">{svc.name}</p>
                  {svc.isPlaceholder && (
                    <span className="text-[9px] font-mono text-amber-600 tracking-wider">MOCK</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 font-mono">{svc.detail}</p>
              </div>

              {/* Latency */}
              {svc.latencyMs !== undefined && (
                <span className="font-mono text-[11px] text-slate-500 flex-shrink-0">
                  {svc.latencyMs}ms
                </span>
              )}

              {/* Status label */}
              <span className={`text-[10px] font-semibold tracking-widest uppercase flex-shrink-0 ${cfg.labelColor}`}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="px-5 py-2 border-t border-slate-800 bg-slate-800/20">
        <p className="text-[10px] text-slate-600 font-mono">
          ⚠ Status indicators are placeholder — no live health endpoint connected
        </p>
      </div>
    </div>
  );
}
