"use client";

import { motion } from "framer-motion";
import { Sparkles, ReplaceAll, HardDrive, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── reusable inline visual blocks ───────────────────────────── */

function ExtractionVisual() {
  return (
    <div className="w-full h-full flex items-end justify-center p-6 gap-3">
      {/* Messy chat bubbles → structured memory */}
      <div className="flex flex-col gap-2 w-1/2 opacity-60">
        <div className="h-6 rounded-lg bg-white/10 w-4/5" />
        <div className="h-4 rounded-lg bg-white/5 w-full" />
        <div className="h-8 rounded-lg bg-white/10 w-3/5 self-end" />
        <div className="h-4 rounded-lg bg-white/5 w-full" />
        <div className="h-5 rounded-lg bg-white/10 w-4/5" />
      </div>
      {/* Arrow */}
      <div className="text-white/20 text-2xl font-light shrink-0">→</div>
      {/* Structured blocks */}
      <div className="flex flex-col gap-2 w-2/5">
        <div className="h-7 rounded-lg bg-white/20 border border-white/20 flex items-center px-2 shadow-[0_0_12px_rgba(255,255,255,0.05)]">
          <div className="w-2 h-2 rounded-full bg-white/60 mr-2" />
          <div className="h-2 w-3/4 rounded bg-white/40" />
        </div>
        <div className="h-7 rounded-lg bg-white/15 border border-white/10 flex items-center px-2">
          <div className="w-2 h-2 rounded-full bg-white/40 mr-2" />
          <div className="h-2 w-1/2 rounded bg-white/30" />
        </div>
        <div className="h-7 rounded-lg bg-white/10 border border-white/10 flex items-center px-2">
          <div className="w-2 h-2 rounded-full bg-white/30 mr-2" />
          <div className="h-2 w-2/3 rounded bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function OptimizationVisual() {
  const targets = [
    { label: "Claude",    color: "border-orange-500/30",  bg: "bg-orange-500/5" },
    { label: "Gemini",    color: "border-blue-500/30",    bg: "bg-blue-500/5" },
    { label: "DeepSeek",  color: "border-cyan-500/30",    bg: "bg-cyan-500/5" },
    { label: "Grok",      color: "border-purple-500/30",  bg: "bg-purple-500/5" },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
      {/* One source */}
      <div className="w-full max-w-xs h-8 rounded-lg bg-white/15 border border-white/20 flex items-center px-3 gap-2 shadow-[0_0_20px_rgba(255,255,255,0.06)]">
        <div className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
        <div className="h-2 rounded bg-white/50 flex-1" />
        <span className="text-[9px] text-white/50 font-mono shrink-0">source</span>
      </div>
      {/* Adapting outputs */}
      <div className="flex gap-2 w-full max-w-xs">
        {targets.map((t) => (
          <div key={t.label}
               className={cn("flex-1 h-12 rounded-lg border flex flex-col items-center justify-center gap-1", t.color, t.bg)}>
            <div className="h-1.5 w-3/5 rounded bg-white/25" />
            <div className="h-1.5 w-2/5 rounded bg-white/15" />
            <span className="text-[8px] text-white/40 font-mono mt-0.5">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryVisual() {
  const entries = [
    { label: "Architecture Planning",  active: true },
    { label: "React Hooks Refactor",   active: false },
    { label: "Marketing Copy Q3",      active: false },
    { label: "API Design Session",     active: false },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 p-6">
      {entries.map((e, i) => (
        <div key={e.label}
             className={cn(
               "h-11 w-full rounded-xl border flex items-center px-3 gap-3 transition-all",
               e.active
                 ? "bg-white/10 border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.06)] scale-[1.02]"
                 : "bg-white/[0.03] border-white/5 opacity-50"
             )}
             style={{ transitionDelay: `${i * 60}ms` }}>
          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                             e.active ? "bg-white/20" : "bg-white/5")}>
            <HardDrive className="w-3 h-3 text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn("h-2 rounded mb-1", e.active ? "bg-white/50 w-3/4" : "bg-white/20 w-2/4")} />
            <div className="h-1.5 rounded bg-white/15 w-1/2" />
          </div>
          {e.active && <div className="w-2 h-2 rounded-full bg-white/60 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function PrivacyVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer dotted ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-white/20"
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-white/10"
        />
        {/* Core */}
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.08)]">
          <ShieldCheck className="w-7 h-7 text-white/80" />
        </div>
      </div>
    </div>
  );
}

/* ── Feature data ─────────────────────────────────────────────── */

const features = [
  {
    title: "AI Context Extraction",
    description: "Our engine reads your chat history, separating signal from noise to build a structured memory block that perfectly captures your intent.",
    icon: Sparkles,
    visual: <ExtractionVisual />,
  },
  {
    title: "Model-Specific Optimization",
    description: "Different models reason differently. We automatically adapt your context to match the unique prompt structures preferred by Claude, Gemini, or DeepSeek.",
    icon: ReplaceAll,
    visual: <OptimizationVisual />,
  },
  {
    title: "AI Memory Vault",
    description: "Your conversations are stored permanently in an organized, searchable vault. Never lose a brilliant prompt or a deeply reasoned response again.",
    icon: HardDrive,
    visual: <MemoryVisual />,
  },
  {
    title: "Privacy First",
    description: "Zero-knowledge encryption ensures your ideas remain yours. We never read, train on, or share your proprietary conversation data.",
    icon: ShieldCheck,
    visual: <PrivacyVisual />,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Intelligent infrastructure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            Built from the ground up to preserve the fidelity of your AI interactions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group glass-card flex flex-col overflow-hidden"
            >
              {/* Text block */}
              <div className="p-8">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-white/80" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{feature.description}</p>
              </div>

              {/* Visual block */}
              <div className="h-52 border-t border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
                {feature.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
