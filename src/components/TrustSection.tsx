"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, Brain, Cpu, MessageCircle } from "lucide-react";

const models = [
  { name: "ChatGPT",  desc: "OpenAI",     icon: MessageCircle, accent: "rgba(16,163,127,0.15)",  border: "rgba(16,163,127,0.3)" },
  { name: "Gemini",   desc: "Google",     icon: Sparkles,       accent: "rgba(66,133,244,0.15)",  border: "rgba(66,133,244,0.3)" },
  { name: "Claude",   desc: "Anthropic",  icon: Brain,          accent: "rgba(205,154,109,0.15)", border: "rgba(205,154,109,0.3)" },
  { name: "DeepSeek", desc: "DeepSeek",   icon: Cpu,            accent: "rgba(98,0,234,0.15)",    border: "rgba(98,0,234,0.3)" },
  { name: "Grok",     desc: "xAI",        icon: Bot,            accent: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.15)" },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Divider line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-semibold tracking-[0.25em] text-white/25 uppercase mb-12"
        >
          Works with your favorite AI assistants
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          {models.map((model, idx) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md cursor-default transition-all duration-300"
              style={{
                background: model.accent,
                borderColor: model.border,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{ borderColor: model.border, background: "rgba(0,0,0,0.3)" }}
              >
                <model.icon className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-none mb-0.5">{model.name}</div>
                <div className="text-[10px] text-white/35">{model.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
