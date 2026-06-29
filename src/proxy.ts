import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  DASHBOARD_PATH,
  LOGIN_PATH,
  ONBOARDING_COOKIE,
  ONBOARDING_PATH,
  SIGNUP_PATH,
} from "@/lib/authRouting";

const PROTECTED_PATHS = [DASHBOARD_PATH];
const GUEST_PATHS = [LOGIN_PATH, SIGNUP_PATH];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = PROTECTED_PATHS.some((path) => matchesRoute(pathname, path));
  const isGuestPath = GUEST_PATHS.some((path) => matchesRoute(pathname, path));
  const isOnboardingPath = matchesRoute(pathname, ONBOARDING_PATH);

  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const onboardingCompleted = request.cookies.get(ONBOARDING_COOKIE)?.value === "1";

  if (!isAuthenticated && (isProtectedPath || isOnboardingPath)) {
    return redirectTo(LOGIN_PATH, request);
  }

  if (isAuthenticated && !onboardingCompleted && (isProtectedPath || isGuestPath)) {
    return redirectTo(ONBOARDING_PATH, request);
  }

  if (isAuthenticated && onboardingCompleted && (isGuestPath || isOnboardingPath)) {
    return redirectTo(DASHBOARD_PATH, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
