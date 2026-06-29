"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SplineBackground from "@/components/SplineBackground";
import AuthRouteGuard from "@/components/AuthRouteGuard";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SPLINE_SCENE = "https://prod.spline.design/cqY4EwmOzb4HnJz9/scene.splinecode";

// Framer motion variants for staggering entrance
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 350, damping: 25 } },
};

const MotionLink = motion(Link);

function FloatInput({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    // 🧪 Logging before sending reset email
    console.log("Reset request email:", email.trim());
    console.log("Firebase project:", auth.app.options.projectId);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(true);
      
      // 🧪 Logging after successful send
      console.log("Password reset email sent successfully");
    } catch (err: any) {
      console.error("Firebase Reset Error:", err.code, err.message);
      
      // 🧪 Logging failure details
      console.log(err.code);
      console.log(err.message);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No account exists with this email.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please try again.");
          break;
        default:
          setError("Unable to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRouteGuard mode="guest">
      {/* Background Spline and Vignette Atmosphere Overlay */}
      <SplineBackground scene={SPLINE_SCENE} />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.58) 100%)",
          pointerEvents: "none",
        }}
      />

      <main className="relative flex min-h-screen items-center justify-center px-6" style={{ zIndex: 10 }}>
        {/* Glow ambient background sphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: "520px",
              height: "520px",
              background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ width: "100%", maxWidth: "352px" }}
          className="relative z-10"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Brand Header */}
                <motion.div variants={item} className="flex items-center gap-2">
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
                  <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.78)", letterSpacing: "-0.01em" }}>
                    NexaFlow
                  </span>
                </motion.div>

                {/* Form Title & Subheader */}
                <motion.div variants={item} className="space-y-1.5">
                  <h2 style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.02em", color: "white" }}>
                    Reset Password
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.5 }}>
                    Enter your email to receive a password reset link.
                  </p>
                </motion.div>

                {/* Error Panel */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "rgba(255,80,80,0.08)",
                        border: "1px solid rgba(255,80,80,0.2)",
                        fontSize: "12px",
                        color: "rgba(255,150,150,0.9)",
                        lineHeight: 1.5,
                      }}
                      className="flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input form */}
                <motion.form variants={item} onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      style={{
                        display: "block",
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.28)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Email Address
                    </label>
                    <FloatInput
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>

                  <motion.button
                    whileHover={loading || !email ? {} : { scale: 1.015 }}
                    whileTap={loading || !email ? {} : { scale: 0.985 }}
                    type="submit"
                    disabled={loading || !email}
                    style={{
                      marginTop: "12px",
                      width: "100%",
                      height: "44px",
                      borderRadius: "12px",
                      background: loading || !email ? "rgba(255,255,255,0.04)" : "white",
                      color: loading || !email ? "rgba(255,255,255,0.2)" : "black",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "none",
                      cursor: loading || !email ? "not-allowed" : "pointer",
                      boxShadow: loading || !email ? "none" : "0 2px 16px rgba(255,255,255,0.18)",
                      transition: "box-shadow 0.25s, background 0.2s, color 0.2s",
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </motion.button>
                </motion.form>

                {/* Back to Login Anchor */}
                <motion.div variants={item} className="text-center pt-2">
                  <Link
                    href="/login"
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    className="inline-flex items-center gap-1.5 hover:text-white/60"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to sign in</span>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-center"
              >
                {/* Checkmark Animation container */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </motion.div>

                {/* Success messages */}
                <motion.div variants={item} className="space-y-2 text-center">
                  <h2 style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.02em", color: "white" }}>
                    Password Reset Link Sent Successfully
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.6 }} className="px-2">
                    We have sent a reset link to your email.<br />Please check your inbox and spam folder.
                  </p>
                  <div className="pt-2">
                    <span className="text-[14px] font-bold text-white bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-xl inline-block select-all font-mono">
                      {email}
                    </span>
                  </div>
                </motion.div>

                {/* Return button */}
                <motion.div variants={item} className="pt-4">
                  <MotionLink
                    href="/login"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "44px",
                      borderRadius: "12px",
                      background: "white",
                      color: "black",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      boxShadow: "0 2px 16px rgba(255,255,255,0.18)",
                      cursor: "pointer",
                    }}
                  >
                    Return to sign in
                  </MotionLink>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </AuthRouteGuard>
  );
}
