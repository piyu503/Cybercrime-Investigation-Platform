import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, UploadCloud, FolderSearch, Search as SearchIcon, Zap } from "lucide-react";

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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={action.onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
        action.variant === "primary"
          ? "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-glass"
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          action.variant === "primary" ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" : "bg-white/10 text-white/50 group-hover:text-white group-hover:bg-white/20"
        }`}
      >
        {action.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${action.variant === "primary" ? "text-blue-100" : "text-white/90 group-hover:text-white transition-colors"}`}>
          {action.label}
        </p>
        <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors truncate">{action.description}</p>
      </div>

      <kbd className="hidden sm:inline-flex flex-shrink-0 items-center px-2 py-1 rounded-md border border-white/10 bg-black/20 text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
        {action.shortcut}
      </kbd>
    </motion.button>
  );
}

export function QuickActions() {
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      id: "new-case",
      label: "New Project",
      description: "Initialize a workspace",
      shortcut: "⌘N",
      variant: "primary",
      icon: <Plus className="w-5 h-5" />,
      onClick: () => navigate("/cases/new"),
    },
    {
      id: "upload",
      label: "Upload Evidence",
      description: "Add evidence files",
      shortcut: "⌘U",
      variant: "secondary",
      icon: <UploadCloud className="w-5 h-5" />,
      onClick: () => navigate("/evidence"),
    },
    {
      id: "all-cases",
      label: "Browse Projects",
      description: "View all records",
      shortcut: "⌘P",
      variant: "secondary",
      icon: <FolderSearch className="w-5 h-5" />,
      onClick: () => navigate("/cases"),
    },
    {
      id: "search",
      label: "Global Search",
      description: "Search all data",
      shortcut: "⌘K",
      variant: "secondary",
      icon: <SearchIcon className="w-5 h-5" />,
      onClick: () => navigate("/search"),
    },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-glass flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 ring-1 ring-white/10">
           <Zap className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Quick Actions
          </h2>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {actions.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
