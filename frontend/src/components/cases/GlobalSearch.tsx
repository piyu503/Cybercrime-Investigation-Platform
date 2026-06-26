import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { globalSearch, SearchResults } from "@/api/search.api";

export default function GlobalSearch({ caseId }: { caseId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await globalSearch(caseId, query);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search evidence, entities, timeline..."
          className="bg-white/5 border-white/10 text-white"
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Search</span>
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          <ResultSection title="Evidence & Files" items={results.files} query={query} />
          <ResultSection title="Entities" items={results.entities} query={query} />
          <ResultSection title="Timeline Events" items={results.timeline} query={query} />
          <ResultSection title="Intelligence & Findings" items={results.intelligence} query={query} />
          
          {Object.values(results).every(arr => arr.length === 0) && (
            <p className="text-white/50 text-sm italic">No results found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
}

function HighlightText({ text, query }: { text: string, query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <span key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{part}</span> : <span key={i}>{part}</span>
      )}
    </>
  );
}

function ResultSection({ title, items, query }: { title: string, items: any[], query: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-1">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-md">
            <h4 className="text-sm font-medium text-white">
              <HighlightText text={item.title} query={query} />
            </h4>
            <p className="text-xs text-white/50 mt-1 line-clamp-2">
              <HighlightText text={item.preview} query={query} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
