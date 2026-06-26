import { useCases } from "../hooks/useCases";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentCasesTable } from "../components/dashboard/RecentCasesTable";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { QuickActions } from "../components/dashboard/QuickActions";
import { motion } from "framer-motion";
import { FolderGit2, FileImage, Layers, ActivitySquare } from "lucide-react";

export default function Dashboard() {
  const { data: cases, isLoading } = useCases();

  const totalCases     = cases?.length ?? 0;
  const evidenceFiles  = cases?.reduce((sum, c) => sum + (c.files?.length ?? 0), 0) ?? 0;

  return (
    <div className="font-sans animate-fade-in relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 left-0 -ml-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Hero section ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Welcome, Investigator
          </h1>
          <p className="text-base text-white/50 max-w-lg">
            Here's what's happening across your active investigations today. The Intelligence Engine is standing by.
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            Syncing data...
          </div>
        )}
      </motion.div>

      {/* ── Stat cards row ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          label="Total Projects"
          value={isLoading ? "—" : totalCases}
          subtext="Active investigations"
          accent="blue"
          icon={<FolderGit2 className="w-5 h-5" />}
        />
        <StatCard
          label="Total Evidence Files"
          value={isLoading ? "—" : evidenceFiles}
          subtext="Processed by AI Engine"
          accent="purple"
          icon={<FileImage className="w-5 h-5" />}
        />
        <StatCard
          label="Active Models"
          value="3"
          subtext="Entity, Graph, Vision"
          accent="emerald"
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          label="System Health"
          value="Operational"
          subtext="All services nominal"
          accent="slate"
          icon={<ActivitySquare className="w-5 h-5" />}
        />
      </motion.div>

      {/* ── Main grid ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* Case table — 2/3 width */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <RecentCasesTable />
        </div>

        {/* Right sidebar — 1/3 width */}
        <div className="flex flex-col gap-6">
          <QuickActions />
          <ActivityFeed />
        </div>
      </motion.div>
    </div>
  );
}
