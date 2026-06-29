"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Download, BrainCircuit, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Import Conversation",
    description: "Connect your AI accounts and select the conversation you want to transfer seamlessly.",
    icon: Download,
  },
  {
    title: "AI Understands Context",
    description: "Our proprietary engine extracts key context, organizing messy chat history into memory blocks.",
    icon: BrainCircuit,
  },
  {
    title: "Continue Anywhere",
    description: "Resume your conversation on the target model with full context preserved instantly.",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-32 px-6 bg-[#0B0B0B] relative">
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A frictionless journey from one AI to another, powered by intelligent context extraction.
          </p>
        </div>

        <div className="relative">
          {/* Animated Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-white/20"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-24">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={cn(
                  "relative flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center",
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 w-12 h-12 rounded-full glass-card border border-white/20 flex items-center justify-center -translate-x-1/2 md:-translate-y-1/2 z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <span className="text-sm font-semibold text-white">{idx + 1}</span>
                </div>

                {/* Content */}
                <div className={cn(
                  "ml-20 md:ml-0 md:w-1/2",
                  idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                )}>
                  <div className={cn(
                    "inline-flex w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center mb-6",
                    idx % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  )}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
