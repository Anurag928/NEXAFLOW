"use client";

interface AIModelBadgeProps {
  modelName: string;
  className?: string;
}

const MODEL_DETAILS: Record<string, { name: string; logo: string; color: string }> = {
  chatgpt: { name: "ChatGPT", logo: "/logos/openai.svg", color: "#10A37F" },
  claude: { name: "Claude", logo: "/logos/claude.svg", color: "#D97757" },
  gemini: { name: "Gemini", logo: "/logos/gemini.svg", color: "#4285F4" },
  deepseek: { name: "DeepSeek", logo: "/logos/deepseek.svg", color: "#3B82F6" },
  grok: { name: "Grok", logo: "/logos/grok.svg", color: "#E5E5E5" },
};

export default function AIModelBadge({ modelName, className = "" }: AIModelBadgeProps) {
  const key = modelName?.toLowerCase() || "";
  const config = MODEL_DETAILS[key] || { name: modelName || "AI Model", logo: "/logos/openai.svg", color: "#A1A1AA" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[12px] font-bold text-white/85 ${className}`}>
      <span className="relative flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={config.logo} 
          alt={config.name} 
          className="w-full h-full object-contain"
        />
      </span>
      <span>{config.name}</span>
    </div>
  );
}
