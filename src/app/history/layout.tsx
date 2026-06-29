"use client";

import { type ReactNode, Suspense } from "react";
import AuthRouteGuard from "@/components/AuthRouteGuard";
import DashboardLayoutComponent from "@/components/DashboardLayout";

function HistoryLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRouteGuard mode="protected" fallback={<HistoryLoader />}>
      <DashboardLayoutComponent>
        <Suspense fallback={<HistoryLoader />}>
          {children}
        </Suspense>
      </DashboardLayoutComponent>
    </AuthRouteGuard>
  );
}
