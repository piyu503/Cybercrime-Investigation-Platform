import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Projects", to: "/cases", icon: Briefcase },
  { label: "Settings", to: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  variant?: "fixed" | "static";
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  variant = "fixed",
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/5 bg-black/40 backdrop-blur-2xl text-foreground transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
        variant === "fixed" && "fixed inset-y-0 left-0 z-40 hidden lg:flex"
      )}
      style={{ top: variant === "fixed" ? "var(--statusbar-height)" : undefined }}
    >
      {/* Brand mark */}
      <div className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-glow">
          <ScanSearch className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="min-w-0 leading-tight"
          >
            <p className="truncate text-sm font-bold tracking-tight text-white">
              Forensix
            </p>
            <p className="truncate text-[10px] text-white/40 font-medium uppercase tracking-wider">
              Workspace OS
            </p>
          </motion.div>
        )}
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-6">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Workspace
          </p>
        )}
        <ul className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <SidebarLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>

      </nav>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-white/5">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-white/50 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden",
          isActive
            ? "bg-white/10 text-white shadow-sm border border-white/5"
            : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-blue-400" : "text-white/50 group-hover:text-white")} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="bg-[#111] border-white/10 text-white rounded-lg shadow-xl font-medium">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}
