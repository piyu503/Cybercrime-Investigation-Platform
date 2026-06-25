import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accent?: "blue" | "amber" | "green" | "slate";
  isPlaceholder?: boolean;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, { border: string; iconBg: string; iconColor: string; valueColor: string }> = {
  blue:  { border: "border-l-blue-600",  iconBg: "bg-blue-950",  iconColor: "text-blue-400",  valueColor: "text-blue-100"  },
  amber: { border: "border-l-amber-500", iconBg: "bg-amber-950", iconColor: "text-amber-400", valueColor: "text-amber-100" },
  green: { border: "border-l-emerald-500", iconBg: "bg-emerald-950", iconColor: "text-emerald-400", valueColor: "text-emerald-100" },
  slate: { border: "border-l-slate-500", iconBg: "bg-slate-800",  iconColor: "text-slate-400",  valueColor: "text-slate-300"  },
};

export function StatCard({
  label,
  value,
  subtext,
  icon,
  accent = "blue",
  isPlaceholder = false,
}: StatCardProps) {
  const a = accentStyles[accent];

  return (
    <div
      className={`relative bg-slate-900 border border-slate-700/60 border-l-4 ${a.border} rounded-sm overflow-hidden`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-2">
            {label}
          </p>
          {isPlaceholder ? (
            <p className="text-sm font-mono text-slate-500 italic">{value}</p>
          ) : (
            <p className={`text-3xl font-bold font-mono tabular-nums ${a.valueColor} leading-none`}>
              {value}
            </p>
          )}
        </div>
        <div className={`flex-shrink-0 ml-3 w-9 h-9 rounded flex items-center justify-center ${a.iconBg}`}>
          <span className={`w-4 h-4 ${a.iconColor}`}>{icon}</span>
        </div>
      </div>

      {/* Footer */}
      {subtext && (
        <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700/40">
          <p className="text-[11px] text-slate-500">{subtext}</p>
        </div>
      )}

      {/* Subtle scan-line texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }}
      />
    </div>
  );
}
