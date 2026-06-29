"use client";

import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-[#050505]">
      {/* Animated ambient background */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
        >
          Never lose an AI conversation again.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto"
        >
          Join thousands of professionals who never start from scratch with a new AI model.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black font-semibold tracking-tight text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_70px_rgba(255,255,255,0.5)] transition-shadow"
          >
            Start building your AI memory
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          10 free credits included. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
