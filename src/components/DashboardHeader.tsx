"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-[15px] text-white/50">
          Your AI memory is ready. Continue your conversations anywhere.
        </p>
      </motion.div>

    </div>
  );
}
