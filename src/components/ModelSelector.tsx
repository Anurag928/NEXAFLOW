"use client";

import { motion } from "framer-motion";

export type ModelId = "chatgpt" | "gemini" | "claude" | "deepseek" | "grok";

export interface Model {
  id: ModelId;
  name: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

const MODELS: Model[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    color: "#10A37F",
    description: "OpenAI GPT-4o context schema",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.31 10.37a5.53 5.53 0 0 0-.58-3.07 5.53 5.53 0 0 0-2.45-2.45 5.59 5.59 0 0 0-4.32-.23 5.58 5.58 0 0 0-3.07.58A5.53 5.53 0 0 0 6.82 5.8a5.53 5.53 0 0 0-2.45 2.45 5.59 5.59 0 0 0-.23 4.32 5.58 5.58 0 0 0 .58 3.07 5.53 5.53 0 0 0 3.07 3.07 5.59 5.59 0 0 0 4.32.23 5.58 5.58 0 0 0 3.07-.58 5.53 5.53 0 0 0 3.07-3.07 5.59 5.59 0 0 0 .23-4.32 5.58 5.58 0 0 0-.58-3.07z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <path
          d="M17.18 13a4.2 4.2 0 0 1-.76 2.13 4.23 4.23 0 0 1-1.74 1.34v.05c-.32.12-.66.19-1 .2a4.22 4.22 0 0 1-2.92-.93 4.19 4.19 0 0 1-1.34-1.75 4.24 4.24 0 0 1-.2-1 4.22 4.22 0 0 1 .93-2.92c.3-.34.66-.62 1.07-.8a4.23 4.23 0 0 1 3.59.13 4.2 4.2 0 0 1 1.74 1.34c.32.36.52.8.59 1.27a4.24 4.24 0 0 1 .04.94z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
          fill="currentColor"
          fillOpacity="0.8"
        />
      </svg>
    ),
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "#4285F4",
    description: "Google Gemini 1.5 Pro cache",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3c.3 3.5 2.5 5.7 6 6-3.5.3-5.7 2.5-6 6-.3-3.5-2.5-5.7-6-6 3.5-.3 5.7-2.5 6-6z"
          fill="currentColor"
        />
        <path
          d="M18.5 15.5c.15 1.75 1.25 2.85 3 3-1.75.15-2.85 1.25-3 3-.15-1.75-1.25-2.85-3-3 1.75-.15 2.85-1.25 3-3z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    color: "#D97757",
    description: "Anthropic Claude 3.5 XML tags",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.5 19.5h15M6.5 19.5V11a5.5 5.5 0 0 1 11 0v8.5M10 11.5a2 2 0 1 1 4 0v8M7.5 15h9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    color: "#3B82F6",
    description: "DeepSeek-V3 system parameters",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
        <path
          d="M12 22V12M12 12l9-5M12 12L3 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#000" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "grok",
    name: "Grok",
    color: "#E5E5E5",
    description: "xAI Grok real-time processing",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 4l16 16M4 20L20 4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      </svg>
    ),
  },
];

interface ModelSelectorProps {
  label: string;
  selectedId: ModelId | null;
  onSelect: (id: ModelId) => void;
  excludeId?: ModelId | null;
}

export default function ModelSelector({
  label,
  selectedId,
  onSelect,
  excludeId,
}: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
        {selectedId && (
          <span className="text-[11px] font-medium text-white/60">
            Selected: <span className="font-semibold text-white">{MODELS.find(m => m.id === selectedId)?.name}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {MODELS.map((model) => {
          const isSelected = selectedId === model.id;
          const isExcluded = excludeId === model.id;

          return (
            <motion.button
              key={model.id}
              disabled={isExcluded}
              onClick={() => onSelect(model.id)}
              whileHover={isExcluded ? {} : { y: -2, scale: 1.01 }}
              whileTap={isExcluded ? {} : { scale: 0.99 }}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                isExcluded
                  ? "bg-white/[0.01] border-white/[0.02] text-white/10 cursor-not-allowed"
                  : isSelected
                  ? "bg-white/[0.08] border-white/20 text-white shadow-[0_0_24px_rgba(255,255,255,0.06)]"
                  : "bg-white/[0.02] border-white/[0.05] hover:border-white/10 text-white/55 hover:text-white/90"
              }`}
            >
              {/* Active Indicator Border Glow */}
              {isSelected && (
                <div
                  className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-xl"
                  style={{ backgroundColor: model.color }}
                />
              )}

              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-lg mb-2 transition-all ${
                  isSelected ? "bg-white/[0.06] text-white" : "bg-white/[0.03] text-white/40"
                }`}
                style={{ color: isSelected ? model.color : undefined }}
              >
                {model.icon}
              </div>

              {/* Model Name */}
              <span className="text-[13px] font-bold tracking-tight">{model.name}</span>
              
              {/* Detail tag */}
              <span className="text-[9px] text-white/25 mt-1 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-[80px]">
                {model.id}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
