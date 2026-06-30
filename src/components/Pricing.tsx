"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For curious explorers",
    features: [
      "5 transfers per month",
      "Basic context extraction",
      "3 AI platforms",
      "Community support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For power users",
    features: [
      "Unlimited transfers",
      "Advanced context extraction",
      "All AI platforms",
      "AI Memory Vault",
      "Browser extension",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise deployment",
      "SLA guarantees",
    ],
    cta: "Contact sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 bg-[#050505] relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free. Upgrade when you need more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className={cn(
                "relative flex flex-col p-8 rounded-2xl border",
                plan.featured
                  ? "bg-white text-black border-white shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                  : "glass-card border-white/10"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black text-white text-xs font-semibold border border-white/20">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  plan.featured ? "text-black" : "text-white"
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  "text-sm mb-6",
                  plan.featured ? "text-black/60" : "text-muted-foreground"
                )}>
                  {plan.desc}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-4xl font-bold tracking-tight",
                    plan.featured ? "text-black" : "text-white"
                  )}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={plan.featured ? "text-black/60" : "text-muted-foreground"}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={cn(
                      "w-4 h-4 mt-0.5 shrink-0",
                      plan.featured ? "text-black" : "text-white/60"
                    )} />
                    <span className={cn(
                      "text-sm",
                      plan.featured ? "text-black/80" : "text-muted-foreground"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-semibold transition-all",
                  plan.featured
                    ? "bg-black text-white hover:bg-black/80"
                    : "glass-button"
                )}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
