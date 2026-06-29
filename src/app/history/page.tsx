"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  limit,
  updateDoc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryStats from "@/components/history/HistoryStats";
import HistoryFilters from "@/components/history/HistoryFilters";
import TransferHistoryCard from "@/components/history/TransferHistoryCard";
import TransferDetailsModal from "@/components/history/TransferDetailsModal";
import EmptyHistory from "@/components/history/EmptyHistory";

import type { TransferDoc } from "@/components/history/TransferHistoryCard";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const ITEMS_PER_PAGE = 6;

export default function HistoryPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Data states
  const [transfers, setTransfers] = useState<TransferDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDest, setSelectedDest] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal state
  const [selectedTransfer, setSelectedTransfer] = useState<TransferDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast Helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch Transfers on mount/user change
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTransfers = async () => {
      setLoading(true);
      try {
        // Query user's transfers (capped at 200 for performance and limit reads)
        const q = query(
          collection(db, "transfers"),
          where("userId", "==", user.uid),
          limit(200)
        );
        const querySnapshot = await getDocs(q);
        const records: TransferDoc[] = [];
        querySnapshot.forEach((docSnap) => {
          records.push({ id: docSnap.id, ...docSnap.data() } as TransferDoc);
        });

        // Sort transfers client-side: newest first
        records.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return bTime - aTime;
        });

        setTransfers(records);

        // Run background migration for legacy documents missing a title
        querySnapshot.forEach(async (docSnap) => {
          const data = docSnap.data();
          if (!data.title) {
            let migratedTitle = "";
            if (data.summary && data.summary.replace(/[#*`"']/g, "").trim().length < 60) {
              migratedTitle = data.summary.replace(/[#*`"']/g, "").trim();
            } else if (data.generatedPrompt || data.generatedContext) {
              const promptVal = data.generatedPrompt || data.generatedContext || "";
              const clean = promptVal.replace(/[#*`"']/g, "").trim();
              if (clean.includes("CONTINUE PREVIOUS AI CONVERSATION") || clean.length < 6) {
                migratedTitle = "AI Conversation Transfer";
              } else {
                migratedTitle = clean.substring(0, 60) + (clean.length > 60 ? "..." : "");
              }
            } else {
              migratedTitle = "AI Conversation Transfer";
            }

            try {
              await updateDoc(doc(db, "transfers", docSnap.id), {
                title: migratedTitle,
                summary: data.summary || "Transferred conversation details.",
              });
              // Refresh state list items inline
              setTransfers((prev) =>
                prev.map((t) => (t.id === docSnap.id ? { ...t, title: migratedTitle } : t))
              );
            } catch (migErr) {
              console.error("Background migration failed for doc:", docSnap.id, migErr);
            }
          }
        });
      } catch (err) {
        console.error("Firestore read error:", err);
        showToast("Error retrieving transfer logs.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [user]);

  // Auto-open modal from query param "id"
  useEffect(() => {
    const transferId = searchParams.get("id");
    if (transferId && transfers.length > 0) {
      const match = transfers.find((t) => t.id === transferId);
      if (match) {
        setSelectedTransfer(match);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, transfers]);

  // Handle Delete
  const handleDeleteTransfer = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transfers", id));
      setTransfers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSource("all");
    setSelectedDest("all");
    setSelectedStatus("all");
    setSelectedDate("all");
    setCurrentPage(1);
    showToast("Filters cleared", "success");
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedSource !== "all" || 
    selectedDest !== "all" || 
    selectedStatus !== "all" || 
    selectedDate !== "all";

  // Reset pagination page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSource, selectedDest, selectedStatus, selectedDate]);

  // Compute stats metrics
  const stats = useMemo(() => {
    const total = transfers.length;
    const successful = transfers.filter((t) => t.status === "completed").length;

    // Source Model counts
    const sourceCounts: Record<string, number> = {};
    // Destination Model counts
    const destCounts: Record<string, number> = {};

    transfers.forEach((t) => {
      const src = (t.sourceModel || "").toLowerCase();
      const dst = (t.destinationModel || t.targetModel || "").toLowerCase();

      if (src) sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      if (dst) destCounts[dst] = (destCounts[dst] || 0) + 1;
    });

    let mostSource = "None";
    let maxSourceCount = 0;
    Object.entries(sourceCounts).forEach(([model, count]) => {
      if (count > maxSourceCount) {
        maxSourceCount = count;
        mostSource = model;
      }
    });

    let mostDest = "None";
    let maxDestCount = 0;
    Object.entries(destCounts).forEach(([model, count]) => {
      if (count > maxDestCount) {
        maxDestCount = count;
        mostDest = model;
      }
    });

    // Recent activity label
    let recentLabel = "None";
    if (transfers.length > 0) {
      const latestTime = Math.max(...transfers.map(t => {
        if (!t.createdAt) return 0;
        return t.createdAt.toDate ? t.createdAt.toDate().getTime() : (t.createdAt.seconds ? t.createdAt.seconds * 1000 : new Date(t.createdAt).getTime());
      }));
      
      if (latestTime > 0) {
        const date = new Date(latestTime);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

        if (latestTime >= startOfToday) {
          recentLabel = "Today";
        } else if (latestTime >= startOfYesterday) {
          recentLabel = "Yesterday";
        } else {
          const diffDays = Math.floor((startOfToday - latestTime) / (24 * 60 * 60 * 1000)) + 1;
          recentLabel = diffDays <= 7 ? `${diffDays} days ago` : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        }
      }
    }

    return {
      total,
      successful,
      mostSource,
      mostDest,
      recentLabel
    };
  }, [transfers]);

  // Filtered List
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      // 1. Text Search
      if (searchQuery.trim() !== "") {
        const queryLower = searchQuery.toLowerCase();
        const title = (t.title || "").toLowerCase();
        const src = (t.sourceModel || "").toLowerCase();
        const dst = (t.destinationModel || t.targetModel || "").toLowerCase();
        const prompt = (t.generatedPrompt || t.generatedContext || "").toLowerCase();

        const matchText = 
          title.includes(queryLower) ||
          src.includes(queryLower) ||
          dst.includes(queryLower) ||
          prompt.includes(queryLower);

        if (!matchText) return false;
      }

      // 2. Source Model Filter
      if (selectedSource !== "all") {
        if ((t.sourceModel || "").toLowerCase() !== selectedSource) return false;
      }

      // 3. Destination Model Filter
      if (selectedDest !== "all") {
        const dst = (t.destinationModel || t.targetModel || "").toLowerCase();
        if (dst !== selectedDest) return false;
      }

      // 4. Status Filter
      if (selectedStatus !== "all") {
        if (t.status !== selectedStatus) return false;
      }

      // 5. Date Filter
      if (selectedDate !== "all") {
        if (!t.createdAt) return false;
        const time = t.createdAt.toDate ? t.createdAt.toDate().getTime() : (t.createdAt.seconds ? t.createdAt.seconds * 1000 : new Date(t.createdAt).getTime());
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (selectedDate === "today") {
          const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          if (time < todayStart) return false;
        } else if (selectedDate === "7days") {
          if (time < now - 7 * oneDay) return false;
        } else if (selectedDate === "30days") {
          if (time < now - 30 * oneDay) return false;
        }
      }

      return true;
    });
  }, [transfers, searchQuery, selectedSource, selectedDest, selectedStatus, selectedDate]);

  // Paginated List
  const totalPages = Math.ceil(filteredTransfers.length / ITEMS_PER_PAGE);
  const paginatedTransfers = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransfers.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredTransfers, currentPage]);

  const handleOpenDetails = (transfer: TransferDoc) => {
    setSelectedTransfer(transfer);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedTransfer(null);
    setIsModalOpen(false);
  };

  // Render Skeletons
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse flex flex-col justify-between min-h-[220px]"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-1/4" />
            </div>
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-5/6" />
            </div>
          </div>
          <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <div className="h-8 bg-white/5 rounded w-1/4" />
            <div className="h-8 bg-white/5 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 w-full relative min-h-[70vh] pb-12"
    >
      <HistoryHeader />

      <HistoryStats
        totalCount={stats.total}
        successCount={stats.successful}
        mostUsedSource={stats.mostSource}
        mostUsedDest={stats.mostDest}
        recentActivity={stats.recentLabel}
        loading={loading}
      />

      <HistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedDest={selectedDest}
        setSelectedDest={setSelectedDest}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {loading ? (
        renderSkeletons()
      ) : transfers.length === 0 ? (
        <EmptyHistory />
      ) : filteredTransfers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center mt-12 bg-white/[0.01] border border-white/[0.03] rounded-3xl">
          <p className="text-[15px] font-medium text-white/50 mb-2">No matching transfers found</p>
          <p className="text-[13px] text-white/30 mb-6 max-w-sm">Try broadening your search query or removing active filters.</p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white/80 hover:text-white transition-all text-[13px] font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid Layout of Cards */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            <AnimatePresence mode="popLayout">
              {paginatedTransfers.map((transfer) => (
                <TransferHistoryCard
                  key={transfer.id}
                  transfer={transfer}
                  onViewDetails={handleOpenDetails}
                  onDelete={handleDeleteTransfer}
                  onShowToast={showToast}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/[0.04]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-white/[0.02] text-white transition-all active:scale-95 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[13.5px] font-semibold text-white/50">
                Page <span className="text-white/80">{currentPage}</span> of <span className="text-white/80">{totalPages}</span>
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-white/[0.02] text-white transition-all active:scale-95 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      <TransferDetailsModal
        transfer={selectedTransfer}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        onDelete={handleDeleteTransfer}
        onShowToast={showToast}
      />

      {/* Custom Premium Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`px-4.5 py-3.5 rounded-2xl border text-[13px] font-semibold flex items-center gap-2.5 shadow-2xl backdrop-blur-xl ${
                t.type === "success" 
                  ? "bg-[#10A37F]/10 border-[#10A37F]/20 text-[#10A37F] shadow-[#10A37F]/5" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-500/5"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${t.type === "success" ? "bg-[#10A37F]" : "bg-rose-400"}`} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
