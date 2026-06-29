"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Clock 
} from "lucide-react";

interface HistoryStatsProps {
  totalCount: number;
  successCount: number;
  mostUsedSource: string;
  mostUsedDest: string;
  recentActivity: string;
  loading: boolean;
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  grok: "Grok",
};

export default function HistoryStats({
  totalCount,
  successCount,
  mostUsedSource,
  mostUsedDest,
  recentActivity,
  loading
}: HistoryStatsProps) {
  
  const displaySource = MODEL_DISPLAY_NAMES[mostUsedSource.toLowerCase()] ?? mostUsedSource ?? "None";
  const displayDest = MODEL_DISPLAY_NAMES[mostUsedDest.toLowerCase()] ?? mostUsedDest ?? "None";

  const stats = [
    {
      label: "Total Transfers",
      value: loading ? "..." : totalCount.toString(),
      sub: "All-time migrations",
      icon: ArrowLeftRight,
      iconColor: "text-blue-400",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    },
    {
      label: "Successful Transfers",
      value: loading ? "..." : successCount.toString(),
      sub: `${totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}% success rate`,
      icon: CheckCircle2,
      iconColor: "text-[#10A37F]",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(16,163,127,0.15)]",
    },
    {
      label: "Most Used Source AI",
      value: loading ? "..." : displaySource,
      sub: "Primary source model",
      icon: TrendingUp,
      iconColor: "text-purple-400",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]",
    },
    {
      label: "Most Used Destination",
      value: loading ? "..." : displayDest,
      sub: "Primary target model",
      icon: Sparkles,
      iconColor: "text-orange-400",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]",
    },
    {
      label: "Recent Activity",
      value: loading ? "..." : recentActivity,
      sub: "Last migration date",
      icon: Clock,
      iconColor: "text-teal-400",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8"
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between min-h-[125px] overflow-hidden ${stat.glowColor}`}
          >
            {/* Soft inner glow gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-white/35 tracking-wider uppercase font-mono">
                {stat.label}
              </span>
              <div className={`p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] ${stat.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-white/90 truncate">
                {stat.value}
              </div>
              <p className="text-[11.5px] text-white/30 font-medium mt-0.5 truncate">
                {stat.sub}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
