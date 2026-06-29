"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonProps {
  textToCopy: string;
  onCopySuccess?: (message: string) => void;
  className?: string;
}

export default function CopyButton({
  textToCopy,
  onCopySuccess,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess("Prompt copied successfully");
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`relative flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-[#F0F0F0] font-bold text-[12px] transition-all select-none border border-transparent shadow-[0_4px_16px_rgba(255,255,255,0.06)] cursor-pointer active:scale-[0.98] ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 text-emerald-600 font-bold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>COPIED!</span>
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>COPY PROMPT</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
