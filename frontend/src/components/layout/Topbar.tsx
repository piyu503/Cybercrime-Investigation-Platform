import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronRight, Menu, LogOut, UserRound, ScrollText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROUTE_LABELS: Record<string, string> = {
  "": "Dashboard",
  cases: "Cases",
  evidence: "Evidence",
  timeline: "Timeline",
  reports: "Reports",
  settings: "Settings",
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard", to: "/" }];
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
    <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] w-full shrink-0 items-center gap-4 border-b border-border bg-card px-4 sm:px-6">
      {/* Mobile nav trigger */}
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="-ml-1 flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center text-sm sm:flex">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Fragment key={crumb.to}>
              {index > 0 && (
                <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
              {isLast ? (
                <span className="truncate font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>

      {/* Global search */}
      <div className="relative ml-auto flex-1 sm:ml-0 sm:max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search case ID, evidence tag, subject..."
          className="h-9 bg-background pl-8 font-mono text-xs placeholder:font-sans"
        />
      </div>

      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span
            className={cn(
              "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive"
            )}
          />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Officer profile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm py-1 pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Avatar>
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight md:block">
                <p className="text-sm font-medium text-foreground">R. Mehta</p>
                <p className="font-mono text-2xs text-muted-foreground">
                  BADGE&nbsp;4471 &middot; DET.
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Signed in as R. Mehta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ScrollText className="h-4 w-4" />
              Audit log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
