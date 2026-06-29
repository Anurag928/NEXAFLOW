"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  type AuthRouteMode,
  getRouteGuardRedirectPath,
} from "@/lib/authRouting";

function DefaultAuthFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export default function AuthRouteGuard({
  children,
  mode,
  fallback = <DefaultAuthFallback />,
}: {
  children: React.ReactNode;
  mode: AuthRouteMode;
  fallback?: React.ReactNode;
}) {
  const { user, loading, onboardingCompleted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const redirectPath = useMemo(() => {
    if (loading) return null;

    return getRouteGuardRedirectPath({
      mode,
      isAuthenticated: Boolean(user),
      onboardingCompleted,
    });
  }, [loading, mode, onboardingCompleted, user]);

  useEffect(() => {
    if (!redirectPath || redirectPath === pathname) return;
    router.replace(redirectPath);
  }, [pathname, redirectPath, router]);

  if (loading || redirectPath) {
    return fallback;
  }

  return children;
}
