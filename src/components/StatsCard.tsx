"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string;
  index: number;
}

export default function StatsCard({ label, value, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="p-6 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-[#0C0C0C]"
    >
      <h3 className="text-[13px] font-medium text-white/40 mb-3 uppercase tracking-wider">{label}</h3>
      <div className="text-3xl font-bold tracking-tight text-white/90">
        {value}
      </div>
    </motion.div>
  );
}
