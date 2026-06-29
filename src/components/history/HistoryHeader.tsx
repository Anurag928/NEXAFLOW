"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/[0.04]">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-clip-text">
          Transfer History
        </h1>
        <p className="text-[14px] text-white/45 font-medium leading-relaxed max-w-xl">
          Your complete timeline of AI conversations moved through NexaFlow.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, translateY: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/transfer")}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-[14px] shadow-[0_4px_12px_rgba(255,255,255,0.08)] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 self-start md:self-auto"
      >
        <Plus className="w-4.5 h-4.5" />
        <span>New Transfer</span>
      </motion.button>
    </div>
  );
}
