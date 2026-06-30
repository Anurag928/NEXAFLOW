"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-default"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#090909]/95 border border-white/[0.08] backdrop-blur-xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] z-10 flex flex-col text-center"
          >
            {/* Top sparkle effect */}
            <div className="absolute top-4 right-4 text-white/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            {/* Lock icon aura */}
            <div className="w-14 h-14 bg-white/5 border border-white/10 text-white/80 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white mb-2 leading-tight">
              Unlock unlimited AI transfers
            </h2>
            
            <p className="text-xs text-white/40 leading-relaxed mb-6 max-w-xs mx-auto">
              Migrate conversations between ChatGPT, Claude, Gemini, DeepSeek, and Grok without hitches.
            </p>

            {/* Feature List */}
            <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl mb-6 text-left space-y-3.5">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-semibold">Unlimited conversation transfers</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-semibold">AI Memory</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-semibold">Full history</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-semibold">Priority processing</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-[#F0F0F0] text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {isLoading ? "Upgrading Account..." : "Upgrade to Pro"}
              </button>
              
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/[0.03] text-white/40 hover:text-white/60 text-[12px] font-bold transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
