import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, UploadCloud, Loader2, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadEvidence } from "@/api/cases.api";
import { useCase } from "@/hooks/useCase";

const SUPPORTED_EXTENSIONS = [".txt", ".pdf", ".jpg", ".jpeg", ".png"];

export default function EvidenceUpload() {
  const { case_id } = useParams<{ case_id: string }>();
  const navigate = useNavigate();
  const { data: caseData, refetch } = useCase(case_id || "");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccessMsg("");
    
    if (!e.target.files) {
      setFiles([]);
      return;
    }

    const selectedFiles = Array.from(e.target.files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    for (const file of selectedFiles) {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const safeOriginal = file.name.substring(0, file.name.lastIndexOf(".")).replace(/ /g, "_");
      const expectedEnd = `_${safeOriginal}${ext}`;
      
      const isAlreadyUploaded = caseData?.files?.some((f: any) => 
        f.filename === file.name || f.filename.endsWith(expectedEnd)
      );
      
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        newErrors.push(`"${file.name}" has an unsupported format.`);
      } else if (isAlreadyUploaded) {
        newErrors.push(`"${file.name}" is already uploaded.`);
      } else if (validFiles.some(f => f.name === file.name)) {
         // Prevent duplicate selection in the same batch
         newErrors.push(`"${file.name}" selected multiple times.`);
      } else {
        validFiles.push(file);
      }
    }

    if (newErrors.length > 0) {
      setError(newErrors.join(" "));
    }
    
    setFiles(validFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !case_id) return;
    setIsUploading(true);
    setError("");
    setSuccessMsg("");
    
    try {
      // Upload all files concurrently
      await Promise.all(files.map(file => uploadEvidence(case_id, file)));
      setSuccessMsg(`Successfully uploaded ${files.length} file(s).`);
      setFiles([]); // Clear selection
      refetch(); // Refresh the case data to show new files
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed for one or more files.");
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
        description="Securely upload multiple digital evidence files for ingestion and analysis."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="bg-[#0d0f14] border-white/10 w-full">
          <CardContent className="pt-6 space-y-4">
            {error && <div className="text-amber-400 text-sm bg-amber-400/10 p-3 rounded flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> <div className="flex-1">{error}</div></div>}
            {successMsg && <div className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
            
            <div className="space-y-2">
              <label className="text-sm text-white/60">Select Files (TXT, PDF, JPG, PNG)</label>
              <Input 
                type="file" 
                multiple
                accept=".txt,.pdf,.jpg,.jpeg,.png"
                className="bg-white/5 border-white/10 text-white" 
                onChange={handleFileSelection}
              />
              {files.length > 0 && (
                <p className="text-xs text-emerald-400/80">{files.length} valid file(s) selected.</p>
              )}
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={files.length === 0 || isUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-500"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
              {isUploading ? "Uploading..." : "Upload to Case"}
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate(`/cases/${case_id}`)}
              className="w-full border-white/10 text-white/70 hover:bg-white/5"
            >
              Return to Case Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Uploaded Files Preview */}
        <Card className="bg-white/5 border-white/10 w-full shadow-glass">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Currently Uploaded Files
            </h3>
            
            {!caseData?.files || caseData.files.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">No files uploaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
                {caseData.files.map((f: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-4 h-4 text-white/50 shrink-0" />
                      <span className="text-sm text-white/80 truncate" title={f.filename}>{f.filename}</span>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10 text-white/60 shrink-0">
                      {f.is_processed ? "Processed" : "Pending AI"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
