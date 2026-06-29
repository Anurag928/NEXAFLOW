"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { History, Plus } from "lucide-react";

export default function EmptyHistory() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl relative overflow-hidden text-center max-w-2xl mx-auto mt-12"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/30 mb-6 shadow-inner relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-white/[0.05] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <History className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No Transfers Yet</h3>
      <p className="text-[14px] text-white/40 max-w-sm mb-8 leading-relaxed">
        Your AI conversation migrations will appear here. Move your context across platforms seamlessly.
      </p>

      <button
        onClick={() => router.push("/transfer")}
        className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)]"
      >
        <span>Start Your First Transfer</span>
        <Plus className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  );
}
