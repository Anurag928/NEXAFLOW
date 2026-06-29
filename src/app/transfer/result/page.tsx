"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

import TransferSummary from "@/components/TransferSummary";
import ProcessingTimeline from "@/components/ProcessingTimeline";
import PromptViewer from "@/components/PromptViewer";
import TransferActions from "@/components/TransferActions";

interface TransferRecord {
  id: string;
  sourceModel: string;
  targetModel?: string;
  destinationModel?: string;
  inputType: string;
  status: string;
  generatedPrompt?: string;
  generatedContext?: string;
  resultContext?: string;
  createdAt: any;
  userId?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
  id: number;
}

// Stagger entrance transitions
const pageEntranceVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      staggerChildren: 0.12,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div className="h-6 w-44 bg-white/5 rounded-lg" />
        <div className="h-8 w-80 bg-white/5 rounded-lg" />
        <div className="h-4 w-96 bg-white/5 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="h-40 bg-white/5 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-white/5 rounded-xl" />
              <div className="w-8 h-4 bg-white/5 rounded" />
              <div className="w-12 h-12 bg-white/5 rounded-xl" />
            </div>
            <div className="h-3 w-2/3 bg-white/5 rounded" />
          </div>
          <div className="h-48 bg-white/5 border border-white/[0.04] rounded-2xl p-5" />
          <div className="h-12 bg-white/5 border border-white/[0.04] rounded-2xl" />
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-2">
          <div className="h-[430px] bg-white/5 border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-48 bg-white/5 rounded" />
              <div className="h-8 w-24 bg-white/5 rounded-lg" />
            </div>
            <div className="flex-1 bg-black/25 rounded-xl border border-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transferId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<TransferRecord | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (!transferId) {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        const docRef = doc(db, "transfers", transferId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecord({ id: docSnap.id, ...docSnap.data() } as TransferRecord);
        }
      } catch (err) {
        console.error("Error fetching transfer record:", err);
        showToast("Failed to fetch transfer migration details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [transferId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-5 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl font-bold">
          ⚠️
        </div>
        <div className="flex flex-col gap-1.5 max-w-sm">
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            No Transfer Found
          </h2>
          <p className="text-xs text-white/40 leading-relaxed font-semibold">
            We couldn't locate the migration record matching this ID, or the transfer details do not exist.
          </p>
        </div>
        <Link
          href="/transfer"
          className="px-5 py-3 rounded-xl bg-white text-black font-extrabold text-[12px] hover:bg-neutral-200 transition-colors uppercase tracking-wider shadow-md select-none"
        >
          Create New Transfer
        </Link>
      </div>
    );
  }

  const destModel = record.destinationModel || record.targetModel || "gemini";
  const displayPrompt = record.generatedPrompt || record.generatedContext || record.resultContext || "";

  return (
    <motion.div
      variants={pageEntranceVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full max-w-6xl mx-auto"
    >
      {/* HEADER SECTION */}
      <motion.div
        variants={cardItemVariants}
        className="flex flex-col items-center text-center gap-2.5 py-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Transfer Complete</span>
        </motion.div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mt-1">
          Your AI Context Is Ready
        </h1>
        <p className="text-xs sm:text-sm text-white/50 max-w-lg font-semibold leading-relaxed">
          Your conversation memory has been transformed into a continuation prompt.
        </p>
      </motion.div>

      {/* Centered Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div variants={cardItemVariants}>
            <TransferSummary
              sourceModel={record.sourceModel}
              destinationModel={destModel}
              status={record.status}
              createdAt={record.createdAt}
            />
          </motion.div>

          <motion.div variants={cardItemVariants}>
            <ProcessingTimeline />
          </motion.div>

          <motion.div variants={cardItemVariants}>
            <TransferActions destinationModel={destModel} />
          </motion.div>
        </div>

        {/* Right Column Prompt Editor Card */}
        <div className="lg:col-span-2">
          <motion.div variants={cardItemVariants}>
            <PromptViewer
              promptText={displayPrompt}
              onCopySuccess={(msg) => showToast(msg, "success")}
            />
          </motion.div>
        </div>
      </div>

      {/* Dynamic Toast Notifications list overlay */}
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
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
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
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}

export default function TransferResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3 bg-[#050505]">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
          <span className="text-[12px] font-medium text-white/40 uppercase tracking-widest font-mono">
            Loading Suspense Node...
          </span>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
