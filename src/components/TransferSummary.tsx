"use client";

import { motion } from "framer-motion";

interface ModelConfig {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const MODELS_CONFIG: Record<string, ModelConfig> = {
  chatgpt: {
    name: "ChatGPT",
    color: "#10A37F",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" fill="currentColor" />
        <path d="M20.31 10.37a5.53 5.53 0 0 0-.58-3.07 5.53 5.53 0 0 0-2.45-2.45 5.59 5.59 0 0 0-4.32-.23 5.58 5.58 0 0 0-3.07.58A5.53 5.53 0 0 0 6.82 5.8a5.53 5.53 0 0 0-2.45 2.45 5.59 5.59 0 0 0-.23 4.32 5.58 5.58 0 0 0 .58 3.07 5.53 5.53 0 0 0 3.07 3.07 5.59 5.59 0 0 0 4.32.23 5.58 5.58 0 0 0 3.07-.58 5.53 5.53 0 0 0 3.07-3.07 5.59 5.59 0 0 0 .23-4.32 5.58 5.58 0 0 0-.58-3.07z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
        <path d="M17.18 13a4.2 4.2 0 0 1-.76 2.13 4.23 4.23 0 0 1-1.74 1.34v.05c-.32.12-.66.19-1 .2a4.22 4.22 0 0 1-2.92-.93 4.19 4.19 0 0 1-1.34-1.75 4.24 4.24 0 0 1-.2-1 4.22 4.22 0 0 1 .93-2.92c.3-.34.66-.62 1.07-.8a4.23 4.23 0 0 1 3.59.13 4.2 4.2 0 0 1 1.74 1.34c.32.36.52.8.59 1.27a4.24 4.24 0 0 1 .04.94z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  claude: {
    name: "Claude",
    color: "#D97757",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 19.5h15M6.5 19.5V11a5.5 5.5 0 0 1 11 0v8.5M10 11.5a2 2 0 1 1 4 0v8M7.5 15h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  gemini: {
    name: "Gemini",
    color: "#4285F4",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c.3 3.5 2.5 5.7 6 6-3.5.3-5.7 2.5-6 6-.3-3.5-2.5-5.7-6-6 3.5-.3 5.7-2.5 6-6z" fill="currentColor" />
        <path d="M18.5 15.5c.15 1.75 1.25 2.85 3 3-1.75.15-2.85 1.25-3 3-.15-1.75-1.25-2.85-3-3 1.75-.15 2.85-1.25 3-3z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  deepseek: {
    name: "DeepSeek",
    color: "#3B82F6",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <path d="M12 22V12M12 12l9-5M12 12L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#000" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  grok: {
    name: "Grok",
    color: "#E5E5E5",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  other: {
    name: "Other Model",
    color: "#A1A1AA",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
};

interface TransferSummaryProps {
  sourceModel: string;
  destinationModel: string;
  status?: string;
  createdAt?: any;
}

export default function TransferSummary({
  sourceModel = "chatgpt",
  destinationModel = "gemini",
  status = "completed",
  createdAt,
}: TransferSummaryProps) {
  const sourceKey = sourceModel.toLowerCase();
  const destKey = destinationModel.toLowerCase();

  const source = MODELS_CONFIG[sourceKey] || MODELS_CONFIG.other;
  const dest = MODELS_CONFIG[destKey] || MODELS_CONFIG.other;

  // Format date helper
  const getFormattedDate = () => {
    if (!createdAt) return "Just now";
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    return new Date(createdAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-lg relative overflow-hidden">
      {/* Subtle backglow gradient linking models */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blur-[60px]" style={{
        background: `radial-gradient(circle at 30% 50%, ${source.color}15 0%, transparent 50%),
                    radial-gradient(circle at 70% 50%, ${dest.color}15 0%, transparent 50%)`
      }} />

      <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-6 relative z-10">
        
        {/* Source Model Panel */}
        <div className="flex items-center gap-3.5 flex-1 w-full justify-start">
          <div
            className="flex items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-md transition-all duration-300"
            style={{ color: source.color }}
          >
            {source.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest leading-none mb-1">
              Source Model
            </span>
            <span className="text-sm font-extrabold text-white/95">{source.name}</span>
          </div>
        </div>

        {/* Animated Connecting Vector */}
        <div className="flex items-center justify-center flex-shrink-0 px-2 transform rotate-90 sm:rotate-0 lg:rotate-90">
          <div className="relative flex items-center justify-center w-12 h-6">
            <svg width="40" height="8" viewBox="0 0 40 8" fill="none" className="text-white/20">
              <path
                d="M0 4h36M32 1l4 3-4 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full bg-white/65 shadow-[0_0_8px_white]"
              animate={{ x: [-20, 20] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Destination Model Panel */}
        <div className="flex items-center gap-3.5 flex-1 w-full justify-start sm:justify-end lg:justify-start">
          <div className="flex flex-col text-left sm:text-right lg:text-left">
            <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest leading-none mb-1">
              Destination Model
            </span>
            <span className="text-sm font-extrabold text-white/95">{dest.name}</span>
          </div>
          <div
            className="flex items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-md transition-all duration-300 order-first sm:order-last lg:order-first"
            style={{ color: dest.color }}
          >
            {dest.icon}
          </div>
        </div>

      </div>

      {/* Metadata Bottom Bar */}
      <div className="flex items-center justify-between border-t border-white/[0.03] pt-3.5 text-[11px] font-semibold text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="uppercase font-bold tracking-wider text-[10px] text-emerald-400">
            {status}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/25">
          {getFormattedDate()}
        </span>
      </div>
    </div>
  );
}
