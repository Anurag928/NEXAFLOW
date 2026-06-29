"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function ProcessingTimeline() {
  const steps = [
    "Conversation Extracted",
    "Context Understood",
    "Important Memory Preserved",
    "Destination Prompt Generated",
  ];

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-lg">
      <h3 className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase leading-none mb-1">
        AI Processing Timeline
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col relative pl-6 border-l border-white/[0.04] ml-2.5 gap-6 py-2"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-center gap-3.5 relative"
          >
            {/* Timeline Tick Anchor */}
            <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-[#080808] border border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-[12px] font-bold text-white/85 tracking-tight">
              {step}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
