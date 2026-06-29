"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  icon: ReactNode;
  index?: number;
}

export default function StatCard({
  label,
  value,
  change,
  changeDirection = "neutral",
  icon,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="stat-card"
    >
      <div className="stat-card__header">
        <span className="stat-card__icon">{icon}</span>
        {change && (
          <span
            className={`stat-card__change stat-card__change--${changeDirection}`}
          >
            {changeDirection === "up" && "↑ "}
            {changeDirection === "down" && "↓ "}
            {change}
          </span>
        )}
      </div>

      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </motion.div>
  );
}
