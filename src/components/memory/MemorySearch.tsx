"use client";

import { Search, Info } from "lucide-react";

interface MemorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MemorySearch({ value, onChange }: MemorySearchProps) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your AI memories..."
          className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A]/60 border border-white/[0.04] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/10 transition-colors backdrop-blur-xl shadow-inner text-ellipsis"
        />
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.01] border border-white/[0.03] text-[11px] text-white/30 font-medium whitespace-nowrap self-start md:self-auto leading-none">
        <Info className="w-3.5 h-3.5" />
        <span>Searches content, category, projects & technology stack</span>
      </div>
    </div>
  );
}
