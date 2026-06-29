"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Calendar, Database, ShieldAlert, RotateCcw } from "lucide-react";

interface HistoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  selectedDest: string;
  setSelectedDest: (dest: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const MODELS = [
  { value: "all", label: "All Models" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "grok", label: "Grok" },
];

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

const DATE_RANGES = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

export default function HistoryFilters({
  searchQuery,
  setSearchQuery,
  selectedSource,
  setSelectedSource,
  selectedDest,
  setSelectedDest,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  onClearFilters,
  hasActiveFilters,
}: HistoryFiltersProps) {
  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const selectOption = (type: string, value: string) => {
    if (type === "source") setSelectedSource(value);
    if (type === "dest") setSelectedDest(value);
    if (type === "status") setSelectedStatus(value);
    if (type === "date") setSelectedDate(value);
    setOpenDropdown(null);
  };

  const getLabel = (type: string) => {
    if (type === "source") return MODELS.find(m => m.value === selectedSource)?.label ?? "Source Model";
    if (type === "dest") return MODELS.find(m => m.value === selectedDest)?.label ?? "Dest Model";
    if (type === "status") return STATUSES.find(s => s.value === selectedStatus)?.label ?? "Status";
    if (type === "date") return DATE_RANGES.find(d => d.value === selectedDate)?.label ?? "Date Range";
    return "";
  };

  return (
    <div className="mt-8 space-y-4" ref={containerRef}>
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30 group-focus-within:text-white/60 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations, projects, or AI models..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] focus:border-white/20 text-white placeholder-white/25 text-[14px] font-medium outline-none transition-all duration-200"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-[620px] xl:w-[680px]">
          {/* Source Model */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("source")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border ${
                openDropdown === "source" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06]"
              } text-left text-[13px] font-medium text-white/80 transition-all duration-200 focus:outline-none`}
            >
              <span className="truncate">{getLabel("source")}</span>
              <ChevronDown className={`w-4 h-4 text-white/35 ml-1 transition-transform duration-200 flex-shrink-0 ${
                openDropdown === "source" ? "rotate-180" : ""
              }`} />
            </button>
            {openDropdown === "source" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0A0A]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl py-1.5 shadow-2xl z-20 max-h-60 overflow-y-auto">
                {MODELS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => selectOption("source", item.value)}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      selectedSource === item.value
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Model */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("dest")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border ${
                openDropdown === "dest" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06]"
              } text-left text-[13px] font-medium text-white/80 transition-all duration-200 focus:outline-none`}
            >
              <span className="truncate">{getLabel("dest")}</span>
              <ChevronDown className={`w-4 h-4 text-white/35 ml-1 transition-transform duration-200 flex-shrink-0 ${
                openDropdown === "dest" ? "rotate-180" : ""
              }`} />
            </button>
            {openDropdown === "dest" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0A0A]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl py-1.5 shadow-2xl z-20 max-h-60 overflow-y-auto">
                {MODELS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => selectOption("dest", item.value)}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      selectedDest === item.value
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("status")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border ${
                openDropdown === "status" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06]"
              } text-left text-[13px] font-medium text-white/80 transition-all duration-200 focus:outline-none`}
            >
              <span className="truncate">{getLabel("status")}</span>
              <ChevronDown className={`w-4 h-4 text-white/35 ml-1 transition-transform duration-200 flex-shrink-0 ${
                openDropdown === "status" ? "rotate-180" : ""
              }`} />
            </button>
            {openDropdown === "status" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0A0A]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl py-1.5 shadow-2xl z-20 max-h-60 overflow-y-auto">
                {STATUSES.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => selectOption("status", item.value)}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      selectedStatus === item.value
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("date")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border ${
                openDropdown === "date" ? "border-white/20 bg-white/[0.04]" : "border-white/[0.06]"
              } text-left text-[13px] font-medium text-white/80 transition-all duration-200 focus:outline-none`}
            >
              <span className="truncate">{getLabel("date")}</span>
              <ChevronDown className={`w-4 h-4 text-white/35 ml-1 transition-transform duration-200 flex-shrink-0 ${
                openDropdown === "date" ? "rotate-180" : ""
              }`} />
            </button>
            {openDropdown === "date" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0A0A]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl py-1.5 shadow-2xl z-20 max-h-60 overflow-y-auto">
                {DATE_RANGES.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => selectOption("date", item.value)}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      selectedDate === item.value
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] animate-fadeIn">
          <div className="flex items-center gap-2 text-[12px] text-white/35">
            <span>Filters active:</span>
            {searchQuery && <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60">Search: &quot;{searchQuery}&quot;</span>}
            {selectedSource !== "all" && <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60">Source: {getLabel("source")}</span>}
            {selectedDest !== "all" && <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60">Dest: {getLabel("dest")}</span>}
            {selectedStatus !== "all" && <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60">Status: {getLabel("status")}</span>}
            {selectedDate !== "all" && <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60">Date: {getLabel("date")}</span>}
          </div>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
