"use client";

import { type ReactNode } from "react";
import AuthRouteGuard from "@/components/AuthRouteGuard";
import DashboardLayoutComponent from "@/components/DashboardLayout";

function MemoryLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export default function MemoryLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRouteGuard mode="protected" fallback={<MemoryLoader />}>
      <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
    </AuthRouteGuard>
  );
}
