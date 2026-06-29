"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "./FileUploader";

export type InputType = "link" | "text" | "file";

interface ConversationInputProps {
  inputType: InputType;
  setInputType: (type: InputType) => void;
  linkValue: string;
  setLinkValue: (val: string) => void;
  textValue: string;
  setTextValue: (val: string) => void;
  fileValue: File | null;
  setFileValue: (file: File | null) => void;
  onAnalyzeLink: () => void;
  onProcessText: () => void;
  isProcessingLink: boolean;
  isProcessingText: boolean;
}

export default function ConversationInput({
  inputType,
  setInputType,
  linkValue,
  setLinkValue,
  textValue,
  setTextValue,
  fileValue,
  setFileValue,
  onAnalyzeLink,
  onProcessText,
  isProcessingLink,
  isProcessingText,
}: ConversationInputProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(textValue.length);
  }, [textValue]);

  const tabs: { id: InputType; label: string; icon: React.ReactNode }[] = [
    {
      id: "link",
      label: "Share Link",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      id: "text",
      label: "Editor / Text",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      ),
    },
    {
      id: "file",
      label: "Upload File",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-lg">
      <div className="flex flex-col gap-1">
        <h3 className="text-[14px] font-bold text-white/95">Bring your conversation</h3>
        <p className="text-[11px] text-white/40">Paste a conversation link, enter text, or upload your chat history.</p>
      </div>

      {/* Tabs list */}
      <div className="flex bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl">
        {tabs.map((tab) => {
          const isActive = inputType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInputType(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium transition-all relative ${
                isActive ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-input-tab"
                  className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {inputType === "link" && (
            <motion.div
              key="tab-link"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    placeholder="Paste ChatGPT, Gemini, Claude share link..."
                    className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/25 transition-all font-medium"
                  />
                  {linkValue && (
                    <button
                      onClick={() => setLinkValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors p-0.5 rounded-md hover:bg-white/[0.04]"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={onAnalyzeLink}
                  disabled={isProcessingLink || !linkValue}
                  className="px-4 bg-white/90 hover:bg-white text-black font-bold text-[12px] rounded-xl flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:bg-white/40 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessingLink ? (
                    <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : null}
                  <span>Analyze Link</span>
                </button>
              </div>
              <span className="text-[10px] text-white/30 font-medium">
                Supports ChatGPT share URLs (`chatgpt.com/share/...`), Gemini sharing links, and Claude sharing nodes.
              </span>
            </motion.div>
          )}

          {inputType === "text" && (
            <motion.div
              key="tab-text"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="relative">
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Paste your conversation here..."
                  className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl p-4 text-[13px] text-white placeholder-white/25 transition-all font-medium min-h-[120px] max-h-[300px] resize-y"
                />
                <div className="absolute right-3 bottom-3 text-[10px] font-mono text-white/20 font-medium bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.04]">
                  {charCount.toLocaleString()} chars
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/30 font-medium">
                  Enter copy-pasted conversation logs directly. We'll strip tags, clean prompt loops, and normalize speaker roles.
                </span>
                <button
                  onClick={onProcessText}
                  disabled={isProcessingText || !textValue}
                  className="px-4 py-2.5 bg-white/90 hover:bg-white text-black font-bold text-[12px] rounded-xl flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:bg-white/40 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessingText ? (
                    <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : null}
                  <span>Process Context</span>
                </button>
              </div>
            </motion.div>
          )}

          {inputType === "file" && (
            <motion.div
              key="tab-file"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <FileUploader onFileSelect={setFileValue} selectedFile={fileValue} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
