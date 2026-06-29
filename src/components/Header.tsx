"use client";

import React from "react";
import type { User } from "firebase/auth";

interface HeaderProps {
  user: User | null;
  onToggleSidebar?: () => void;
}

export default function Header({ user, onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 md:px-10 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.04] z-20 relative">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-white/95">Workspace</span>
          <span className="text-[11px] text-white/40 hidden sm:inline">NexaFlow Memory Layer</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-white/60 hidden sm:inline">{user.displayName || user.email}</span>
            <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[12px] font-bold text-white/70 overflow-hidden">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (user.displayName ?? user.email ?? "U")[0].toUpperCase()
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
