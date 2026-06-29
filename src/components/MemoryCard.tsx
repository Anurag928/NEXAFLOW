"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const DEFAULT_MEMORIES = [
  "Prefers Python and TypeScript for explanations",
  "Works primarily on AI and web projects",
  "Uses VS Code and Next.js App Router",
  "Likes detailed technical answers with code snippets",
];

export default function MemoryCard({ memories = DEFAULT_MEMORIES }: { memories?: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white/90 mb-1">Your AI Memory</h2>
          <p className="text-[13px] text-white/40">Preferences automatically preserved across models.</p>
        </div>
        <Link href="/memory" className="hidden md:flex px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-white/80 text-[13px] font-medium transition-all active:scale-[0.98]">
          Manage Memory
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 mb-6">
        {memories.map((mem, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]"
          >
            <div className="w-5 h-5 mt-0.5 rounded-full bg-[#10A37F]/10 flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>
            <span className="text-[13.5px] leading-relaxed text-white/70">{mem}</span>
          </div>
        ))}
      </div>
      
      <Link href="/memory" className="md:hidden w-full flex justify-center px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/80 text-[13px] font-medium transition-all active:scale-[0.98]">
        Manage Memory
      </Link>
    </motion.div>
  );
}
