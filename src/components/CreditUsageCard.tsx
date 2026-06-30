"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface CreditUsageCardProps {
  index: number;
}

export default function CreditUsageCard({ index }: CreditUsageCardProps) {
  const { profile } = useAuth();
  const router = useRouter();

  const isPro = profile?.plan === "pro";
  const used = profile?.credits?.used ?? 0;
  const total = profile?.credits?.total ?? 5;

  const getProgressBarString = (usedVal: number, totalVal: number) => {
    const percentage = Math.min(usedVal / totalVal, 1);
    const filledBlocks = Math.round(percentage * 10);
    const emptyBlocks = 10 - filledBlocks;
    return "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="p-6 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-[#0C0C0C] flex flex-col justify-between"
    >
      <div>
        <h3 className="text-[13px] font-medium text-white/40 mb-3 uppercase tracking-wider">
          {isPro ? "PRO PLAN" : "FREE PLAN"}
        </h3>
        <div className="text-2xl font-bold tracking-tight text-white/90">
          {isPro ? "Unlimited transfers" : `${used} / ${total} used`}
        </div>
        
        {!isPro && (
          <>
            <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden mt-4">
              <div 
                className="h-full bg-white/70 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((used / total) * 100, 100)}%` }} 
              />
            </div>
            <div className="font-mono text-[11px] text-white/30 tracking-wider mt-2.5">
              {getProgressBarString(used, total)}
            </div>
          </>
        )}
      </div>

      {!isPro && (
        <button
          onClick={() => router.push("/pricing")}
          className="mt-4 w-full py-2 px-3 rounded-xl bg-white text-black hover:bg-[#F0F0F0] text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] select-none"
        >
          Upgrade to Pro
        </button>
      )}
    </motion.div>
  );
}
