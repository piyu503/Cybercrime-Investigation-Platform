import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accent?: "blue" | "amber" | "green" | "slate" | "purple" | "emerald";
  isPlaceholder?: boolean;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, { bg: string; iconBg: string; iconColor: string }> = {
  blue:  { bg: "from-blue-500/10 to-transparent",  iconBg: "bg-blue-500/20",  iconColor: "text-blue-400" },
  amber: { bg: "from-amber-500/10 to-transparent", iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
  green: { bg: "from-green-500/10 to-transparent", iconBg: "bg-green-500/20", iconColor: "text-green-400" },
  emerald: { bg: "from-emerald-500/10 to-transparent", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
  purple: { bg: "from-purple-500/10 to-transparent", iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
  slate: { bg: "from-slate-500/10 to-transparent", iconBg: "bg-slate-500/20",  iconColor: "text-slate-400" },
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
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-glass flex flex-col justify-between p-6 group h-full flex-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${a.bg} opacity-50 pointer-events-none transition-opacity group-hover:opacity-100`} />
      
      <div className="relative flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg} ring-1 ring-white/10 shadow-inner`}>
          <div className={a.iconColor}>{icon}</div>
        </div>
        <div className="text-xs font-medium text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          Live
        </div>
      </div>

      <div className="relative">
        <p className="text-sm font-medium text-white/60 mb-1">
          {label}
        </p>
        <div className="flex items-end gap-2">
          {isPlaceholder ? (
            <p className="text-xl font-medium text-white/40 italic">{value}</p>
          ) : (
            <p className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              {value}
            </p>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-white/40 mt-3 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}
