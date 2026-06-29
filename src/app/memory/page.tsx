"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Brain, AlertCircle, RefreshCw, X } from "lucide-react";

import MemoryStats from "@/components/memory/MemoryStats";
import MemoryCategories, { type CategoryId } from "@/components/memory/MemoryCategories";
import MemorySearch from "@/components/memory/MemorySearch";
import MemoryCard, { type MemoryDoc } from "@/components/memory/MemoryCard";
import MemoryModal from "@/components/memory/MemoryModal";
import AddMemoryModal from "@/components/memory/AddMemoryModal";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function MemoryPage() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryDoc[]>([]);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryDoc | null>(null);
  const [memoryToEdit, setMemoryToEdit] = useState<MemoryDoc | null>(null);

  // Show toast notification helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Real-time Firestore sync for Memories
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "memory"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const memList: MemoryDoc[] = [];
        snapshot.forEach((docSnap) => {
          memList.push({ id: docSnap.id, ...docSnap.data() } as MemoryDoc);
        });
        
        // Sort memories: important first, then by updatedAt descending
        memList.sort((a, b) => {
          if (a.important && !b.important) return -1;
          if (!a.important && b.important) return 1;
          
          const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
          const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;
          return bTime - aTime;
        });

        setMemories(memList);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        showToast("Error loading memory workspace.", "error");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Query Transfers collection for "Conversations Learned" count
  useEffect(() => {
    if (!user) return;

    const fetchTransfersCount = async () => {
      try {
        const q = query(
          collection(db, "transfers"),
          where("userId", "==", user.uid),
          where("status", "==", "completed")
        );
        const querySnapshot = await getDocs(q);
        setConversationsCount(querySnapshot.size);
      } catch (err) {
        console.error("Error fetching transfers count:", err);
      }
    };

    fetchTransfersCount();
  }, [user]);

  // Compute memory counts dynamically for category tab badges
  const counts = useMemo(() => {
    const total = memories.length;
    const project = memories.filter((m) => m.category === "project").length;
    const preference = memories.filter((m) => m.category === "preference").length;
    const decision = memories.filter((m) => m.category === "decision").length;
    const context = memories.filter((m) => m.category === "context").length;
    return { all: total, project, preference, decision, context };
  }, [memories]);

  // Dynamic filter and search memories list
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      // 1. Category Filter
      if (activeCategory !== "all" && mem.category !== activeCategory) {
        return false;
      }
      
      // 2. Search Query Filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchesTitle = mem.title.toLowerCase().includes(q);
      const matchesContent = mem.content.toLowerCase().includes(q);
      const matchesCategory = mem.category.toLowerCase().includes(q);
      const matchesStack = mem.metadata?.stack?.some((s) => s.toLowerCase().includes(q)) || false;
      const matchesStatus = mem.metadata?.status?.toLowerCase().includes(q) || false;
      
      return matchesTitle || matchesContent || matchesCategory || matchesStack || matchesStatus;
    });
  }, [memories, activeCategory, searchQuery]);

  // Dynamic Statistics
  const activeProjectsCount = useMemo(() => {
    return memories.filter((m) => m.category === "project" && m.metadata?.status !== "Archived").length;
  }, [memories]);

  const technicalDecisionsCount = useMemo(() => {
    return memories.filter((m) => m.category === "decision").length;
  }, [memories]);

  // CRUD Handlers
  const handleSaveMemory = async (data: any) => {
    if (!user) return;

    try {
      if (memoryToEdit) {
        // EDIT MODE
        const docRef = doc(db, "memory", memoryToEdit.id);
        await updateDoc(docRef, {
          category: data.category,
          title: data.title,
          content: data.content,
          important: data.important,
          metadata: data.metadata || null,
          updatedAt: serverTimestamp(),
        });
        showToast("Memory node updated successfully.");
      } else {
        // CREATE MODE
        await addDoc(collection(db, "memory"), {
          userId: user.uid,
          category: data.category,
          title: data.title,
          content: data.content,
          important: data.important,
          metadata: data.metadata || null,
          source: "Manual Entry",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showToast("Custom memory node created.");
      }
    } catch (err: any) {
      console.error("Error saving memory:", err);
      showToast("Failed to save memory node.", "error");
    } finally {
      setMemoryToEdit(null);
    }
  };

  const handleDeleteMemory = async (memory: MemoryDoc) => {
    try {
      await deleteDoc(doc(db, "memory", memory.id));
      showToast("Memory node deleted.");
    } catch (err: any) {
      console.error("Error deleting memory:", err);
      showToast("Failed to delete memory.", "error");
    }
  };

  const handleToggleImportant = async (memory: MemoryDoc) => {
    try {
      const docRef = doc(db, "memory", memory.id);
      await updateDoc(docRef, {
        important: !memory.important,
        updatedAt: serverTimestamp(),
      });
      showToast(memory.important ? "Memory unpinned." : "Memory pinned as important.");
    } catch (err: any) {
      console.error("Error toggling important flag:", err);
      showToast("Failed to pin memory.", "error");
    }
  };

  const handleOpenEdit = (memory: MemoryDoc) => {
    setMemoryToEdit(memory);
    setIsAddModalOpen(true);
  };

  const handleOpenView = (memory: MemoryDoc) => {
    setSelectedMemory(memory);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none">
              Your AI Memory
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Memory Active</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/50 font-semibold leading-relaxed">
            NexaFlow remembers what matters so every AI conversation starts smarter.
          </p>
        </div>

        <button
          onClick={() => {
            setMemoryToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-extrabold text-[12px] hover:bg-neutral-200 transition-colors uppercase tracking-wider self-start md:self-auto shadow-md active:scale-[0.98] select-none cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* 2. MEMORY OVERVIEW STATS */}
      <MemoryStats
        totalMemories={memories.length}
        activeProjects={activeProjectsCount}
        technicalDecisions={technicalDecisionsCount}
        conversationsLearned={conversationsCount}
      />

      {/* SEARCH AND CATEGORIES GRID FILTER */}
      <div className="space-y-6 pt-2">
        <MemoryCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />

        <MemorySearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* LOADING AND DATA GRID CONTROLS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider font-mono">
            Retrieving local memory layer...
          </span>
        </div>
      ) : filteredMemories.length === 0 ? (
        /* EMPTY STATE */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center p-12 md:p-16 rounded-3xl bg-[#0A0A0A]/50 border border-white/[0.04] max-w-lg mx-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            <Brain className="w-6 h-6 text-white/30" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mb-2">
            No AI memories yet
          </h3>
          <p className="text-xs text-white/40 leading-relaxed font-semibold mb-6 max-w-xs">
            {searchQuery || activeCategory !== "all"
              ? "No memories match your active search filters. Try clearing the query or selecting another tab."
              : "Your important context will appear here after conversations are transferred."}
          </p>
          {searchQuery || activeCategory !== "all" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-[12px] font-bold text-white transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => {
                setMemoryToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-[12px] hover:bg-neutral-200 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Create First Memory
            </button>
          )}
        </motion.div>
      ) : (
        /* MEMORIES CARDS LIST */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteMemory}
                onToggleImportant={handleToggleImportant}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* DETAIL MODAL DRAWER */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMemory(null);
        }}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteMemory}
        onToggleImportant={handleToggleImportant}
      />

      {/* MANUAL INPUT ADD/EDIT MODAL */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setMemoryToEdit(null);
        }}
        onSave={handleSaveMemory}
        memoryToEdit={memoryToEdit}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[12px] font-bold max-w-sm transition-all ${
                toast.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white/20 hover:text-white/60 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
