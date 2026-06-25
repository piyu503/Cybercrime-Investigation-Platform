import { useEffect, useState } from "react";
import { User, Activity } from "lucide-react";
import { AuditLog, getAuditLogs } from "@/api/audit.api";
import { format } from "date-fns";

export default function AuditTrail({ caseId }: { caseId: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getAuditLogs(caseId);
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [caseId]);

  if (loading) {
    return <div className="text-white/50 text-sm">Loading audit trail...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/70 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp (UTC)</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/50">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/90 text-xs">
                      <Activity className="w-3 h-3 text-blue-400" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-white/40" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
