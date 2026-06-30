"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: NavIconDashboard },
  { label: "New Transfer", href: "/transfer", icon: NavIconTransfer },
  { label: "AI Memory", href: "/memory", icon: NavIconMemory },
  { label: "History", href: "/history", icon: NavIconHistory },
  { label: "Settings", href: "/settings", icon: NavIconSettings },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
  user: User;
  isMobile?: boolean;
}

export default function Sidebar({
  collapsed,
  onToggle,
  pathname,
  user,
  isMobile = false,
}: SidebarProps) {
  const { logout, profile } = useAuth();
  const router = useRouter();

  const isPro = profile?.plan === "pro";
  const used = profile?.credits?.used ?? 0;
  const total = profile?.credits?.total ?? 5;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: NavIconDashboard },
    { label: "New Transfer", href: "/transfer", icon: NavIconTransfer },
    { label: "AI Memory", href: "/memory", icon: NavIconMemory },
    { label: "History", href: "/history", icon: NavIconHistory },
    ...(!isPro ? [{ label: "Upgrade Plan", href: "/pricing", icon: NavIconUpgrade }] : []),
    { label: "Settings", href: "/settings", icon: NavIconSettings },
  ];

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <>
      {/* Mobile Drawer Panel OR Desktop Sidebar */}
      <aside
        className={`${
          isMobile
            ? "flex flex-col h-screen bg-[#050505]/95 backdrop-blur-xl border-r border-white/[0.04] transition-all duration-300 z-50"
            : "hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[#050505]/95 backdrop-blur-xl border-r border-white/[0.04] transition-all duration-300 z-30"
        }`}
        style={{ width: isMobile ? 260 : (collapsed ? 72 : 260) }}
      >
        <div className="flex items-center gap-3 h-20 px-6 mb-2">
          {isMobile ? (
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex-shrink-0 border border-white/[0.08]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex-shrink-0 border border-white/[0.08]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect width="6" height="6" rx="1" fill="#fff" opacity="0.9" />
                <rect x="8" width="6" height="6" rx="1" fill="#fff" opacity="0.4" />
                <rect y="8" width="6" height="6" rx="1" fill="#fff" opacity="0.4" />
                <rect x="8" y="8" width="6" height="6" rx="1" fill="#fff" opacity="0.15" />
              </svg>
            </button>
          )}
          {(!collapsed || isMobile) && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-white tracking-tight leading-tight">NexaFlow</span>
                {isPro && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-black tracking-widest leading-none">PRO</span>
                )}
              </div>
              <span className="text-[11px] text-white/40 font-medium">Your AI memory layer</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={isMobile ? onToggle : undefined}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive ? "text-white bg-white/[0.06]" : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                      <Icon />
                    </span>
                    {(!collapsed || isMobile) && (
                      <span className="text-[13.5px] font-medium whitespace-nowrap">{label}</span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 w-1 h-5 bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          {(!collapsed || isMobile) && (
            <div className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[12px] font-bold text-white/90 mb-1">
                {isPro ? "PRO PLAN" : "FREE PLAN"}
              </div>
              <div className="text-[11px] text-white/40 mb-3">
                {isPro ? "Unlimited transfers" : `${used} / ${total} transfers used`}
              </div>
              
              {!isPro ? (
                <>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.05] mb-4 overflow-hidden">
                    <div 
                      className="h-full bg-white/70 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((used / total) * 100, 100)}%` }} 
                    />
                  </div>
                  
                  <button 
                    onClick={() => router.push("/pricing")}
                    className="w-full py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[12px] font-semibold text-white transition-colors cursor-pointer"
                  >
                    Upgrade
                  </button>
                </>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[12px] font-bold text-white/70 flex-shrink-0 overflow-hidden">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (user.displayName ?? user.email ?? "U")[0].toUpperCase()
              )}
            </div>
            {(!collapsed || isMobile) && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] font-medium text-white/90 truncate">
                  {user.displayName ?? "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="mt-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full active:scale-[0.98]"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (fallback only outside DashboardLayout usage) */}
      {!isMobile && (
        <div className="md:hidden flex items-center justify-between h-16 px-6 sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04] z-40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center bg-white/[0.05] border border-white/[0.1]">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <rect width="6" height="6" rx="1" fill="#fff" opacity="0.9" />
                <rect x="8" width="6" height="6" rx="1" fill="#fff" opacity="0.4" />
                <rect y="8" width="6" height="6" rx="1" fill="#fff" opacity="0.4" />
                <rect x="8" y="8" width="6" height="6" rx="1" fill="#fff" opacity="0.15" />
              </svg>
            </div>
            <span className="text-[14px] font-bold text-white tracking-tight">
              NexaFlow
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white/70 overflow-hidden"
            onClick={handleLogout}
          >
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user.displayName ?? user.email ?? "U")[0].toUpperCase()
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Icons ──────────────────────────────────────────────────── */

function NavIconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  );
}

function NavIconTransfer() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5h12M11 2.5l4 4-4 4" />
      <path d="M15 11.5H3M7 15.5l-4-4 4-4" />
    </svg>
  );
}

function NavIconMemory() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2a7 7 0 100 14 7 7 0 000-14z" />
      <path d="M9 5v4s1.5 1 2.5 1" />
      <path d="M5 9h8" opacity="0.3" />
    </svg>
  );
}

function NavIconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 5v4l2.5 1.5" />
    </svg>
  );
}



function NavIconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 2v2m0 10v2M2 9h2m10 0h2M4.05 4.05l1.41 1.41m7.08 7.08l1.41 1.41M13.95 4.05l-1.41 1.41M5.46 12.54l-1.41 1.41" />
    </svg>
  );
}

function NavIconUpgrade() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
