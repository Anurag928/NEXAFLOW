"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signupWithEmail,
  loginWithGoogle,
  handleAuthRedirect,
  type AuthUser,
} from "@/lib/auth";

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
    <svg className="w-4 h-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.59 6.59a2 2 0 002.82 2.82" />
      <path d="M10.73 10.73A6.2 6.2 0 018 12.5C4 12.5 1.5 8 1.5 8a11.28 11.28 0 013.77-3.73M6.5 3.68A5.5 5.5 0 018 3.5c4 0 6.5 4.5 6.5 4.5a11.28 11.28 0 01-1.28 1.73" />
      <path d="M2 2l12 12" />
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
      staggerChildren: 0.06,
      delayChildren: 0.1,
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
  error?: string;
  suffix?: React.ReactNode;
}

function FormInput({ id, error, suffix, style, ...props }: InputProps) {
  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        {...props}
        style={{
          width: "100%",
          height: "44px",
          padding: suffix ? "0 42px 0 16px" : "0 16px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
          color: "white",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s, background 0.2s",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(248,113,113,0.6)"
            : "rgba(255,255,255,0.2)";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(248,113,113,0.4)"
            : "rgba(255,255,255,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          props.onBlur?.(e);
        }}
      />
      {suffix && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {suffix}
        </div>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            style={{
              fontSize: "11px",
              color: "rgba(248,113,113,0.9)",
              marginTop: "6px",
              lineHeight: 1.3,
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
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
        borderRadius: "10px",
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

/* ─── Validation helpers ─────────────────────────────────────── */

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return undefined;
}

function validatePassword(pw: string): string | undefined {
  if (!pw) return "Password is required";
  if (pw.length < 8) return "Password must contain at least 8 characters";
  return undefined;
}

/* ─── Main form ──────────────────────────────────────────────── */

type LoadingProvider = "google" | "email" | null;

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isAnyLoading = loadingProvider !== null;

  /* ── OAuth handler ────────────────────────────────────────── */

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

  /* ── Field blur validation ────────────────────────────────── */

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const errs: Record<string, string | undefined> = {};
    if (field === "name" && !name.trim()) errs.name = "Name is required";
    if (field === "email") errs.email = validateEmail(email);
    if (field === "password") errs.password = validatePassword(password);
    if (field === "confirmPw") {
      if (!confirmPw) errs.confirmPw = "Please confirm your password";
      else if (confirmPw !== password) errs.confirmPw = "Passwords do not match";
    }

    setFieldErrors((prev) => ({ ...prev, ...errs }));
  }

  /* ── Submit ───────────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Full validation
    const errs: Record<string, string | undefined> = {};
    if (!name.trim()) errs.name = "Name is required";
    errs.email = validateEmail(email);
    errs.password = validatePassword(password);
    if (!confirmPw) errs.confirmPw = "Please confirm your password";
    else if (confirmPw !== password) errs.confirmPw = "Passwords do not match";

    // Filter undefined
    const activeErrors = Object.fromEntries(
      Object.entries(errs).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(activeErrors).length > 0) {
      setFieldErrors(activeErrors);
      setTouched({ name: true, email: true, password: true, confirmPw: true });
      return;
    }

    setLoadingProvider("email");
    try {
      const authUser = await signupWithEmail(email, password, name.trim());
      await handleAuthRedirect(authUser, router);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "36px 32px 32px",
        borderRadius: "16px",
        background: "rgba(10,10,10,0.65)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.5), 0 24px 48px rgba(0,0,0,0.4)",
      }}
    >
      {/* Heading */}
      <motion.div variants={item} style={{ marginBottom: "6px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 650,
            letterSpacing: "-0.025em",
            color: "white",
            lineHeight: 1.3,
          }}
        >
          Create your account
        </h1>
      </motion.div>

      <motion.p
        variants={item}
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "28px",
          lineHeight: 1.5,
        }}
      >
        Start transferring your AI conversations seamlessly.
      </motion.p>

      {/* Global error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.15)",
              fontSize: "12px",
              color: "rgba(248,113,113,0.9)",
              lineHeight: 1.4,
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
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            fontWeight: 500,
          }}
        >
          or continue with email
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div
          variants={item}
          style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}
        >
          {/* Name */}
          <div>
            <label
              htmlFor="signup-name"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
              }}
            >
              Full Name
            </label>
            <FormInput
              id="signup-name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) setFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              onBlur={() => handleBlur("name")}
              error={touched.name ? fieldErrors.name : undefined}
              disabled={isAnyLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <FormInput
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              onBlur={() => handleBlur("email")}
              error={touched.email ? fieldErrors.email : undefined}
              disabled={isAnyLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <FormInput
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              onBlur={() => handleBlur("password")}
              error={touched.password ? fieldErrors.password : undefined}
              disabled={isAnyLoading}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "2px",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.25)",
                    display: "flex",
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <FormInput
              id="signup-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                if (touched.confirmPw) setFieldErrors((p) => ({ ...p, confirmPw: undefined }));
              }}
              onBlur={() => handleBlur("confirmPw")}
              error={touched.confirmPw ? fieldErrors.confirmPw : undefined}
              disabled={isAnyLoading}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "2px",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.25)",
                    display: "flex",
                  }}
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={item}>
          <motion.button
            whileHover={isAnyLoading ? {} : { scale: 1.012 }}
            whileTap={isAnyLoading ? {} : { scale: 0.988 }}
            type="submit"
            disabled={isAnyLoading}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "10px",
              background:
                loadingProvider === "email"
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.92)",
              color: "#050505",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: isAnyLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 1px 12px rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              if (isAnyLoading) return;
              e.currentTarget.style.boxShadow = "0 2px 20px rgba(255,255,255,0.16)";
            }}
            onMouseLeave={(e) => {
              if (isAnyLoading) return;
              e.currentTarget.style.boxShadow = "0 1px 12px rgba(255,255,255,0.08)";
            }}
          >
            {loadingProvider === "email" && <Spinner />}
            {loadingProvider === "email" ? "Creating account..." : "Create Account"}
          </motion.button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.p
        variants={item}
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "rgba(255,255,255,0.25)",
          marginTop: "24px",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          Log in
        </Link>
      </motion.p>
    </motion.div>
  );
}
