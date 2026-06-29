export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const ONBOARDING_PATH = "/onboarding";
export const DASHBOARD_PATH = "/dashboard";

export const AUTH_COOKIE = "ai_flow_auth";
export const ONBOARDING_COOKIE = "ai_flow_onboarding_completed";

export type AuthRouteMode = "guest" | "onboarding" | "protected";

export function getPostAuthRedirectPath(onboardingCompleted: boolean): string {
  return onboardingCompleted ? DASHBOARD_PATH : ONBOARDING_PATH;
}

export function getRouteGuardRedirectPath({
  mode,
  isAuthenticated,
  onboardingCompleted,
}: {
  mode: AuthRouteMode;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}): string | null {
  if (!isAuthenticated) {
    return mode === "guest" ? null : LOGIN_PATH;
  }

  if (!onboardingCompleted) {
    return mode === "onboarding" ? null : ONBOARDING_PATH;
  }

  return mode === "protected" ? null : DASHBOARD_PATH;
}

export function writeAuthRoutingCookies({
  isAuthenticated,
  onboardingCompleted,
}: {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}) {
  if (typeof document === "undefined") return;

  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE}=${isAuthenticated ? "1" : ""}; path=/; max-age=${
    isAuthenticated ? maxAge : 0
  }; samesite=lax`;
  document.cookie = `${ONBOARDING_COOKIE}=${onboardingCompleted ? "1" : "0"}; path=/; max-age=${
    isAuthenticated ? maxAge : 0
  }; samesite=lax`;
}

export function clearAuthRoutingCookies() {
  writeAuthRoutingCookies({ isAuthenticated: false, onboardingCompleted: false });
}
