"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  BrainCircuit, 
  Calendar, 
  CopyCheck,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TransferDoc } from "./TransferHistoryCard";

interface TransferDetailsModalProps {
  transfer: TransferDoc | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onShowToast: (message: string, type: "success" | "error") => void;
}

interface ExtractedMemory {
  id: string;
  category: string;
  title: string;
  content: string;
}

const MODEL_CONFIGS: Record<string, { name: string; color: string; bg: string }> = {
  chatgpt: { name: "ChatGPT", color: "text-[#10A37F]", bg: "bg-[#10A37F]/10 border-[#10A37F]/20" },
  claude: { name: "Claude", color: "text-[#D97757]", bg: "bg-[#D97757]/10 border-[#D97757]/20" },
  gemini: { name: "Gemini", color: "text-[#4285F4]", bg: "bg-[#4285F4]/10 border-[#4285F4]/20" },
  deepseek: { name: "DeepSeek", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10 border-[#3B82F6]/20" },
  grok: { name: "Grok", color: "text-[#E5E5E5]", bg: "bg-white/10 border-white/20" },
};

export default function TransferDetailsModal({
  transfer,
  isOpen,
  onClose,
  onDelete,
  onShowToast,
}: TransferDetailsModalProps) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [memories, setMemories] = useState<ExtractedMemory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  // Fetch linked memories from the `memory` collection
  useEffect(() => {
    if (!transfer || !isOpen) {
      setMemories([]);
      return;
    }

    const fetchLinkedMemories = async () => {
      setLoadingMemories(true);
      try {
        const shortId = transfer.id.substring(0, 6);
        const q = query(
          collection(db, "memory"),
          where("userId", "==", transfer.userId),
          where("source", "==", `Transfer ${shortId}`)
        );
        const querySnapshot = await getDocs(q);
        const fetched: ExtractedMemory[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            category: data.category || "general",
            title: data.title || "Memory Point",
            content: data.content || "",
          });
        });
        setMemories(fetched);
      } catch (err) {
        console.error("Error fetching linked memories:", err);
      } finally {
        setLoadingMemories(false);
      }
    };

    fetchLinkedMemories();
  }, [transfer, isOpen]);

  if (!transfer) return null;

  const source = transfer.sourceModel.toLowerCase();
  const dest = (transfer.destinationModel || transfer.targetModel || "unknown").toLowerCase();

  const sourceConfig = MODEL_CONFIGS[source] || { name: transfer.sourceModel, color: "text-white/70", bg: "bg-white/5" };
  const destConfig = MODEL_CONFIGS[dest] || { name: transfer.destinationModel || transfer.targetModel || "AI Target", color: "text-white/70", bg: "bg-white/5" };

  const promptText = transfer.generatedPrompt || transfer.generatedContext || "";
  
  // Format long date
  let createdDateString = "Unknown date";
  if (transfer.createdAt) {
    let date: Date;
    if (typeof transfer.createdAt.toDate === "function") {
      date = transfer.createdAt.toDate();
    } else if (transfer.createdAt?.seconds) {
      date = new Date(transfer.createdAt.seconds * 1000);
    } else {
      date = new Date(transfer.createdAt);
    }
    if (!isNaN(date.getTime())) {
      createdDateString = date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
  }

  const handleCopy = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      onShowToast("Prompt copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast("Failed to copy prompt.", "error");
    }
  };

  const handleStartSimilar = () => {
    router.push(`/transfer?source=${source}&destination=${dest}`);
  };

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 4000);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(transfer.id);
      onShowToast("Transfer deleted successfully.", "success");
      onClose();
    } catch {
      onShowToast("Failed to delete transfer.", "error");
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  // Original share link
  const rawShareLink = transfer.shareUrl || transfer.shareLink || transfer.originalUrl || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-3xl bg-[#090909] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wider font-mono ${sourceConfig.bg} ${sourceConfig.color}`}>
                  {sourceConfig.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wider font-mono ${destConfig.bg} ${destConfig.color}`}>
                  {destConfig.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Conversation Title & Date */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white leading-snug">
                  {transfer.title || `${sourceConfig.name} to ${destConfig.name} Migration`}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/35 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {createdDateString}</span>
                  </span>
                  {rawShareLink && (
                    <a
                      href={rawShareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Original Link</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Memory Extracted Section */}
              <div className="space-y-2.5">
                <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-wider font-mono flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>Memory Extracted</span>
                </h3>

                {loadingMemories ? (
                  <div className="flex items-center gap-2 text-[13px] text-white/30 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing synced memory logs...</span>
                  </div>
                ) : memories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {memories.map((mem) => (
                      <div
                        key={mem.id}
                        className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-bold text-white/90 truncate">
                            {mem.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[9.5px] uppercase font-bold text-purple-300 tracking-wider">
                            {mem.category}
                          </span>
                        </div>
                        <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2">
                          {mem.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : transfer.memoryExtracted ? (
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-[13px] text-white/60 leading-relaxed">
                    {transfer.memoryExtracted}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-[12.5px] text-white/30 italic">
                    No persistent memory points were registered for this transfer.
                  </div>
                )}
              </div>

              {/* Continuation Prompt Codebox */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-wider font-mono">
                    Generated Continuation Prompt
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-semibold text-white/40 hover:text-white transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative rounded-xl border border-white/[0.06] bg-black/60 overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-[13px] font-mono text-white/70 leading-relaxed whitespace-pre-wrap max-h-[250px] scrollbar-thin">
                    {promptText || "No context content is present in this transfer."}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer / Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/[0.06] bg-white/[0.01]">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all text-[13px] font-semibold w-full sm:w-auto ${
                  isConfirmingDelete
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30 animate-pulse"
                    : "bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 border-white/[0.05] hover:border-rose-500/20 text-white/40"
                }`}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isConfirmingDelete ? "Click to Confirm Delete" : "Delete Transfer"}</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartSimilar}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[13px] font-semibold text-white/90 hover:text-white transition-all w-full sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Start Similar Transfer</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 active:scale-[0.98] transition-all w-full sm:w-auto"
                >
                  {isCopied ? <CopyCheck className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
                  <span>{isCopied ? "Prompt Copied" : "Copy Prompt"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
