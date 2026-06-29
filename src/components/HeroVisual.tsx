"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Brain, Cpu, Bot, Network } from "lucide-react";

const models = [
  { name: "ChatGPT",   Icon: MessageSquare, x: "10%",  y: "20%",  delay: 0.2 },
  { name: "Gemini",    Icon: Zap,           x: "75%",  y: "15%",  delay: 0.35 },
  { name: "Claude",    Icon: Brain,         x: "80%",  y: "62%",  delay: 0.5 },
  { name: "DeepSeek",  Icon: Cpu,           x: "8%",   y: "62%",  delay: 0.65 },
  { name: "Grok",      Icon: Bot,           x: "42%",  y: "78%",  delay: 0.8 },
];

// SVG paths from each model node to the center (500,240 is roughly center of 1000x480 viewBox)
const paths = [
  "M 130,130 C 250,130 350,200 500,240",
  "M 790,110 C 680,130 580,180 500,240",
  "M 830,340 C 700,320 600,290 500,240",
  "M 130,340 C 270,320 380,290 500,240",
  "M 465,390 C 475,360 485,310 500,240",
];

export default function HeroVisual() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#080808]"
         style={{ aspectRatio: "16/7" }}>

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Radial glow behind engine */}
      <div className="absolute"
           style={{
             left: "50%", top: "50%",
             transform: "translate(-50%, -50%)",
             width: "300px", height: "300px",
             background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
             pointerEvents: "none",
           }} />

      {/* SVG Connection lines + animated particles */}
      <svg
        viewBox="0 0 1000 480"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {paths.map((d, i) => (
          <g key={i}>
            {/* Static dashed line */}
            <motion.path
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: "easeOut" }}
            />
            {/* Animated particle */}
            <motion.circle
              r="3"
              fill="white"
              opacity={0.9}
              animate={{
                // We simulate offsetDistance with repeated animations
                offsetDistance: ["0%", "100%"],
              }}
              style={{
                offsetPath: `path('${d}')`,
                offsetDistance: "0%",
              } as React.CSSProperties}
              initial={{ opacity: 0 }}
              transition={{
                opacity: { delay: 1.5 + i * 0.15 },
                offsetDistance: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5 + i * 0.3,
                  repeatDelay: 1.5,
                },
              }}
            />
          </g>
        ))}
      </svg>

      {/* Model Nodes */}
      {models.map(({ name, Icon, x, y, delay }) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-20 flex flex-col items-center gap-2"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <span className="text-[10px] md:text-xs font-medium text-white/60 tracking-wide">{name}</span>
        </motion.div>
      ))}

      {/* Center: AI Context Engine */}
      <div className="absolute z-30"
           style={{ left: "50%", top: "43%", transform: "translate(-50%, -50%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          {/* Outermost ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full border border-dashed border-white/15"
          />
          {/* Middle ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10"
          />
          {/* Core */}
          <div className="relative w-20 h-20 md:w-26 md:h-26 rounded-full bg-[#0a0a0a] border border-white/20 flex flex-col items-center justify-center gap-1 shadow-[0_0_40px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.1)]"
               style={{ width: "88px", height: "88px" }}>
            <Network className="w-6 h-6 text-white/90" />
            <span className="text-[9px] font-semibold text-white/70 tracking-widest uppercase">Context</span>
            <span className="text-[8px] text-white/40 tracking-widest uppercase -mt-1">Engine</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-40 pointer-events-none" />
    </div>
  );
}
