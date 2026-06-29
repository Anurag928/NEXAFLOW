"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function ProductDemo() {
  return (
    <section className="py-32 px-6 bg-[#0B0B0B] relative overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-4"
          >
            Live demo
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5"
          >
            See it in action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-white/40 max-w-lg mx-auto"
          >
            Experience the seamless transition of your thoughts across the intelligence layer.
          </motion.p>
        </div>

        {/* Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl border border-white/10 overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6)]"
          style={{ background: "rgba(8,8,8,0.95)" }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/15 hover:bg-red-400/60 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-white/15 hover:bg-yellow-400/60 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-white/15 hover:bg-green-400/60 transition-colors cursor-pointer" />
            </div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <span className="text-[11px] text-white/30 font-mono">app.nexaflow.io</span>
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="flex flex-col md:flex-row" style={{ minHeight: "520px" }}>
            {/* Sidebar */}
            <div className="md:w-60 border-b md:border-b-0 md:border-r border-white/[0.05] p-4 flex flex-col">
              <div className="text-[10px] font-semibold text-white/20 tracking-widest uppercase mb-3 px-2 mt-2">
                Transfers
              </div>
              <div className="space-y-1">
                {[
                  { label: "Architecture Planning", done: true },
                  { label: "React Hooks Refactor",  done: false },
                  { label: "Marketing Copy Q3",     done: false },
                  { label: "Onboarding UX Review",  done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      item.done
                        ? "bg-white/[0.07] text-white"
                        : "text-white/30 hover:bg-white/[0.04] hover:text-white/50"
                    }`}
                  >
                    <span className="text-xs truncate">{item.label}</span>
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col">
              {/* Transfer header */}
              <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10">
                  <MessageSquare className="w-3.5 h-3.5 text-white/50" />
                  <span className="text-xs font-medium text-white/60">ChatGPT</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/20">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.1] border border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.08)]">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Gemini 1.5 Pro</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Transfer complete</span>
                </div>
              </div>

              {/* Chat */}
              <div className="flex-1 px-6 py-6 flex flex-col gap-5 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="self-end max-w-[75%]"
                >
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-white/10 border border-white/10">
                    <p className="text-sm text-white/80 leading-relaxed">
                      I need to migrate my Next.js pages router to the app router. Here&apos;s my current architecture — nested layouts with Auth HOCs on every page…
                    </p>
                  </div>
                  <p className="text-[10px] text-white/20 text-right mt-1 mr-1">You · via ChatGPT</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="self-center flex items-center gap-2 text-[11px] text-white/25"
                >
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-white/50"
                  />
                  Extracting context &amp; optimising prompt structure…
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.4, duration: 0.5 }}
                  className="self-start max-w-[82%]"
                >
                  <div className="relative px-4 py-3 rounded-2xl rounded-tl-sm border border-white/[0.08] overflow-hidden"
                       style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/40 to-white/10" />
                    <div className="flex items-center gap-2 mb-2.5">
                      <Zap className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] text-white/30 font-medium">Gemini 1.5 Pro · Context Restored</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Based on our 14-message ChatGPT session — including your Auth HOC patterns and nested layout trees — here&apos;s an optimised App Router migration plan tailored to your architecture…
                    </p>
                  </div>
                  <p className="text-[10px] text-white/20 mt-1 ml-1">Gemini · full context preserved</p>
                </motion.div>
              </div>

              {/* Input */}
              <div className="px-6 pb-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <span className="text-sm text-white/20 flex-1">Continue your conversation…</span>
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
