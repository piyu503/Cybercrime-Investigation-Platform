import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCases } from "@/hooks/useCases";
import { Loader2, Folder, Search as SearchIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CaseSelectorProps {
  intent: "evidence" | "timeline" | "reports" | "search";
  title: string;
  description: string;
  icon: React.ElementType;
}

export function CaseSelector({ intent, title, description, icon: Icon }: CaseSelectorProps) {
  const { data: cases, isLoading } = useCases();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 3. If only one case exists, auto redirect
  useEffect(() => {
    if (cases && cases.length === 1) {
      navigate(`/cases/${cases[0]._id}?tab=${intent}`, { replace: true });
    }
  }, [cases, navigate, intent]);

  if (isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </div>
    );
  }

  if (cases && cases.length === 1) {
    return null; // Will auto-redirect
  }

  const filteredCases = (cases || []).filter(c => 
    c.case_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 font-sans max-w-5xl mx-auto w-full pt-8 px-4 animate-fade-in relative">
      <div className="absolute top-0 right-1/4 -mt-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-glass backdrop-blur-md">
          <Icon className="h-6 w-6 text-white/70" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-white/50 max-w-lg mt-1">{description}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-glass overflow-hidden flex flex-col relative z-10">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner w-full max-w-md">
             <SearchIcon className="w-4 h-4 text-white/40 shrink-0" />
             <input
               type="text"
               placeholder="Search by project name or ID..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="flex-1 bg-transparent border-none py-1 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
             />
           </div>
        </div>
        
        <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
           {filteredCases.length === 0 ? (
             <div className="py-12 text-center flex flex-col items-center">
                <Folder className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40 font-medium">No projects found matching your search.</p>
             </div>
           ) : (
             filteredCases.map((c, i) => (
               <motion.button 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 onClick={() => navigate(`/cases/${c._id}?tab=${intent}`)}
                 className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all text-left group"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                     <Folder className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                   </div>
                   <div>
                     <h3 className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">{c.case_name || "Untitled Project"}</h3>
                     <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-mono">ID: {c._id.slice(-8)}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="flex gap-2">
                     <span className="text-[10px] uppercase tracking-wider font-bold text-white/30 bg-black/40 px-2 py-1 rounded border border-white/5">
                       {c.files?.length || 0} Evidence Files
                     </span>
                   </div>
                   <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                 </div>
               </motion.button>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
