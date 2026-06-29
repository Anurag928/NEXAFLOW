"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export interface AIModelOption {
  name: string;
  logo: string;
  description: string;
  badge: string;
  color?: string;
}

interface AIModelSelectorProps {
  models: AIModelOption[];
  selectedModel: string | null;
  onSelectModel: (modelName: string) => void;
  disabled?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  chatgpt: "text-[#10A37F] bg-[#10A37F]/10 border-[#10A37F]/15",
  claude: "text-[#D97757] bg-[#D97757]/10 border-[#D97757]/15",
  gemini: "text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/15",
  deepseek: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/15",
  grok: "text-white/60 bg-white/5 border-white/10",
};

export default function AIModelSelector({
  models,
  selectedModel,
  onSelectModel,
  disabled = false,
}: AIModelSelectorProps) {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 15 
      } 
    },
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Selector Info Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">
          Destination AI Model
        </span>
        <span className="text-[13px] text-white/40 font-medium">
          Select where you want to continue your conversation
        </span>
      </div>

      {/* Grid Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0"
      >
        {models.map((model) => {
          const isSelected = model.name.toLowerCase() === selectedModel?.toLowerCase();
          const modelKey = model.name.toLowerCase();
          const badgeClass = BADGE_STYLES[modelKey] || BADGE_STYLES.grok;
          const themeColor = model.color || "#FFFFFF";

          return (
            <motion.button
              key={model.name}
              variants={cardVariants}
              disabled={disabled}
              onClick={() => onSelectModel(model.name)}
              whileHover={disabled ? {} : { y: -4, scale: 1.01 }}
              whileTap={disabled ? {} : { scale: 0.99 }}
              style={{
                borderColor: isSelected ? themeColor + "40" : undefined,
                boxShadow: isSelected ? `0 0 24px ${themeColor}10` : undefined,
              }}
              className={`flex-shrink-0 w-[240px] md:w-auto snap-start relative flex flex-col items-center text-center p-5 rounded-2xl border bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 min-h-[235px] justify-between group cursor-pointer ${
                isSelected 
                  ? "bg-white/[0.04] border-white/25" 
                  : "border-white/[0.05] hover:border-white/[0.12]"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {/* Dynamic hover-glow gradient backing */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 10%, ${themeColor}05 0%, transparent 70%)`
                }}
              />

              {/* Selection Check Indicator (Top-Right) */}
              <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center">
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      style={{ backgroundColor: themeColor }}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-black shadow-md shadow-black/40"
                    >
                      <Check className="w-3 h-3 stroke-[3.5] text-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Top Section: Logo & Badge */}
              <div className="flex flex-col items-center w-full mt-2">
                {/* Logo Container */}
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 mb-3.5 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={model.logo}
                    alt={model.name}
                    className="w-6.5 h-6.5 object-contain"
                  />
                </div>

                {/* Model Badge */}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${badgeClass}`}>
                  {model.badge}
                </span>
              </div>

              {/* Middle & Bottom: Name & Description */}
              <div className="flex flex-col items-center mt-2.5 w-full">
                <h3 className="text-[15px] font-bold text-white/90 group-hover:text-white transition-colors">
                  {model.name}
                </h3>
                <p className="text-[11.5px] text-white/35 font-medium leading-relaxed mt-1.5 w-full line-clamp-2">
                  {model.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
