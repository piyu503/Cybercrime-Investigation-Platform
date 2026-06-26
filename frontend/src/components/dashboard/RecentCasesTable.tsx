import { useCases } from "../../hooks/useCases";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderGit2, ChevronRight, FileImage, LayoutGrid } from "lucide-react";

function StatusBadge({ fileCount }: { fileCount: number }) {
  if (fileCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-white/50 border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        Empty
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return "—";
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
      <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  );
}

export function RecentCasesTable() {
  const { data: cases, isLoading, isError, error } = useCases();
  const navigate = useNavigate();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-glass flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 ring-1 ring-white/10">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Recent Projects
            </h2>
            <p className="text-xs text-white/50">Manage your active investigations</p>
          </div>
        </div>
        {cases && (
          <span className="text-xs font-medium text-white/60 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            {cases.length} total
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="m-4 p-4 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Error loading projects: {(error as { message?: string })?.message || "Connection failed"}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : cases && cases.length > 0 ? (
          <div className="divide-y divide-white/5">
            {cases.map((c, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={c._id}
                onClick={() => navigate(`/cases/${c._id}`)}
                className="group flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                      {c.case_name || "Untitled Project"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">#{String(c._id).slice(-6).toUpperCase()}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-xs text-white/40">{formatDate(c.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
                    <FileImage className="w-4 h-4 text-white/30" />
                    <span>{c.files?.length ?? 0} assets</span>
                  </div>
                  <div className="hidden md:block">
                    <StatusBadge fileCount={c.files?.length ?? 0} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : !isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <FolderGit2 className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">No projects found</h3>
            <p className="text-xs text-white/50 max-w-[200px]">Create your first project to start analyzing evidence.</p>
          </div>
        )}
      </div>
    </div>
  );
}
