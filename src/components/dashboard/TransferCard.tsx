"use client";

import { motion } from "framer-motion";

/* ─── AI Model metadata ─────────────────────────────────────── */

const MODEL_META: Record<string, { abbr: string; color: string }> = {
  ChatGPT: { abbr: "G", color: "#10A37F" },
  Gemini:  { abbr: "Ge", color: "#4285F4" },
  Claude:  { abbr: "Cl", color: "#D97757" },
  DeepSeek:{ abbr: "Ds", color: "#6366F1" },
  Grok:    { abbr: "Gk", color: "#E5E5E5" },
};

export type TransferStatus = "completed" | "in-progress" | "failed";

export interface TransferItem {
  id: string;
  source: string;
  destination: string;
  date: string;
  status: TransferStatus;
  messageCount?: number;
}

interface TransferCardProps {
  item: TransferItem;
  index?: number;
}

function ModelBadge({ model }: { model: string }) {
  const meta = MODEL_META[model] ?? { abbr: model[0], color: "#555" };
  return (
    <div className="transfer-card__model">
      <span
        className="transfer-card__model-dot"
        style={{ background: meta.color }}
      />
      <span className="transfer-card__model-name">{model}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: TransferStatus }) {
  return (
    <span className={`transfer-card__status transfer-card__status--${status}`}>
      {status === "completed" && "Completed"}
      {status === "in-progress" && "In Progress"}
      {status === "failed" && "Failed"}
    </span>
  );
}

export default function TransferCard({ item, index = 0 }: TransferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.15 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="transfer-card"
    >
      {/* Left: models + arrow */}
      <div className="transfer-card__route">
        <ModelBadge model={item.source} />
        <svg
          className="transfer-card__arrow"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10h12m0 0l-4-4m4 4l-4 4" />
        </svg>
        <ModelBadge model={item.destination} />
      </div>

      {/* Center: meta */}
      <div className="transfer-card__meta">
        <span className="transfer-card__date">{item.date}</span>
        {item.messageCount && (
          <span className="transfer-card__messages">
            {item.messageCount} messages
          </span>
        )}
      </div>

      {/* Right: status */}
      <StatusBadge status={item.status} />
    </motion.div>
  );
}
