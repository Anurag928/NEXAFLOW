"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MessageSquare, Star, Trash2, Edit3, Check } from "lucide-react";
import { type MemoryDoc } from "./MemoryCard";

interface MemoryModalProps {
  memory: MemoryDoc | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (memory: MemoryDoc) => void;
  onDelete: (memory: MemoryDoc) => void;
  onToggleImportant: (memory: MemoryDoc) => void;
}

export default function MemoryModal({
  memory,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleImportant,
}: MemoryModalProps) {
  if (!memory) return null;

  // Format date helper
  const getFormattedDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categoryLabels = {
    project: "Project Workspace Context",
    preference: "User Developer Preference",
    decision: "Architectural & Technical Decision",
    context: "Historical Conversation Context",
  };

  const categoryColors = {
    project: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    preference: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400",
    decision: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    context: "border-sky-500/20 bg-sky-500/5 text-sky-400",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#000]/60 backdrop-blur-md cursor-default"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                  Memory Detail View
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight pr-4">
                  {memory.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.04] text-white/40 hover:text-white/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {/* Category Badge & Star important control */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest leading-none ${categoryColors[memory.category]}`}>
                  {categoryLabels[memory.category]}
                </span>
                
                <button
                  onClick={() => onToggleImportant(memory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    memory.important
                      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/25"
                      : "text-white/30 bg-white/[0.02] border-white/[0.05] hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  <Star className="w-3.5 h-3.5" fill={memory.important ? "currentColor" : "none"} />
                  <span>{memory.important ? "Important Context" : "Mark Important"}</span>
                </button>
              </div>

              {/* Memory description */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-white/30 tracking-wider">
                  Memory Payload
                </h3>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                  <p className="text-[13.5px] leading-relaxed text-white/80 whitespace-pre-wrap select-text">
                    {memory.content}
                  </p>
                </div>
              </div>

              {/* Project Tech Stack checkboxes */}
              {memory.category === "project" && memory.metadata?.stack && memory.metadata.stack.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-white/30 tracking-wider">
                    Technology Stack
                  </h3>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    {memory.metadata.stack.map((tech) => (
                      <div key={tech} className="flex items-center gap-2 text-xs text-white/70 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                        <span>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source conversation & timelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-white/30 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
                      Last Updated
                    </span>
                    <span className="text-xs text-white/60 font-semibold mt-1">
                      {getFormattedDate(memory.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-white/30 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
                      Source Node
                    </span>
                    <span className="text-xs text-white/60 font-semibold mt-1 truncate max-w-[180px]">
                      {memory.source || "Manual Entry"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white/[0.01] border-t border-white/[0.04] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onDelete(memory);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-xs font-bold text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete memory</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    onEdit(memory);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit memory</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-[12px] hover:bg-neutral-200 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
