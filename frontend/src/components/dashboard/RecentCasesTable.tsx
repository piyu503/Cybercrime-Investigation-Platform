import { useCases } from "../../hooks/useCases";

function StatusBadge({ fileCount }: { fileCount: number }) {
  if (fileCount === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase bg-slate-800 text-slate-500 border border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
        No Files
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase bg-blue-950 text-blue-400 border border-blue-800/60">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
      Active
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

import { useNavigate } from "react-router-dom";

export function RecentCasesTable() {
  const { data: cases, isLoading, isError, error } = useCases();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-4 rounded-sm bg-blue-500 inline-block" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-300">
            Case Registry
          </h2>
          {cases && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-sm">
              {cases.length} records
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-widest uppercase text-slate-600 font-mono">
          GET /cases
        </span>
      </div>

      {/* Error state */}
      {isError && (
        <div className="px-5 py-4 text-sm text-red-400 font-mono bg-red-950/20 border-b border-red-900/40">
          ✗ {(error as { message?: string })?.message || "Failed to fetch cases from backend."}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/40">
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-slate-500 w-32">
                Case ID
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-slate-500">
                Case Name
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-slate-500 hidden lg:table-cell">
                Description
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-slate-500 w-28">
                Created
              </th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold tracking-widest uppercase text-slate-500 w-20">
                Files
              </th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold tracking-widest uppercase text-slate-500 w-24">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : cases && cases.length > 0
                ? cases.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => navigate(`/cases/${c._id}`)}
                    className="border-b border-slate-800/70 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    {/* _id */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-slate-500 tracking-tight">
                        #{String(c._id).slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* case_name */}
                    <td className="px-4 py-3">
                      <span className="text-slate-200 font-medium text-[13px]">
                        {c.case_name || "—"}
                      </span>
                    </td>

                    {/* description */}
                    <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                      <span className="text-slate-500 text-xs truncate block">
                        {c.description || <span className="italic text-slate-600">No description</span>}
                      </span>
                    </td>

                    {/* created_at */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-slate-400">
                        {formatDate(c.created_at)}
                      </span>
                    </td>

                    {/* files.length */}
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-[13px] text-amber-400 font-semibold">
                        {c.files?.length ?? 0}
                      </span>
                    </td>

                    {/* status derived from files.length */}
                    <td className="px-4 py-3 text-center">
                      <StatusBadge fileCount={c.files?.length ?? 0} />
                    </td>
                  </tr>
                ))
                : !isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-600 text-sm font-mono">
                      No cases found. Create a case to begin.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
