"use client";

import { motion } from "framer-motion";

/* ─── Animation ─────────────────────────────────────────────── */

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

/* ─── Model flow data ────────────────────────────────────────── */

const AI_MODELS = [
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Claude", color: "#D97757" },
  { name: "DeepSeek", color: "#6366F1" },
  { name: "Grok", color: "#E5E5E5" },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function SignupVisual() {
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
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect width="6" height="6" rx="1" fill="#000" />
            <rect x="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
            <rect y="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
            <rect x="8" y="8" width="6" height="6" rx="1" fill="#000" opacity="0.15" />
          </svg>
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
        className="text-base text-white/30 leading-relaxed max-w-xs mb-12"
      >
        Move conversations between AI models without losing context.
      </motion.p>

      {/* Model flow visualization */}
      <motion.div
        custom={0.65}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {AI_MODELS.map((model, i) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: model.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "-0.01em",
              }}
            >
              {model.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "10px",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Connected
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
