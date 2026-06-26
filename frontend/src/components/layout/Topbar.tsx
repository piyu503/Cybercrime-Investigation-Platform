import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const ROUTE_LABELS: Record<string, string> = {
  "": "Overview",
  cases: "Projects",
  evidence: "Evidence",
  timeline: "Timeline",
  reports: "Reports",
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Overview", to: "/" }];
  }

  return segments.map((segment, index) => {
    const to = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: ROUTE_LABELS[segment] ?? segment,
      to,
    };
  });
}

interface TopbarProps {
  onOpenMobileNav: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] w-full shrink-0 items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl px-6">
      <div className="flex items-center gap-6">
        {/* Mobile nav trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="-ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation</span>
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center text-sm font-medium text-white/60 sm:flex">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 mr-3">
             <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
             <span className="text-white text-xs font-semibold">Forensix Workspace</span>
          </div>
          <ChevronRight className="mr-3 h-4 w-4 text-white/20" />
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Fragment key={crumb.to}>
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-white/20" />
                )}
                {isLast ? (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="font-semibold text-white drop-shadow-sm truncate max-w-[120px] sm:max-w-none block"
                  >
                    {crumb.label}
                  </motion.span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="text-white/50 transition-all hover:text-white hover:drop-shadow-sm truncate max-w-[100px] sm:max-w-none block"
                  >
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Global search */}
        <div className="relative flex-1 sm:w-64 md:w-80 lg:w-96 hidden sm:block group">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" />
          <Input
            type="search"
            placeholder="Search workspace..."
            className="h-9 w-full bg-white/5 border-white/10 pl-9 pr-12 text-sm text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 rounded-full transition-all shadow-inner"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-white/40">⌘K</kbd>
          </div>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 rounded-full pl-2 pr-1 py-1">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-white">Det. R. Mehta</p>
            <p className="text-xs text-white/50">Lead Investigator</p>
          </div>
          <Avatar className="h-8 w-8 border border-white/10 shadow-sm">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mehta&backgroundColor=0F172A" />
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-purple-600 text-xs font-medium text-white">RM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
