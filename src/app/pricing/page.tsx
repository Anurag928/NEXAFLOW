"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";

export default function PricingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isPro = profile?.plan === "pro";
  const usedCredits = profile?.credits?.used ?? 0;

  const handleUpgradeClick = () => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = async () => {
    setUpgrading(true);
    try {
      const userRef = doc(db, "users", user!.uid);
      await updateDoc(userRef, {
        plan: "pro",
        credits: {
          total: null,
          used: 0,
        },
        subscription: {
          status: "active",
          expiresAt: null,
        },
      });

      // Sync user profile state
      await refreshProfile();
      
      // Close upgrade modal and show success modal
      setShowUpgradeModal(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Upgrade simulation failed:", err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="py-10 relative">
      {/* Title block */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-[11px] font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white/60 animate-pulse" />
          <span>Plans & Billing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-base text-white/40 max-w-lg mx-auto leading-relaxed">
          Upgrade to unlock unlimited conversation portability, advanced memory context, and priority processing speed.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch relative z-10">
        
        {/* FREE PLAN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col p-8 rounded-2xl bg-[#090909]/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)] justify-between"
        >
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-wider text-white/30 uppercase">Standard Tier</span>
              <h3 className="text-xl font-bold text-white mt-1">Free</h3>
              <p className="text-sm text-white/40 mt-2">Perfect for trial and basic portability.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight text-white">$0</span>
                <span className="text-white/40 ml-1 text-sm">/ forever</span>
              </div>
            </div>

            <hr className="border-white/[0.04] mb-6" />

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-medium">5 AI Transfers</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/70 font-medium">Basic conversation migration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/30 font-medium">No AI Memory integration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-white/30 font-medium">Standard processing speed</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-white/30 text-[13px] font-bold select-none cursor-not-allowed uppercase"
          >
            {isPro ? "Free Plan" : "Current Plan"}
          </button>
        </motion.div>

        {/* PRO PLAN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="relative flex flex-col p-8 rounded-2xl bg-white text-black border border-white shadow-[0_20px_50px_rgba(255,255,255,0.06)] justify-between overflow-hidden"
        >
          {/* Subtle Glowing Aura */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/[0.04] rounded-bl-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black/20" />
          </div>

          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-wider text-black/40 uppercase">Premium Tier</span>
              <h3 className="text-xl font-bold text-black mt-1">Pro</h3>
              <p className="text-sm text-black/60 mt-2">For heavy users and automated developer workflows.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight text-black">$29</span>
                <span className="text-black/50 ml-1 text-sm">/ month</span>
              </div>
            </div>

            <hr className="border-black/[0.08] mb-6" />

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-black/80 font-bold">Unlimited AI Transfers</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-black/80 font-bold">AI Memory Vault Syncing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-black/80 font-bold">Unlimited History Logging</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-black/80 font-bold">Priority API Processing</span>
              </li>
            </ul>
          </div>

          {isPro ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-black/5 text-black/40 text-[13px] font-bold select-none cursor-not-allowed uppercase"
            >
              Active Subscription
            </button>
          ) : (
            <motion.button
              onClick={handleUpgradeClick}
              disabled={upgrading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 rounded-xl bg-black text-white hover:bg-black/90 text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
            >
              {upgrading ? "Simulating Payment..." : "Upgrade Now"}
            </motion.button>
          )}
        </motion.div>

      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-md rounded-2xl bg-[#090909]/90 border border-white/[0.08] backdrop-blur-xl p-8 text-center shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative"
            >
              {/* Star sparkles */}
              <div className="absolute top-4 right-4 text-white/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              {/* Checkmark icon */}
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mb-3">
                Account Upgraded to Pro!
              </h2>
              
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                Your subscription is now active. You have been granted unlimited AI conversation transfers and access to advanced system memory.
              </p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push("/transfer");
                }}
                className="w-full py-3.5 bg-white text-black hover:bg-[#F0F0F0] text-[13px] font-bold rounded-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none"
              >
                Go to Transfer Workspace
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={handleConfirmUpgrade}
        isLoading={upgrading}
      />

    </div>
  );
}
