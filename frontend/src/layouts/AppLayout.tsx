import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SystemStatusBar } from "@/components/layout/SystemStatusBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <SystemStatusBar />

        <div className="relative flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

          {/* Mobile sidebar */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent>
              <Sidebar collapsed={false} onToggleCollapsed={() => setCollapsed((v) => !v)} variant="static" />
            </SheetContent>
          </Sheet>

          {/* Main column */}
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col transition-[margin] duration-150",
              collapsed ? "lg:ml-[var(--sidebar-width-collapsed)]" : "lg:ml-[var(--sidebar-width)]"
            )}
          >
            <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
