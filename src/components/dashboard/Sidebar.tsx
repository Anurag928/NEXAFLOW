"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { User } from "firebase/auth";

/* ─── Nav items ─────────────────────────────────────────────── */

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: NavIconDashboard },
  { label: "Import", href: "/dashboard/import", icon: NavIconImport },
  { label: "Memory Vault", href: "/dashboard/vault", icon: NavIconVault },
  { label: "History", href: "/dashboard/history", icon: NavIconHistory },
  { label: "Analytics", href: "/dashboard/analytics", icon: NavIconAnalytics },
] as const;

const NAV_BOTTOM = [
  { label: "Settings", href: "/dashboard/settings", icon: NavIconSettings },
] as const;

/* ─── Component ─────────────────────────────────────────────── */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
  user: User;
}

export default function DashboardSidebar({
  collapsed,
  onToggle,
  pathname,
  user,
}: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside
      className="sidebar"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* ── Logo ────────────────────────────────────────────── */}
      <div className="sidebar__header">
        <button
          onClick={onToggle}
          className="sidebar__logo-btn"
          aria-label="Toggle sidebar"
        >
          <div className="sidebar__logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect width="6" height="6" rx="1" fill="#000" />
              <rect x="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
              <rect y="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
              <rect x="8" y="8" width="6" height="6" rx="1" fill="#000" opacity="0.15" />
            </svg>
          </div>
          {!collapsed && (
            <span className="sidebar__logo-text">NexaFlow</span>
          )}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                >
                  <span className="sidebar__link-icon">
                    <Icon />
                  </span>
                  {!collapsed && (
                    <span className="sidebar__link-label">{label}</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="sidebar__active-indicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Spacer ──────────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom ──────────────────────────────────────────── */}
      <div className="sidebar__bottom">
        <ul className="sidebar__list">
          {NAV_BOTTOM.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                >
                  <span className="sidebar__link-icon">
                    <Icon />
                  </span>
                  {!collapsed && (
                    <span className="sidebar__link-label">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── User pill ────────────────────────────────────── */}
        <div className="sidebar__user">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              width={28}
              height={28}
              className="sidebar__avatar"
            />
          ) : (
            <div className="sidebar__avatar sidebar__avatar--fallback">
              {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
            </div>
          )}
          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">
                {user.displayName ?? "User"}
              </span>
              <button onClick={handleLogout} className="sidebar__signout">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ─── Icons (16×16, stroke-based, Linear-style) ──────────────── */

function NavIconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

function NavIconImport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8m0 0L5 7m3 3l3-3" />
      <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  );
}

function NavIconVault() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5.5 3V1.5" />
      <path d="M10.5 3V1.5" />
      <circle cx="8" cy="8.5" r="2" />
      <path d="M8 7v1.5l1 0.5" />
    </svg>
  );
}

function NavIconHistory() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}

function NavIconAnalytics() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14l3.5-5 3 3L14 4" />
      <path d="M10.5 4H14v3.5" />
    </svg>
  );
}

function NavIconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2m0 10v2M1 8h2m10 0h2M2.93 2.93l1.41 1.41m7.32 7.32l1.41 1.41M13.07 2.93l-1.41 1.41M4.34 11.66l-1.41 1.41" />
    </svg>
  );
}
