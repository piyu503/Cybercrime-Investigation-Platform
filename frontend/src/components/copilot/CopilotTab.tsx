import { useState, useRef, useEffect } from "react";
import { useCopilotQuery } from "@/hooks/useCopilot";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Sparkles, ChevronRight, Fingerprint } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "copilot";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is the timeline of events leading to the breach?",
  "Are there any contradictions in the suspect's alibi?",
  "Show me all communications involving John Doe."
];

export default function CopilotTab({ caseId }: { caseId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "copilot", content: "AI Investigation Engine Online. Ready to correlate evidence, extract entities, and answer queries regarding case parameters." }
  ]);
  const [input, setInput] = useState("");
  const { mutate: askCopilot, isPending } = useCopilotQuery(caseId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSend = (text?: string) => {
    const query = text || input;
    if (!query.trim() || isPending) return;

    const userMessage: Message = { role: "user", content: query.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    askCopilot(userMessage.content, {
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { role: "copilot", content: data.answer }]);
      },
      onError: () => {
        setMessages((prev) => [...prev, { role: "copilot", content: "**ERROR**: Neural link failed. Could not reach reasoning engine." }]);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/[0.02]">
         <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400 ring-1 ring-white/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
               <Bot className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-white">Investigation Agent</span>
         </div>
         <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-full tracking-wider uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
            Online
         </span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={idx} 
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "copilot" && (
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1 shadow-glass">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-glass ${
              msg.role === "user" 
                ? "bg-blue-600/90 border border-blue-500/50 text-white rounded-tr-sm" 
                : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"
            }`}>
              {msg.role === "user" ? (
                msg.content
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border-white/10">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1 shadow-glass">
                <User className="w-4 h-4 text-white/80" />
              </div>
            )}
          </motion.div>
        ))}
        {isPending && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex gap-3 justify-start"
           >
             <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1 shadow-glass">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
             </div>
             <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 shadow-glass">
               <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
               <span className="text-sm text-white/70">Analyzing intelligence vectors...</span>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 animate-fade-in">
           <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
             <Fingerprint className="w-3.5 h-3.5" /> Suggested Inquiries
           </h4>
           <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                 <button 
                   key={i} 
                   onClick={() => handleSend(q)} 
                   className="text-left text-sm text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all flex items-center justify-between group hover:shadow-glass hover:border-white/20"
                 >
                    <span>{q}</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors group-hover:translate-x-1" />
                 </button>
              ))}
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="flex gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Ask Agent anything about this project..."
            className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
            disabled={isPending}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isPending}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
