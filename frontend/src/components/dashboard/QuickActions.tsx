// Quick action buttons that link to existing routes in the app.
// Navigation targets assume react-router-dom is configured in src/routes/.

import { useNavigate } from "react-router-dom";

interface Action {
  id: string;
  label: string;
  description: string;
  shortcut: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
}

function ActionButton({ action }: { action: Action }) {
  return (
    <button
      onClick={action.onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-colors text-left group ${
        action.variant === "primary"
          ? "bg-blue-950/60 border-blue-800/60 hover:bg-blue-900/60 hover:border-blue-700"
          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center ${
          action.variant === "primary" ? "bg-blue-900/80" : "bg-slate-800"
        }`}
      >
        <span className={action.variant === "primary" ? "text-blue-400" : "text-slate-400"}>
          {action.icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold ${action.variant === "primary" ? "text-blue-100" : "text-slate-200"}`}>
          {action.label}
        </p>
        <p className="text-[11px] text-slate-500 truncate">{action.description}</p>
      </div>

      <kbd className="hidden sm:inline-flex flex-shrink-0 items-center px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] font-mono text-slate-500">
        {action.shortcut}
      </kbd>
    </button>
  );
}

export function QuickActions() {
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      id: "new-case",
      label: "Open New Case",
      description: "Create a case record in the system",
      shortcut: "N",
      variant: "primary",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => navigate("/cases/new"),
    },
    {
      id: "upload",
      label: "Upload Evidence",
      description: "Attach files to an existing case",
      shortcut: "U",
      variant: "secondary",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      onClick: () => navigate("/evidence"),
    },
    {
      id: "all-cases",
      label: "Browse All Cases",
      description: "Search and filter the case registry",
      shortcut: "C",
      variant: "secondary",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
      onClick: () => navigate("/cases"),
    },
    {
      id: "search",
      label: "Search Evidence",
      description: "Full-text search across all files",
      shortcut: "/",
      variant: "secondary",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      onClick: () => navigate("/search"),
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-700/60">
        <span className="w-1.5 h-4 rounded-sm bg-emerald-500 inline-block" />
        <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-300">
          Quick Actions
        </h2>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {actions.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
