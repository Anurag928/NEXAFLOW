"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import DashboardHeader from "@/components/DashboardHeader";
import HeroFeatureCard from "@/components/HeroFeatureCard";
import StatsCard from "@/components/StatsCard";
import RecentTransfers, { type TransferRecord } from "@/components/RecentTransfers";
import MemoryCard from "@/components/MemoryCard";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function formatRelativeTime(dateInput: any): string {
  if (!dateInput) return "Recent";
  let date: Date;
  if (typeof dateInput.toDate === "function") {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (dateInput?.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }
  
  if (isNaN(date.getTime())) return "Recent";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const getModelDisplayName = (modelKey: string) => {
  if (!modelKey) return "Unknown";
  const mapping: Record<string, string> = {
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
    deepseek: "DeepSeek",
    grok: "Grok",
  };
  return mapping[modelKey.toLowerCase()] || modelKey;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stats values
  const [memoryCount, setMemoryCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [connectedCount, setConnectedCount] = useState(0);

  // Transfers lists
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);

  // Toast alerts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Real-time Firestore Listeners
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // 1. Memory query listener
    const memQuery = query(collection(db, "memory"), where("userId", "==", user.uid));
    const unsubscribeMemory = onSnapshot(
      memQuery, 
      (snapshot) => {
        setMemoryCount(snapshot.size);
      },
      (err) => {
        console.error("Memory listener failed:", err);
        setErrorMsg("Failed to sync AI memory logs. Check your database permission schema.");
      }
    );

    // 2. Connected models query listener
    const connQuery = query(collection(db, "connectedModels"), where("userId", "==", user.uid));
    const unsubscribeConnected = onSnapshot(
      connQuery, 
      (snapshot) => {
        setConnectedCount(snapshot.size);
      },
      (err) => {
        console.error("Connected models listener failed:", err);
      }
    );

    // 3. Transfers query listener (fetches up to 100 items for real-time counts and client-side sorting)
    const transQuery = query(collection(db, "transfers"), where("userId", "==", user.uid));
    const unsubscribeTransfers = onSnapshot(
      transQuery, 
      (snapshot) => {
        setTransferCount(snapshot.size);
        
        const rawDocs: any[] = [];
        snapshot.forEach((docSnap) => {
          rawDocs.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Client-side sort: newest first
        rawDocs.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return bTime - aTime;
        });

        // Take latest 5 items for dashboard feed
        const dashboardRecords: TransferRecord[] = rawDocs.slice(0, 5).map((d) => {
          let resolvedTitle = "";
          if (d.title) {
            resolvedTitle = d.title;
          } else if (d.summary && d.summary.replace(/[#*`"']/g, "").trim().length < 60) {
            resolvedTitle = d.summary.replace(/[#*`"']/g, "").trim();
          } else if (d.generatedPrompt) {
            const clean = d.generatedPrompt.replace(/[#*`"']/g, "").trim();
            resolvedTitle = clean.substring(0, 60) + (clean.length > 60 ? "..." : "");
          } else {
            resolvedTitle = "AI Conversation Transfer";
          }

          let resolvedSummary = "";
          if (d.summary) {
            resolvedSummary = d.summary;
          } else if (d.generatedPrompt) {
            const clean = d.generatedPrompt.replace(/[#*`"']/g, "").trim();
            resolvedSummary = clean.substring(0, 100) + (clean.length > 100 ? "..." : "");
          } else {
            resolvedSummary = "AI conversation details transformed successfully.";
          }

          return {
            id: d.id,
            title: resolvedTitle,
            summary: resolvedSummary,
            source: getModelDisplayName(d.sourceModel),
            destination: getModelDisplayName(d.destinationModel),
            timestamp: formatRelativeTime(d.createdAt),
            generatedPrompt: d.generatedPrompt || "",
            sourceModel: d.sourceModel || "chatgpt",
            destinationModel: d.destinationModel || "gemini",
            shareUrl: d.shareUrl || "",
          };
        });

        setTransfers(dashboardRecords);
        setLoading(false);
      },
      (err) => {
        console.error("Transfers listener failed:", err);
        setErrorMsg("Database connection error. Failed to load transfers.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeMemory();
      unsubscribeConnected();
      unsubscribeTransfers();
    };
  }, [user]);

  // Callbacks
  const handleView = (id: string) => {
    router.push(`/history?id=${id}`);
  };

  const handleCopy = (prompt: string) => {
    if (!prompt) {
      showToast("No context prompt available to copy.", "error");
      return;
    }
    navigator.clipboard.writeText(prompt);
    showToast("Context copied successfully", "success");
  };

  const handleContinue = (id: string) => {
    router.push(`/transfer?transferId=${id}`);
  };

  const handleCreateFirst = () => {
    router.push("/transfer");
  };

  // Loading indicators
  if (loading) {
    return (
      <div className="space-y-6 pb-12 w-full">
        <div className="h-20 rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6 animate-pulse flex items-center justify-between">
          <div className="h-6 w-48 bg-white/5 rounded" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
        <div className="h-56 rounded-2xl bg-white/[0.01] border border-white/[0.04] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.02] border border-white/[0.04] p-6 animate-pulse flex flex-col justify-between">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-8 w-32 bg-white/5 rounded" />
            </div>
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-white/[0.01] border border-white/[0.04] animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      
      <HeroFeatureCard />

      {/* Error Alert Display */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[13px] font-semibold text-rose-400 mb-8 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatsCard label="AI Memory" value={`${memoryCount} stored`} index={0} />
        <StatsCard label="Transfers" value={`${transferCount} conversations`} index={1} />
        <StatsCard label="Connected Models" value={`${connectedCount} models`} index={2} />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Recent Transfers Feed */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
            <h2 className="text-xl font-bold tracking-tight text-white/90">Recent Transfers</h2>
          </div>
          <RecentTransfers 
            transfers={transfers} 
            onView={handleView}
            onCopy={handleCopy}
            onContinue={handleContinue}
            onCreateFirst={handleCreateFirst}
          />
        </div>
        
        {/* Right Column: AI Suggestion Sidebar */}
        <div className="xl:col-span-1 mt-10 xl:mt-0">
          <MemoryCard />
        </div>
      </div>

      {/* Toast Alert Notification Layer */}
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
                  ? "bg-[#10A37F]/10 border-[#10A37F]/20 text-[#10A37F]" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${t.type === "success" ? "bg-[#10A37F]" : "bg-rose-400"}`} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
