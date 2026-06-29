"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AI_MODELS = [
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Claude", color: "#D97757" },
  { name: "DeepSeek", color: "#6366F1" },
  { name: "Grok", color: "#E5E5E5" },
];

export default function HeroFeatureCard() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/[0.08] p-8 md:p-12 mb-10 shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
        {/* Content */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
            Transfer your AI conversations
          </h2>
          <p className="text-[15px] leading-relaxed text-white/50 mb-8">
            Move conversations between AI models while preserving context, instructions, and important details.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/transfer")}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Start Transfer
            </button>
            <button
              onClick={() => router.push("/history")}
              className="px-6 py-2.5 rounded-xl bg-white/[0.05] text-white/80 font-medium text-sm border border-white/[0.1] transition-all hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] active:scale-[0.98] cursor-pointer"
            >
              View History
            </button>
          </div>
        </div>
        
        {/* Visualization */}
        <div className="flex-1 w-full flex items-center justify-center lg:justify-end">
          <div className="relative flex flex-col items-center gap-4">
            
            {/* Source */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-lg"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#10A37F]" />
              <span className="text-sm font-medium text-white/70">ChatGPT</span>
            </motion.div>
            
            {/* Arrow down */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-6 w-px bg-gradient-to-b from-white/20 to-transparent relative"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </div>
            </motion.div>
            
            {/* NexaFlow Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
              className="flex items-center gap-3 px-6 py-3.5 mt-2 rounded-xl bg-white/[0.08] border border-white/[0.15] shadow-[0_0_32px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-white text-black shadow-sm">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <rect width="6" height="6" rx="1" fill="#000" />
                  <rect x="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
                  <rect y="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
                  <rect x="8" y="8" width="6" height="6" rx="1" fill="#000" opacity="0.15" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight text-white/90">NexaFlow</span>
            </motion.div>
            
            {/* Arrow down multiple */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex justify-center mt-2"
            >
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
                <path d="M30 0v12" />
                <path d="M10 12h40" />
                <path d="M10 12v12 M30 12v12 M50 12v12" />
              </svg>
            </motion.div>
            
            {/* Destinations */}
            <div className="flex items-center gap-3">
              {[AI_MODELS[1], AI_MODELS[2], AI_MODELS[3]].map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors cursor-default relative group"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] text-white/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                    {model.name}
                  </div>
                </motion.div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
}
