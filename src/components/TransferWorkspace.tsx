"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AIModelSelector from "./AIModelSelector";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const aiModels = [
  {
    name: "ChatGPT",
    logo: "/logos/openai.svg",
    description: "Advanced reasoning and general AI assistant",
    badge: "Most Popular",
    color: "#10A37F"
  },
  {
    name: "Claude",
    logo: "/logos/claude.svg",
    description: "Strong analysis and long-context conversations",
    badge: "Best for Writing",
    color: "#D97757"
  },
  {
    name: "Gemini",
    logo: "/logos/gemini.svg",
    description: "Multimodal AI with Google ecosystem integration",
    badge: "Best Integration",
    color: "#4285F4"
  },
  {
    name: "DeepSeek",
    logo: "/logos/deepseek.svg",
    description: "Efficient coding and reasoning model",
    badge: "Best for Coding",
    color: "#3B82F6"
  },
  {
    name: "Grok",
    logo: "/logos/grok.svg",
    description: "Real-time conversational AI",
    badge: "Real-time AI",
    color: "#E5E5E5"
  }
];

interface Toast {
  message: string;
  type: "success" | "error";
  id: number;
}

export default function TransferWorkspace() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    setRetryError(false);
    try {
      await refreshProfile();
    } catch (err) {
      console.error("Retry failed:", err);
      setRetryError(true);
    } finally {
      setRetrying(false);
    }
  };

  const isLocked = profile?.plan === "free" && (profile?.credits?.used ?? 0) >= 5;

  // Model selector state
  const [destinationModel, setDestinationModel] = useState<string | null>(null);

  // Link input state
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const dest = searchParams.get("dest");
    const prefillUrl = searchParams.get("shareUrl");
    const transferId = searchParams.get("transferId");

    if (dest) {
      setDestinationModel(dest.toLowerCase());
    }
    if (prefillUrl) {
      setShareUrl(prefillUrl);
    }

    if (transferId) {
      const fetchTransferDetails = async () => {
        try {
          const docRef = doc(db, "transfers", transferId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.destinationModel) {
              setDestinationModel(data.destinationModel.toLowerCase());
            }
            if (data.shareLink || data.originalUrl) {
              setShareUrl(data.shareLink || data.originalUrl || "");
            }
            showToast("Loaded previous context details.", "success");
          }
        } catch (err) {
          console.error("Error prefilling transfer context:", err);
          showToast("Failed to load previous transfer context.", "error");
        }
      };
      fetchTransferDetails();
    }
  }, [searchParams]);

  // UI state variables
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to show toast alerts
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Automated step loaders
  const triggerStepAnimations = () => {
    setCurrentStep(1); // Extracting conversation...
    
    const step2Timeout = setTimeout(() => {
      setCurrentStep(2); // Understanding context...
    }, 1500);

    const step3Timeout = setTimeout(() => {
      setCurrentStep(3); // Creating transfer prompt...
    }, 3200);

    return {
      clear: () => {
        clearTimeout(step2Timeout);
        clearTimeout(step3Timeout);
      },
    };
  };

  // Form check
  const isFormValid = destinationModel !== null && shareUrl.trim() !== "";

  // Action: Analyze Conversation
  const handleAnalyze = async () => {
    if (!isFormValid) {
      showToast("Please complete all sections to begin extraction.", "error");
      return;
    }

    setIsAnalyzing(true);
    const timers = triggerStepAnimations();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationModel,
          targetModel: destinationModel, // maps for API backward compatibility
          shareUrl,
          inputType: "link",
          userId: user?.uid || "anonymous",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process transfer request.");
      }

      timers.clear();
      setCurrentStep(4); // Finished
      showToast("Conversation analyzed successfully!", "success");

      // Wait a moment before redirect
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push(`/transfer/result?id=${data.id}`);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      showToast(err.message || "Failed to compile AI prompt. Please try again.", "error");
      timers.clear();
      setIsAnalyzing(false);
      setCurrentStep(0);
    }
  };

  const stepsList = [
    "Extracting conversation...",
    "Understanding context...",
    "Creating transfer prompt...",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-white/60">New Transfer</span>
      </div>

      {/* Header Container */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          Transfer Your AI Conversation
        </h1>
        <p className="text-sm text-white/50 max-w-xl">
          Move your conversation memory between AI models without losing context.
        </p>
      </div>

      {/* Main glass card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#090909]/80 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        
        {loading || retrying ? (
          <div className="animate-pulse flex flex-col gap-6 py-4">
            {/* Target model selector skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-white/5 border border-white/[0.03] rounded-xl" />
                ))}
              </div>
            </div>
            
            <hr className="border-white/[0.04]" />

            {/* Input area skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-12 bg-white/5 border border-white/[0.03] rounded-xl w-full" />
            </div>

            <hr className="border-white/[0.04]" />

            {/* Button skeleton */}
            <div className="h-14 bg-white/5 border border-white/[0.03] rounded-xl w-full" />
          </div>
        ) : retryError || (!profile && user) ? (
          <div className="py-10 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-6 text-rose-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              Failed to load user profile
            </h3>
            <p className="text-xs text-white/40 leading-relaxed mb-8">
              A connection error occurred. Please try again.
            </p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-white text-black hover:bg-[#F0F0F0] text-[13px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] select-none"
            >
              <span>Retry Connection</span>
            </button>
          </div>
        ) : isLocked ? (
          <div className="py-10 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            {/* Lock icon */}
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 text-white/60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              Free transfer limit reached
            </h3>
            
            <p className="text-xs text-white/40 leading-relaxed mb-8">
              You have used all 5 free transfers. Upgrade to continue transferring conversations between AI models.
            </p>

            <div className="w-full bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-white/30 uppercase tracking-wider text-[10px]">FREE PLAN</span>
                <span className="text-white">5 / 5 transfers used</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-1">
                <div className="h-full bg-white/70 rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="text-[10px] text-white/30 text-right mt-1.5 font-semibold">100% completed</div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={() => router.push("/pricing")}
                className="w-full py-3 bg-white text-black hover:bg-[#F0F0F0] text-[13px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] select-none"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Upgrade to Pro</span>
              </button>
              
              <button
                onClick={() => router.push("/pricing")}
                className="w-full py-2.5 bg-transparent hover:bg-white/[0.03] text-white/40 hover:text-white/60 text-[12px] font-bold transition-all cursor-pointer select-none rounded-xl"
              >
                View Plans
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Animated Loading Overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#060606]/90 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative mb-6">
                    {/* Custom Outer Spinning Aura */}
                    <div className="w-16 h-16 border-2 border-white/5 border-t-white/60 rounded-full animate-spin" />
                    {/* Inner Pulsing Core */}
                    <div className="absolute inset-4 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v20M17 5l-5-5-5 5" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-bold text-white mb-6 tracking-tight">
                    Migrating Conversation Memory
                  </h3>
                  
                  <div className="flex flex-col gap-4 max-w-xs w-full text-left">
                    {stepsList.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = currentStep > stepNum;
                      const isActive = currentStep === stepNum;
                      
                      return (
                        <div key={idx} className="flex items-center gap-3.5">
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center relative flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono flex-shrink-0">
                              {stepNum}
                            </div>
                          )}
                          
                          <span className={`text-[13px] font-semibold tracking-tight transition-colors duration-300 ${
                            isCompleted ? "text-emerald-400/90" : isActive ? "text-white" : "text-white/25"
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-6">
              
              {/* Section 2: Destination model */}
              <div className="w-full">
                <AIModelSelector
                  models={aiModels}
                  selectedModel={destinationModel}
                  onSelectModel={(name) => setDestinationModel(name.toLowerCase())}
                  disabled={isAnalyzing}
                />
              </div>

              <hr className="border-white/[0.04]" />

              {/* Section 3: Conversation Input */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">
                    Conversation Input
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    disabled={isAnalyzing}
                    value={shareUrl}
                    onChange={(e) => setShareUrl(e.target.value)}
                    placeholder="Paste your AI conversation share link here..."
                    className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-[13px] text-white placeholder-white/20 transition-all font-semibold"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                </div>

                {/* Support platform list */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                  <span className="text-[10px] text-white/25 font-bold uppercase tracking-wider">Supports:</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" />
                    <span>ChatGPT share links</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
                    <span>Claude shared conversations</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                    <span>Gemini conversations</span>
                  </div>
                </div>
              </div>

              <hr className="border-white/[0.04] mt-1" />

              {/* Section 4: Analyze Button */}
              <div className="relative group mt-1">
                {!isFormValid || isAnalyzing ? null : (
                  <div className="absolute inset-0 bg-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                )}
                <motion.button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!isFormValid || isAnalyzing}
                  whileHover={!isFormValid || isAnalyzing ? {} : { scale: 1.01, y: -1 }}
                  whileTap={!isFormValid || isAnalyzing ? {} : { scale: 0.99 }}
                  className={`w-full py-4 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2.5 transition-all select-none border relative overflow-hidden ${
                    isAnalyzing
                      ? "bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed"
                      : !isFormValid
                      ? "bg-white/[0.01] border-white/[0.03] text-white/15 cursor-not-allowed"
                      : "bg-white text-black hover:bg-[#F0F0F0] border-transparent cursor-pointer shadow-[0_4px_24px_rgba(255,255,255,0.06)]"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5l-5-5-5 5" />
                  </svg>
                  <span className="tracking-tight uppercase">Analyze Conversation</span>
                </motion.button>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Custom Toast notifications list */}
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

    </div>
  );
}
