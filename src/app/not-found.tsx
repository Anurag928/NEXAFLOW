"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative gradient glow sphere behind the 404 card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[450px] h-[450px] bg-white/[0.015] rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 backdrop-blur-2xl text-center space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
      >
        {/* Error icon circle */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/60">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-white tracking-tight">Page Not Found</h2>
          <p className="text-sm text-white/40 leading-relaxed">
            The page you are looking for doesn&apos;t exist, or has been moved to another location.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/80 font-medium text-sm hover:bg-white/[0.05] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
