"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Plus, Check } from "lucide-react";
import { type MemoryDoc } from "./MemoryCard";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    category: "project" | "preference" | "decision" | "context";
    title: string;
    content: string;
    important: boolean;
    metadata?: {
      status?: string;
      stack?: string[];
    };
  }) => void;
  memoryToEdit?: MemoryDoc | null;
}

export default function AddMemoryModal({
  isOpen,
  onClose,
  onSave,
  memoryToEdit = null,
}: AddMemoryModalProps) {
  const [category, setCategory] = useState<"project" | "preference" | "decision" | "context">("preference");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  
  // Project metadata fields
  const [projectStatus, setProjectStatus] = useState("Active");
  const [stackInput, setStackInput] = useState("");

  // Update form fields if editing a memory
  useEffect(() => {
    if (memoryToEdit) {
      setCategory(memoryToEdit.category);
      setTitle(memoryToEdit.title);
      setContent(memoryToEdit.content);
      setImportant(memoryToEdit.important);
      if (memoryToEdit.category === "project") {
        setProjectStatus(memoryToEdit.metadata?.status || "Active");
        setStackInput(memoryToEdit.metadata?.stack?.join(", ") || "");
      } else {
        setProjectStatus("Active");
        setStackInput("");
      }
    } else {
      // Clear form
      setCategory("preference");
      setTitle("");
      setContent("");
      setImportant(false);
      setProjectStatus("Active");
      setStackInput("");
    }
  }, [memoryToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let metadata: any = null;
    if (category === "project") {
      const stack = stackInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      metadata = {
        status: projectStatus,
        stack: stack,
      };
    }

    onSave({
      category,
      title: title.trim(),
      content: content.trim(),
      important,
      metadata,
    });
    onClose();
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

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                  {memoryToEdit ? "Edit Existing Node" : "Save New Node"}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {memoryToEdit ? "Edit AI Memory" : "Add Custom Memory"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.04] text-white/40 hover:text-white/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
              <div className="flex-grow overflow-y-auto p-6 space-y-5 no-scrollbar">
                {/* Memory Category */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">
                    Memory Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#050505] border border-white/[0.05] focus:border-white/10 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="preference">Preference (style, explanations)</option>
                    <option value="project">Project (app workspaces, code repositories)</option>
                    <option value="decision">Technical Decision (database, frameworks)</option>
                    <option value="context">Conversation Context (general facts, snippets)</option>
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Coding Style, NexaFlow Tech Stack, Authentication Decision"
                    className="w-full px-4 py-3 bg-[#050505] border border-white/[0.05] focus:border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
                  />
                </div>

                {/* Content description */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">
                    Memory Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      category === "preference"
                        ? "e.g. User prefers detailed explanations using TypeScript rather than vanilla JS."
                        : category === "project"
                        ? "e.g. NexaFlow is an AI portability tool designed to sync history files between models."
                        : "e.g. Using Firebase Firestore database for real-time local sync."
                    }
                    className="w-full px-4 py-3 bg-[#050505] border border-white/[0.05] focus:border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Project-Specific Fields */}
                {category === "project" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-2 border-t border-white/[0.03]"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">
                          Project Status
                        </label>
                        <select
                          value={projectStatus}
                          onChange={(e) => setProjectStatus(e.target.value)}
                          className="w-full px-4 py-3 bg-[#050505] border border-white/[0.05] focus:border-white/10 rounded-xl text-xs text-white focus:outline-none transition-colors"
                        >
                          <option value="Active">Active</option>
                          <option value="Proposed">Proposed</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">
                          Technology Stack
                        </label>
                        <input
                          type="text"
                          value={stackInput}
                          onChange={(e) => setStackInput(e.target.value)}
                          placeholder="Next.js, Firebase, Groq (comma separated)"
                          className="w-full px-4 py-3 bg-[#050505] border border-white/[0.05] focus:border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Important Checkbox */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.03]">
                  <button
                    type="button"
                    onClick={() => setImportant(!important)}
                    className={`flex items-center justify-center w-5 h-5 rounded-lg border transition-all cursor-pointer ${
                      important
                        ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
                        : "bg-transparent border-white/[0.08] text-transparent hover:border-white/[0.2]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setImportant(!important)}>
                    <Star className={`w-3.5 h-3.5 ${important ? "text-yellow-400" : "text-white/20"}`} fill={important ? "currentColor" : "none"} />
                    <span className="text-xs font-semibold text-white/70">
                      Mark as Important (Pins this memory as high-priority context)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-white/[0.01] border-t border-white/[0.04] flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-[12px] hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>{memoryToEdit ? "Save Changes" : "Create Memory"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
