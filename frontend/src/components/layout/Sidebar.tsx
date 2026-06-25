import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Fingerprint,
  History,
  FileText,
  Settings as SettingsIcon,
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

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Cases", to: "/cases", icon: Briefcase },
  { label: "Evidence", to: "/evidence", icon: Fingerprint },
  { label: "Timeline", to: "/timeline", icon: History },
  { label: "Reports", to: "/reports", icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Renders without the fixed positioning so it can sit inside a Sheet on mobile. */
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
        "flex h-full flex-col border-r border-secondary bg-primary text-primary-foreground transition-[width] duration-150",
        collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
        variant === "fixed" && "fixed inset-y-0 left-0 z-40 hidden lg:flex"
      )}
      style={{ top: variant === "fixed" ? "var(--statusbar-height)" : undefined }}
    >
      {/* Agency / system mark */}
      <div className="flex h-[var(--topbar-height)] items-center gap-2.5 border-b border-secondary px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent">
          <ScanSearch className="h-4 w-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-tight">
              Forensix
            </p>
            <p className="truncate font-mono text-2xs text-primary-foreground/50">
              v1.0 &middot; CMS-OPS
            </p>
          </div>
        )}
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-2 font-mono text-2xs font-semibold uppercase tracking-wider text-primary-foreground/40">
            Operations
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <SidebarLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-secondary" />

        {!collapsed && (
          <p className="mb-2 px-2 font-mono text-2xs font-semibold uppercase tracking-wider text-primary-foreground/40">
            System
          </p>
        )}
        <ul className="flex flex-col gap-1">
          <li>
            <SidebarLink
              item={{ label: "Settings", to: "/settings", icon: SettingsIcon }}
              collapsed={collapsed}
            />
          </li>
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-secondary p-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-2xs font-medium uppercase tracking-wider text-primary-foreground/60 transition-colors hover:bg-secondary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
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
          "group relative flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-secondary text-primary-foreground"
            : "text-primary-foreground/60 hover:bg-secondary/60 hover:text-primary-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-sm bg-accent transition-opacity",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
