"use client";

import React, { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SplineBackground from "./SplineBackground";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Fixed full-screen wrapper for Spline Background (z-0) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <SplineBackground />
      </div>

      {/* Desktop Sidebar (visible on md+) */}
      <div className="hidden md:block z-30 relative">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          pathname={pathname}
          user={user}
        />
      </div>

      {/* Mobile Sidebar overlay/drawer (visible when open) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer wrapper */}
      <div 
        className={`fixed top-0 bottom-0 left-0 z-50 md:hidden transition-transform duration-300 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileSidebarOpen(false)}
          pathname={pathname}
          user={user}
        />
      </div>

      {/* Main Content Frame */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
        <Header user={user} onToggleSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 relative z-10">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
