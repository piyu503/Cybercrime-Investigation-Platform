import { useCases } from "../hooks/useCases";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentCasesTable } from "../components/dashboard/RecentCasesTable";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { QuickActions } from "../components/dashboard/QuickActions";
import { SystemOverview } from "../components/dashboard/SystemOverview";

// ─── Icon primitives ─────────────────────────────────────────────────────────

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}
function IconFiles() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  // All stat values are derived strictly from GET /cases
  const { data: cases, isLoading } = useCases();

  const totalCases     = cases?.length ?? 0;
  const evidenceFiles  = cases?.reduce((sum, c) => sum + (c.files?.length ?? 0), 0) ?? 0;
  const casesCreated   = totalCases; // same source, different semantic framing

  const now = new Date();
  const timestamp = now.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* ── Top command bar ── */}
      <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-100 leading-none">Forensics OS</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Command Center</p>
            </div>
          </div>

          <span className="text-slate-700 text-lg font-light hidden sm:inline">|</span>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            DASHBOARD · OPERATIONAL VIEW
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-500">{timestamp}</span>
          </div>
        </div>
      </header>

      {/* ── Main workspace ── */}
      <main className="px-6 py-6 max-w-screen-2xl mx-auto">

        {/* Page label */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">Operations Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live data from backend · Stats derived from{" "}
              <code className="font-mono text-slate-600">GET /cases</code>
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Fetching data…
            </div>
          )}
        </div>

        {/* ── Stat cards row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Cases"
            value={isLoading ? "—" : totalCases}
            subtext="All case records in registry"
            accent="blue"
            icon={<IconFolder />}
          />
          <StatCard
            label="Evidence Files"
            value={isLoading ? "—" : evidenceFiles}
            subtext="Sum of files across all cases"
            accent="amber"
            icon={<IconFiles />}
          />
          <StatCard
            label="Cases Created"
            value={isLoading ? "—" : casesCreated}
            subtext="Count from backend response"
            accent="green"
            icon={<IconPlus />}
          />
          <StatCard
            label="Investigation Readiness"
            value="Available in Day 5"
            subtext="Metric not yet implemented"
            accent="slate"
            icon={<IconShield />}
            isPlaceholder
          />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Case table — 2/3 width */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <RecentCasesTable />
            <SystemOverview />
          </div>

          {/* Right sidebar — 1/3 width */}
          <div className="flex flex-col gap-4">
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
