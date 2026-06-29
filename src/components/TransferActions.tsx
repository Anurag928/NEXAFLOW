"use client";

import Link from "next/link";

const AI_URLS: Record<string, string> = {
  chatgpt: "https://chatgpt.com",
  claude: "https://claude.ai",
  gemini: "https://gemini.google.com",
  deepseek: "https://chat.deepseek.com",
  grok: "https://grok.com",
};

const AI_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  grok: "Grok",
};

interface TransferActionsProps {
  destinationModel?: string;
}

export default function TransferActions({
  destinationModel = "gemini",
}: TransferActionsProps) {
  const destKey = destinationModel.toLowerCase();
  const targetUrl = AI_URLS[destKey];
  const targetName = AI_NAMES[destKey] || "AI Portal";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full mt-2">
      {/* Link to Open Destination portal directly */}
      {targetUrl && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white text-black font-extrabold text-[12px] text-center border border-transparent transition-all hover:bg-[#F0F0F0] active:scale-[0.99] shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider select-none"
        >
          <span>Open {targetName}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      )}

      {/* Trigger Another Transfer */}
      <Link
        href="/transfer"
        className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-white font-extrabold text-[12px] text-center border border-white/[0.06] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider select-none"
      >
        <span>New Transfer</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>

      {/* Return to home dashboard */}
      <Link
        href="/dashboard"
        className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-extrabold text-[12px] text-center border border-white/[0.06] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider select-none"
      >
        <span>Dashboard</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
    </div>
  );
}
