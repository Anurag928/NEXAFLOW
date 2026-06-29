"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithGoogle, handleAuthRedirect, type AuthUser } from "@/lib/auth";

/* ─── Icons ─────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}


function Spinner() {
  return (
    <svg
      className="w-4 h-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0110 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Animation variants ─────────────────────────────────────── */

const container = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/* ─── Input component ────────────────────────────────────────── */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

function FloatInput({ id, ...props }: InputProps) {
  return (
    <input
      id={id}
      {...props}
      style={{
        width: "100%",
        height: "44px",
        padding: "0 16px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        props.onBlur?.(e);
      }}
    />
  );
}

/* ─── OAuth button ───────────────────────────────────────────── */

function OAuthButton({
  icon,
  label,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={loading ? {} : { scale: 1.015 }}
      whileTap={loading ? {} : { scale: 0.985 }}
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        height: "44px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: loading ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.65)",
        fontSize: "13px",
        fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (loading) return;
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
      }}
      onMouseLeave={(e) => {
        if (loading) return;
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "rgba(255,255,255,0.65)";
      }}
    >
      {loading ? <Spinner /> : icon}
      {loading ? "Connecting..." : label}
    </motion.button>
  );
}

/* ─── Main form ──────────────────────────────────────────────── */

type LoadingProvider = "google" | "email" | null;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);
  const [error, setError] = useState<string | null>(null);

  const isAnyLoading = loadingProvider !== null;

  async function handleOAuth(
    provider: "google",
    fn: () => Promise<AuthUser>
  ) {
    setError(null);
    setLoadingProvider(provider);
    try {
      const authUser = await fn();
      await handleAuthRedirect(authUser, router);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Email/password auth can be added here with signInWithEmailAndPassword
    // Placeholder for future implementation
    setError("Email login coming soon. Please use Google.");
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ width: "100%", maxWidth: "352px" }}
    >
      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: "28px" }}>
        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 12, height: 12, background: "#000", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>
            NexaFlow
          </span>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "white",
            marginBottom: "6px",
          }}
        >
          Sign in
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.5 }}>
          Welcome back. Enter your credentials to continue.
        </p>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.2)",
              fontSize: "12px",
              color: "rgba(255,150,150,0.9)",
              lineHeight: 1.5,
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAuth buttons */}
      <motion.div
        variants={item}
        style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}
      >
        <OAuthButton
          icon={<GoogleIcon />}
          label="Continue with Google"
          loading={loadingProvider === "google"}
          onClick={() => handleOAuth("google", loginWithGoogle)}
        />

      </motion.div>

      {/* Divider */}
      <motion.div
        variants={item}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <span
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          or
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </motion.div>

      {/* Email + Password */}
      <motion.form
        variants={item}
        onSubmit={handleEmailSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        <div>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Email
          </label>
          <FloatInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isAnyLoading}
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.22)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.22)"; }}
            >
              Forgot password?
            </Link>
          </div>
          <FloatInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isAnyLoading}
          />
        </div>

        <motion.button
          whileHover={isAnyLoading ? {} : { scale: 1.015 }}
          whileTap={isAnyLoading ? {} : { scale: 0.985 }}
          type="submit"
          disabled={isAnyLoading}
          style={{
            marginTop: "4px",
            width: "100%",
            height: "44px",
            borderRadius: "12px",
            background: isAnyLoading ? "rgba(255,255,255,0.6)" : "white",
            color: "black",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: "none",
            cursor: isAnyLoading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 16px rgba(255,255,255,0.18)",
            transition: "box-shadow 0.25s, background 0.2s",
          }}
        >
          Continue
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.p
        variants={item}
        style={{
          marginTop: "28px",
          textAlign: "center",
          fontSize: "12px",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        No account?{" "}
        <Link
          href="/signup"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          Create one
        </Link>
      </motion.p>
    </motion.div>
  );
}
