"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(file);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validExtensions = ["txt", "json", "pdf", "md"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

      if (validExtensions.includes(fileExtension)) {
        simulateUpload(file);
      } else {
        alert("Unsupported file type. Please upload a TXT, JSON, PDF, or MD file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload-input"
        className="hidden"
        accept=".txt,.json,.pdf,.md"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {!selectedFile && !isUploading ? (
          <motion.label
            htmlFor="file-upload-input"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragActive
                ? "border-white/30 bg-white/[0.04]"
                : "border-white/[0.08] hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.02]"
            }`}
          >
            <div className="p-3 rounded-full bg-white/[0.03] text-white/50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <span className="text-[14px] font-medium text-white/90 mb-1">
              Upload conversation file
            </span>
            <span className="text-[11px] text-white/40">
              Drag & drop or click to browse. Supports TXT, JSON, PDF, MD
            </span>
          </motion.label>
        ) : isUploading ? (
          <motion.div
            key="uploading-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium text-white/50">Uploading file...</span>
              <span className="text-[12px] font-bold text-white/80">{progress}%</span>
            </div>
            <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-white/60 transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="uploaded-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded bg-white/[0.05] text-white/60 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-white/90 truncate">
                  {selectedFile?.name}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
                </span>
              </div>
            </div>
            
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-white/40 transition-colors border border-white/[0.05]"
              title="Remove file"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
