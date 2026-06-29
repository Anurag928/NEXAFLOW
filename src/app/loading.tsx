"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Animated brand logo block */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            borderRadius: ["8px", "16px", "8px"],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 44,
            height: 44,
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ width: 18, height: 18, background: "#000", borderRadius: 4 }} />
        </motion.div>

        {/* Text loading animation */}
        <div className="space-y-1 text-center">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="text-xs font-bold tracking-[0.22em] text-white/50 uppercase font-mono"
          >
            Loading NexaFlow
          </motion.div>
        </div>
      </div>
    </div>
  );
}
