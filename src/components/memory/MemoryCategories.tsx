"use client";

import { motion } from "framer-motion";
import { Layers, Folder, Sliders, Terminal, MessageSquare } from "lucide-react";

export type CategoryId = "all" | "project" | "preference" | "decision" | "context";

interface MemoryCategoriesProps {
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
  counts: Record<CategoryId, number>;
}

export default function MemoryCategories({
  activeCategory,
  onCategoryChange,
  counts,
}: MemoryCategoriesProps) {
  const tabs = [
    { id: "all" as const, label: "All Memories", icon: Layers },
    { id: "project" as const, label: "Projects", icon: Folder },
    { id: "preference" as const, label: "Preferences", icon: Sliders },
    { id: "decision" as const, label: "Technical Decisions", icon: Terminal },
    { id: "context" as const, label: "Conversation Context", icon: MessageSquare },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-1">
      <div className="flex p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md min-w-max gap-1">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const Icon = tab.icon;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold select-none transition-colors duration-200 cursor-pointer ${
                isActive ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-category-pill"
                  className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">{tab.label}</span>
              <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/50 leading-none">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
