"use client";

import { type ReactNode } from "react";
import AuthRouteGuard from "@/components/AuthRouteGuard";
import DashboardLayoutComponent from "@/components/DashboardLayout";

function TransferLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export default function TransferLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRouteGuard mode="protected" fallback={<TransferLoader />}>
      <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
    </AuthRouteGuard>
  );
}
