import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Menu, Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useCases } from "@/hooks/useCases";
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
  settings: "Settings",
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
  const navigate = useNavigate();
  const { data: cases } = useCases();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !cases) return [];
    const query = searchQuery.toLowerCase();
    return cases.filter(
      (c) => c.case_name.toLowerCase().includes(query) || (c._id && c._id.toLowerCase().includes(query))
    ).slice(0, 5);
  }, [searchQuery, cases]);

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
        <div ref={searchRef} className="relative flex-1 sm:w-64 md:w-80 lg:w-96 hidden sm:block group">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors z-10" />
          <Input
            type="search"
            placeholder="Search workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="h-9 w-full bg-white/5 border-white/10 pl-9 pr-12 text-sm text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 rounded-full transition-all shadow-inner relative z-0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <kbd className="hidden rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white/40 lg:block border border-white/10 shadow-sm">
              ⌘K
            </kbd>
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-11 left-0 w-full bg-[#0f172a] border border-white/10 shadow-2xl rounded-xl overflow-hidden flex flex-col z-50"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                      Projects
                    </div>
                    {searchResults.map((project) => (
                      <button
                        key={project._id}
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchFocused(false);
                          navigate(`/cases/${project._id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                           <Briefcase className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-white truncate">{project.case_name}</span>
                          <span className="text-[10px] text-white/40 font-mono truncate">{project._id}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-white/40">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
