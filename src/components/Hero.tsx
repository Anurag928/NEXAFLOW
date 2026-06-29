"use client";

import { motion } from "framer-motion";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-28 md:pt-36 pb-0 px-4 overflow-hidden">
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Badge */}


      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative z-10 text-center text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-tighter text-white leading-[1.05] max-w-4xl mx-auto mb-6"
      >
        Your AI conversations{" "}
        <span className="text-gradient">should move with you.</span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
        className="relative z-10 text-center text-base md:text-lg text-white/40 mb-10 max-w-xl mx-auto leading-relaxed"
      >
        Transfer conversations between ChatGPT, Gemini, Claude, DeepSeek, and Grok while preserving complete context.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-shadow"
        >
          Start transferring
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-button text-sm font-medium"
        >
          See how it works
        </motion.button>
      </motion.div>

      {/* Hero Visual — flush to bottom, full width */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="relative z-10 w-full max-w-6xl mx-auto"
      >
        <HeroVisual />
      </motion.div>
    </section>
  );
}
