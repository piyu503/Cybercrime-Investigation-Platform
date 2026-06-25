import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, UploadCloud, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadEvidence } from "@/api/cases.api";

export default function EvidenceUpload() {
  const { case_id } = useParams<{ case_id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !case_id) return;
    setIsUploading(true);
    setError("");
    try {
      await uploadEvidence(case_id, file);
      navigate(`/cases/${case_id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-xs text-white/40">
        <Link to="/cases" className="hover:text-white/70 transition-colors">Cases</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/cases/${case_id}`} className="hover:text-white/70 transition-colors">
          {case_id}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white/60">Upload Evidence</span>
      </nav>

      <PageHeader
        eyebrow="Case Evidence"
        title="Upload Evidence"
        description="Securely upload digital evidence files for ingestion and analysis."
      />
      
      <Card className="bg-[#0d0f14] border-white/10 max-w-xl">
        <CardContent className="pt-6 space-y-4">
           {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">{error}</div>}
           <div className="space-y-2">
             <label className="text-sm text-white/60">Select File (TXT, PDF, JPG, PNG)</label>
             <Input 
               type="file" 
               className="bg-white/5 border-white/10 text-white" 
               onChange={(e) => setFile(e.target.files?.[0] || null)}
             />
           </div>
           <Button 
             onClick={handleUpload} 
             disabled={!file || isUploading}
             className="w-full bg-indigo-600 hover:bg-indigo-500"
           >
             {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
             {isUploading ? "Uploading..." : "Upload to Case"}
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
