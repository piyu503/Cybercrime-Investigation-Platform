import { useEffect, useState } from "react";
import { Folder, FileText, Share2, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { DashboardMetrics, getDashboardMetrics } from "@/api/dashboard.api";

export default function CaseDashboard({ caseId }: { caseId: string }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await getDashboardMetrics(caseId);
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [caseId]);

  if (loading || !metrics) {
    return <div className="text-white/50 text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Evidence" value={metrics.total_evidence} icon={<Folder className="w-5 h-5 text-blue-400" />} />
        <MetricCard title="Processed Files" value={metrics.processed_evidence} icon={<FileText className="w-5 h-5 text-emerald-400" />} />
        <MetricCard title="Timeline Events" value={metrics.total_events} icon={<Share2 className="w-5 h-5 text-indigo-400" />} />
        <MetricCard title="Entities Extracted" value={metrics.entities_count} icon={<Share2 className="w-5 h-5 text-purple-400" />} />
        
        <MetricCard title="Recommendations" value={metrics.recommendations_count} icon={<CheckCircle className="w-5 h-5 text-green-400" />} />
        <MetricCard title="Contradictions" value={metrics.contradictions_count} icon={<AlertCircle className="w-5 h-5 text-red-400" />} />
        <MetricCard title="Identified Gaps" value={metrics.gaps_count} icon={<ShieldAlert className="w-5 h-5 text-orange-400" />} />
        <MetricCard title="Readiness Score" value={`${metrics.readiness_score}%`} icon={<ShieldAlert className="w-5 h-5 text-white/50" />} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          {metrics.recent_activity.map((log) => (
            <li key={log._id} className="text-sm flex gap-4 text-white/80">
              <span className="text-white/40 min-w-[140px]">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span className="font-medium text-blue-400">{log.action}</span>
              <span className="truncate">{log.details}</span>
            </li>
          ))}
          {metrics.recent_activity.length === 0 && (
            <li className="text-sm text-white/50">No recent activity found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-md border border-white/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-white/50">{title}</p>
        <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
