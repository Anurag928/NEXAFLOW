"use client";

import CopyButton from "./CopyButton";

interface PromptViewerProps {
  promptText: string;
  onCopySuccess?: (message: string) => void;
}

export default function PromptViewer({
  promptText = "",
  onCopySuccess,
}: PromptViewerProps) {
  const defaultText = `You are continuing an existing conversation from another AI assistant.

Project Context:
...

Previous Work:
...

Current State:
...

Continue from this point:
...`;

  const displayPrompt = promptText || defaultText;
  const charCount = displayPrompt.length;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-lg">
      
      {/* Viewer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-white/90 tracking-tight">
            Generated Continuation Prompt
          </h3>
          <p className="text-[11px] text-white/40 font-semibold leading-normal max-w-md">
            Copy this prompt and paste it into your destination AI to continue your previous conversation.
          </p>
        </div>

        {/* Copy CTA Button control */}
        <CopyButton
          textToCopy={displayPrompt}
          onCopySuccess={onCopySuccess}
          className="flex-shrink-0"
        />
      </div>

      {/* Editor Viewbox */}
      <div className="relative group">
        {/* Subtle border highlight on hover */}
        <div className="absolute inset-0 -z-10 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <textarea
          readOnly
          value={displayPrompt}
          className="w-full bg-[#050505] p-5 rounded-xl border border-white/[0.06] text-[13px] text-white/75 font-mono leading-relaxed min-h-[300px] max-h-[500px] resize-y overflow-y-auto focus:outline-none focus:border-white/10 select-all"
        />

        {/* Floating badge inside area */}
        <div className="absolute bottom-4 right-4 pointer-events-none select-none">
          <span className="text-[9px] font-mono text-white/10 uppercase bg-[#050505]/95 px-2.5 py-1 rounded border border-white/[0.03] tracking-widest font-bold">
            Portable block
          </span>
        </div>
      </div>

      {/* Character count bar */}
      <div className="flex items-center justify-end text-[10px] font-mono text-white/20 font-bold uppercase tracking-wider">
        <span>{charCount.toLocaleString()} Characters</span>
      </div>
      
    </div>
  );
}
