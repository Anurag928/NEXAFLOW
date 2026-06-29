"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import AIModelBadge from "./AIModelBadge";

export interface TransferRecord {
  id: string;
  title: string;
  summary?: string;
  source: string;
  destination: string;
  timestamp: string;
  generatedPrompt?: string;
  sourceModel?: string;
  destinationModel?: string;
  shareUrl?: string;
}

interface RecentTransfersProps {
  transfers: TransferRecord[];
  onView: (id: string) => void;
  onCopy: (prompt: string) => void;
  onContinue: (id: string) => void;
  onCreateFirst: () => void;
}

export default function RecentTransfers({
  transfers = [],
  onView,
  onCopy,
  onContinue,
  onCreateFirst,
}: RecentTransfersProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyClick = (t: TransferRecord) => {
    onCopy(t.generatedPrompt || "");
    setCopiedId(t.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (transfers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white/[0.02] border border-white/[0.04] border-dashed mt-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] text-white/30 mb-4 border border-white/[0.05]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </div>
        <h3 className="text-[15px] font-bold text-white/70 mb-2">No AI transfers yet</h3>
        <p className="text-[13px] text-white/30 mb-6 text-center max-w-sm font-semibold">
          Move your first AI conversation with NexaFlow.
        </p>
        <button 
          onClick={onCreateFirst}
          className="px-5 py-2.5 rounded-xl bg-white text-black text-[13px] font-bold transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer"
        >
          Start Transfer
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {transfers.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          className="group flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden"
        >
          {/* Card left info & description */}
          <div className="flex-1 space-y-3.5">
            <div className="space-y-1">
              <h4 className="text-[16px] font-bold text-white/95 group-hover:text-white transition-colors tracking-tight">
                {t.title}
              </h4>
              {t.summary && (
                <p className="text-[12.5px] leading-relaxed text-white/40 font-semibold max-w-2xl">
                  {t.summary}
                </p>
              )}
            </div>

            {/* AI Flow Indicators and Metadata */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-1">
              
              {/* Badges flow */}
              <div className="flex items-center gap-2">
                <AIModelBadge modelName={t.sourceModel || t.source} />
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/20">
                  <path d="M4 8h8m0 0l-3-3m3 3l-3 3" />
                </svg>
                <AIModelBadge modelName={t.destinationModel || t.destination} />
              </div>

              <span className="hidden sm:inline text-white/10">•</span>

              {/* Status and timestamp */}
              <div className="flex items-center gap-2 text-[12px] text-white/35 font-bold">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Completed</span>
                </div>
                <span className="text-white/15">•</span>
                <span className="font-semibold text-white/30">{t.timestamp}</span>
              </div>

            </div>
          </div>
          
          {/* Actions panel */}
          <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 lg:mt-0 flex-wrap">
            <button 
              onClick={() => onView(t.id)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[12.5px] font-bold text-white/80 hover:text-white transition-all cursor-pointer active:scale-[0.97]"
            >
              View Details
            </button>
            <button 
              onClick={() => handleCopyClick(t)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[12.5px] font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
            >
              {copiedId === t.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-extrabold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Context</span>
                </>
              )}
            </button>
            <button 
              onClick={() => onContinue(t.id)}
              className="px-4 py-2 rounded-xl bg-white text-black text-[12.5px] font-extrabold hover:bg-white/95 transition-all cursor-pointer shadow-sm active:scale-[0.97]"
            >
              Continue
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
