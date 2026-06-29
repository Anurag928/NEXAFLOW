"use client";

import { motion } from "framer-motion";

interface TransferButtonProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
  processingStep: number;
}

export default function TransferButton({
  onClick,
  disabled,
  isProcessing,
  processingStep,
}: TransferButtonProps) {
  const getButtonText = () => {
    if (!isProcessing) return "Create AI Context";
    switch (processingStep) {
      case 1:
        return "Extracting conversation...";
      case 2:
        return "Understanding context...";
      case 3:
        return "Building AI continuation prompt...";
      case 4:
        return "Ready!";
      default:
        return "Migrating context...";
    }
  };

  return (
    <div className="relative group">
      {/* Premium background glow on hover */}
      {!disabled && !isProcessing && (
        <div className="absolute inset-0 bg-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300 pointer-events-none" />
      )}

      <motion.button
        onClick={onClick}
        disabled={disabled || isProcessing}
        whileHover={disabled || isProcessing ? {} : { scale: 1.01, y: -1 }}
        whileTap={disabled || isProcessing ? {} : { scale: 0.99 }}
        className={`w-full py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 transition-all select-none border relative overflow-hidden ${
          isProcessing
            ? "bg-white/[0.04] border-white/10 text-white/50 cursor-not-allowed"
            : disabled
            ? "bg-white/[0.01] border-white/[0.03] text-white/20 cursor-not-allowed"
            : "bg-white text-black hover:bg-[#F0F0F0] border-transparent cursor-pointer shadow-[0_4px_24px_rgba(255,255,255,0.06)]"
        }`}
      >
        {/* Sliding background loader for processing state */}
        {isProcessing && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-white/[0.02] -z-10"
            initial={{ width: "0%" }}
            animate={{
              width:
                processingStep === 1
                  ? "25%"
                  : processingStep === 2
                  ? "50%"
                  : processingStep === 3
                  ? "75%"
                  : processingStep === 4
                  ? "100%"
                  : "0%",
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}

        {/* Spinner or check icon */}
        {isProcessing ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin flex-shrink-0" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5l-5-5-5 5" />
          </svg>
        )}

        <span className="tracking-tight">{getButtonText()}</span>
      </motion.button>
    </div>
  );
}
