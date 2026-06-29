"use client";

import { motion } from "framer-motion";
import { Calendar, Trash2, Edit3, Eye, Star, Check } from "lucide-react";

export interface MemoryDoc {
  id: string;
  userId: string;
  category: "project" | "preference" | "decision" | "context";
  title: string;
  content: string;
  source: string;
  important: boolean;
  createdAt: any;
  updatedAt: any;
  metadata?: {
    status?: string;
    stack?: string[];
  };
}

interface MemoryCardProps {
  memory: MemoryDoc;
  onView: (memory: MemoryDoc) => void;
  onEdit: (memory: MemoryDoc) => void;
  onDelete: (memory: MemoryDoc) => void;
  onToggleImportant: (memory: MemoryDoc) => void;
}

export default function MemoryCard({
  memory,
  onView,
  onEdit,
  onDelete,
  onToggleImportant,
}: MemoryCardProps) {
  const { category, title, content, important, source, updatedAt } = memory;

  // Format date helper
  const getFormattedDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "1 day ago";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  // Category visual styles
  const categoryStyles = {
    project: {
      label: "Project",
      badgeClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    preference: {
      label: "Preference",
      badgeClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    decision: {
      label: "Technical Decision",
      badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    context: {
      label: "Conversation Context",
      badgeClass: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  };

  const styleConfig = categoryStyles[category] || categoryStyles.context;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.04] hover:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-[#0C0C0C] transition-all duration-300 min-h-[220px]"
    >
      <div>
        {/* Header Badging & Star */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styleConfig.badgeClass}`}>
              {styleConfig.label}
            </span>
            {memory.metadata?.status && (
              <span className="px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-white/55">
                {memory.metadata.status}
              </span>
            )}
          </div>
          <button
            onClick={() => onToggleImportant(memory)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              important
                ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/25"
                : "text-white/20 bg-transparent border-transparent hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={important ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-[14.5px] font-bold text-white tracking-tight leading-tight group-hover:text-white/95 transition-colors mb-2 truncate">
          {title}
        </h3>

        {/* Category-Specific Contents */}
        {category === "project" ? (
          <div className="mb-4">
            <p className="text-[12.5px] text-white/50 line-clamp-2 leading-relaxed mb-3">
              {content}
            </p>
            {memory.metadata?.stack && memory.metadata.stack.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
                {memory.metadata.stack.map((tech) => (
                  <div key={tech} className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : category === "preference" ? (
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block mb-1">
              Development Preference
            </span>
            <p className="text-[13px] italic text-white/70 border-l border-white/10 pl-3 py-0.5 leading-relaxed line-clamp-3">
              &ldquo;{content}&rdquo;
            </p>
          </div>
        ) : category === "decision" ? (
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block mb-1">
              Architecture / Decision
            </span>
            <p className="text-[12.5px] text-white/60 line-clamp-3 leading-relaxed">
              {content}
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-[12.5px] text-white/60 line-clamp-3 leading-relaxed">
              {content}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10.5px] text-white/30 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-60" />
            <span>{getFormattedDate(updatedAt)}</span>
          </div>
          {source && (
            <span className="truncate max-w-[100px]" title={source}>
              {source}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(memory)}
            title="View Details"
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-white/40 hover:text-white/80 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(memory)}
            title="Edit Memory"
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-white/40 hover:text-white/80 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(memory)}
            title="Delete Memory"
            className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-500/40 hover:text-red-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
