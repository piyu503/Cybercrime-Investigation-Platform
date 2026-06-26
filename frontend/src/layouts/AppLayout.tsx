import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background text-foreground selection:bg-blue-500/30">
        <div className="relative flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

          {/* Mobile sidebar */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent className="p-0 w-72 bg-black/40 backdrop-blur-3xl border-r border-white/10">
              <Sidebar collapsed={false} onToggleCollapsed={() => setCollapsed((v) => !v)} variant="static" />
            </SheetContent>
          </Sheet>

          {/* Main column */}
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out",
              collapsed ? "lg:ml-[var(--sidebar-width-collapsed)]" : "lg:ml-[var(--sidebar-width)]"
            )}
          >
            <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col min-h-0">
              {/* Premium glowing background accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
              <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col h-full min-h-0">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
