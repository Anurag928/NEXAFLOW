"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function LoginVisual() {
  return (
    <div className="relative flex flex-col justify-center max-w-md">

      {/* Logo mark */}
      <motion.div
        custom={0.2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2.5 mb-12"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 2px 16px rgba(255,255,255,0.18)",
          }}
        >
          <div className="w-3.5 h-3.5 bg-black rounded-[2px]" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white/70">
          NexaFlow
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={0.35}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-5xl xl:text-6xl font-bold tracking-tighter text-white leading-[1.08] mb-5"
      >
        Your AI<br />memory layer.
      </motion.h1>

      {/* Body copy */}
      <motion.p
        custom={0.5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-base text-white/30 leading-relaxed max-w-xs"
      >
        Continue any conversation across ChatGPT, Gemini, Claude, and Grok — context intact.
      </motion.p>


    </div>
  );
}
