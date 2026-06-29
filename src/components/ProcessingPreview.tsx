"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ProcessingPreview() {
  const steps = [
    {
      id: "input",
      title: "Conversation",
      subtitle: "Ingest chat logs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      id: "memory",
      title: "Memory Extraction",
      subtitle: "Filter instructions & core context",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <path d="M12 16c-1.5 0-3 1.5-3 3v2h6v-2c0-1.5-1.5-3-3-3z"/>
          <path d="M5.5 10a4.5 4.5 0 0 1 0-9"/>
          <path d="M18.5 10a4.5 4.5 0 0 0 0-9"/>
        </svg>
      ),
    },
    {
      id: "optimize",
      title: "Context Optimization",
      subtitle: "Token compression & redundancy removal",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
      ),
    },
    {
      id: "target",
      title: "Target AI Format",
      subtitle: "Inject system-level tags",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">NexaFlow Engine Pipeline</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-wider font-mono">Engine Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        {steps.map((step, index) => {
          return (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <div className="relative flex flex-col gap-2 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.03] text-white/70 border border-white/[0.05]">
                    {step.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-white/90 truncate">{step.title}</span>
                    <span className="text-[10px] text-white/45 truncate leading-tight font-medium">{step.subtitle}</span>
                  </div>
                </div>

                {/* Micro Node Details */}
                <div className="flex justify-between items-center mt-1 border-t border-white/[0.03] pt-2">
                  <span className="text-[9px] font-mono text-white/20">STAGE_0{index + 1}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">ready</span>
                </div>
              </div>

              {/* Connecting arrow with moving dot for desktop (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center relative w-full h-[2px]">
                  <div className="w-full h-[1px] bg-white/[0.05] relative">
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_white]"
                      animate={{
                        left: ["0%", "100%"],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
