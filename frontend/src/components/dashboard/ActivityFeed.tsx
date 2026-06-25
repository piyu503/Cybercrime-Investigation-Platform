// NOTE: Activity feed uses LOCAL MOCK DATA only.
// The backend does not currently expose an activity/audit-log endpoint.
// This component will be wired to a real endpoint when available (Day 5+).

const MOCK_ACTIVITY: {
  id: string;
  type: "case_created" | "file_uploaded" | "case_updated" | "system";
  text: string;
  actor: string;
  time: string;
}[] = [
  { id: "1", type: "file_uploaded",  text: "3 evidence files uploaded to CASE-0047",   actor: "Det. Ramos",    time: "09:14" },
  { id: "2", type: "case_created",   text: "New case opened: Harbour St. Incident",     actor: "Sgt. Mitchell", time: "08:52" },
  { id: "3", type: "case_updated",   text: "Description updated on CASE-0045",          actor: "Det. Ramos",    time: "08:31" },
  { id: "4", type: "file_uploaded",  text: "CCTV footage attached to CASE-0042",        actor: "Analyst Lee",   time: "07:55" },
  { id: "5", type: "system",         text: "Nightly index scan completed — 0 anomalies", actor: "SYSTEM",       time: "00:00" },
  { id: "6", type: "case_created",   text: "New case opened: Warehouse 9 Arson",        actor: "Insp. Okafor",  time: "Yesterday" },
];

const typeStyles = {
  case_created:  { dot: "bg-emerald-500", label: "NEW",      labelColor: "text-emerald-400" },
  file_uploaded: { dot: "bg-amber-400",   label: "UPLOAD",   labelColor: "text-amber-400"   },
  case_updated:  { dot: "bg-blue-400",    label: "UPDATE",   labelColor: "text-blue-400"    },
  system:        { dot: "bg-slate-500",   label: "SYSTEM",   labelColor: "text-slate-500"   },
};

export function ActivityFeed() {
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-4 rounded-sm bg-amber-500 inline-block" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-300">
            Activity Log
          </h2>
        </div>
        {/* Clear mock indicator */}
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-amber-950/60 text-amber-500 border border-amber-800/50 tracking-wider">
          ⚠ MOCK DATA
        </span>
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {MOCK_ACTIVITY.map((item) => {
          const s = typeStyles[item.type];
          return (
            <div key={item.id} className="px-4 py-3 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start gap-3">
                {/* Dot + vertical line */}
                <div className="flex flex-col items-center pt-1 flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-[9px] font-bold tracking-widest ${s.labelColor}`}>
                      {s.label}
                    </span>
                    <span className="font-mono text-[10px] text-slate-600">{item.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-snug truncate">{item.text}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{item.actor}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-800/30 flex-shrink-0">
        <p className="text-[10px] text-slate-600 font-mono">
          Backend audit endpoint not yet available — mock data shown
        </p>
      </div>
    </div>
  );
}
