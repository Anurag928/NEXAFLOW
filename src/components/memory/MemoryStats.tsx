"use client";

import { motion } from "framer-motion";
import { Brain, Folder, Terminal, MessageSquare } from "lucide-react";

interface MemoryStatsProps {
  totalMemories: number;
  activeProjects: number;
  technicalDecisions: number;
  conversationsLearned: number;
}

export default function MemoryStats({
  totalMemories,
  activeProjects,
  technicalDecisions,
  conversationsLearned,
}: MemoryStatsProps) {
  const stats = [
    {
      label: "Total Memories",
      value: totalMemories,
      icon: Brain,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: Folder,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Technical Decisions",
      value: technicalDecisions,
      icon: Terminal,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "AI Conversations Learned",
      value: conversationsLearned,
      icon: MessageSquare,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-6 rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.08] hover:bg-[#0E0E0E]/80 transition-all flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-none">
                {stat.label}
              </span>
              <span className="text-3xl font-extrabold text-white tracking-tight mt-1">
                {stat.value}
              </span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-center ${stat.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
