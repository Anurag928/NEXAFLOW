"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Eye, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  Loader2
} from "lucide-react";

export interface TransferDoc {
  id: string;
  userId: string;
  title?: string;
  sourceModel: string;
  destinationModel?: string;
  targetModel?: string; // fallback
  shareUrl?: string;
  shareLink?: string; // fallback
  originalUrl?: string; // fallback
  generatedPrompt?: string;
  generatedContext?: string; // fallback
  inputType?: string;
  memoryExtracted?: string;
  status: "completed" | "processing" | "failed";
  createdAt: any;
  completedAt?: any;
}

interface TransferHistoryCardProps {
  transfer: TransferDoc;
  onViewDetails: (transfer: TransferDoc) => void;
  onDelete: (id: string) => Promise<void>;
  onShowToast: (message: string, type: "success" | "error") => void;
}

const MODEL_CONFIGS: Record<string, { name: string; color: string; bg: string }> = {
  chatgpt: { name: "ChatGPT", color: "text-[#10A37F]", bg: "bg-[#10A37F]/10 border-[#10A37F]/20" },
  claude: { name: "Claude", color: "text-[#D97757]", bg: "bg-[#D97757]/10 border-[#D97757]/20" },
  gemini: { name: "Gemini", color: "text-[#4285F4]", bg: "bg-[#4285F4]/10 border-[#4285F4]/20" },
  deepseek: { name: "DeepSeek", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10 border-[#3B82F6]/20" },
  grok: { name: "Grok", color: "text-[#E5E5E5]", bg: "bg-white/10 border-white/20" },
};

function formatRelativeTime(dateInput: any): string {
  if (!dateInput) return "Unknown date";
  let date: Date;
  if (typeof dateInput.toDate === "function") {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (dateInput?.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }
  
  if (isNaN(date.getTime())) return "Recent";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TransferHistoryCard({
  transfer,
  onViewDetails,
  onDelete,
  onShowToast,
}: TransferHistoryCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const source = transfer.sourceModel.toLowerCase();
  const dest = (transfer.destinationModel || transfer.targetModel || "unknown").toLowerCase();

  const sourceConfig = MODEL_CONFIGS[source] || { name: transfer.sourceModel, color: "text-white/70", bg: "bg-white/5" };
  const destConfig = MODEL_CONFIGS[dest] || { name: transfer.destinationModel || transfer.targetModel || "AI Target", color: "text-white/70", bg: "bg-white/5" };

  const promptText = transfer.generatedPrompt || transfer.generatedContext || "";
  const previewText = promptText.length > 150 ? `${promptText.slice(0, 150)}...` : promptText || "No context content generated.";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      // Reset confirmation if user doesn't click delete in 4s
      setTimeout(() => setIsConfirmingDelete(false), 4000);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(transfer.id);
      onShowToast("Transfer deleted successfully.", "success");
    } catch {
      onShowToast("Failed to delete transfer.", "error");
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  // Status badge config
  const statusConfig = {
    completed: { text: "Completed", class: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    processing: { text: "Processing", class: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    failed: { text: "Failed", class: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  };

  const statusInfo = statusConfig[transfer.status] || { text: transfer.status, class: "text-white/40 bg-white/5" };

  const defaultTitle = transfer.title || `${sourceConfig.name} to ${destConfig.name} Migration`;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 overflow-hidden"
    >
      {/* Decorative hover gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Source AI -> Destination AI */}
        <div className="flex items-center justify-between gap-4 mb-3.5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border tracking-wider font-mono ${sourceConfig.bg} ${sourceConfig.color}`}>
              {sourceConfig.name}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border tracking-wider font-mono ${destConfig.bg} ${destConfig.color}`}>
              {destConfig.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusInfo.class}`}>
              {statusInfo.text}
            </span>
            <span className="text-[12px] text-white/30 font-medium">
              {formatRelativeTime(transfer.createdAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-bold text-white/90 group-hover:text-white transition-colors line-clamp-1 mb-2">
          {defaultTitle}
        </h3>

        {/* Prompt Preview */}
        <p className="text-[13px] text-white/40 leading-relaxed font-normal mb-5 line-clamp-3 min-h-[58px]">
          {previewText}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <button
          onClick={() => onViewDetails(transfer)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-[12px] font-semibold text-white/80 hover:text-white transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Copy Prompt Action */}
          <button
            onClick={handleCopy}
            disabled={!promptText || transfer.status !== "completed"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all border ${
              isCopied
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white/80 hover:text-white"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Copied" : "Copy"}</span>
          </button>

          {/* Delete Action with double-click/confirmation */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
              isConfirmingDelete
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30 animate-pulse"
                : "bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 border border-white/[0.04] hover:border-rose-500/20 text-white/40"
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{isConfirmingDelete ? "Sure?" : ""}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
