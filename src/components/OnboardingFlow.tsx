"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ═══════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════ */

const AI_MODELS = [
  { id: "chatgpt",  name: "ChatGPT",  color: "#10A37F" },
  { id: "gemini",   name: "Gemini",   color: "#4285F4" },
  { id: "claude",   name: "Claude",   color: "#D97757" },
  { id: "deepseek", name: "DeepSeek", color: "#6366F1" },
  { id: "grok",     name: "Grok",     color: "#E5E5E5" },
];

const PURPOSES = [
  { id: "coding",   label: "Coding",   icon: "⌨" },
  { id: "learning", label: "Learning", icon: "📖" },
  { id: "research", label: "Research", icon: "🔬" },
  { id: "writing",  label: "Writing",  icon: "✍" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "other",    label: "Other",    icon: "✦" },
];

const SETUP_STEPS = [
  "Understanding your AI workflow",
  "Preparing memory system",
  "Configuring preferences",
  "Creating workspace",
];

/* ═══════════════════════════════════════════════════════════════
   Animations
   ═══════════════════════════════════════════════════════════════ */

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
};

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 4;

export default function OnboardingFlow() {
  const { user, loading, completeOnboarding } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupDone, setSetupDone] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  /* ── Auth guard ────────────────────────────────────────────── */


  /* ── Skip if already onboarded ─────────────────────────────── */


  /* ── Step 4 setup animation ────────────────────────────────── */

  useEffect(() => {
    if (step !== 3) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    SETUP_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setSetupProgress(i + 1), 800 + i * 900)
      );
    });
    timers.push(
      setTimeout(() => setSetupDone(true), 800 + SETUP_STEPS.length * 900 + 400)
    );

    return () => timers.forEach(clearTimeout);
  }, [step]);

  /* ── Navigation ────────────────────────────────────────────── */

  function goNext() {
    const nextStep = Math.min(step + 1, TOTAL_STEPS - 1);

    setDirection(1);
    if (nextStep === 3 && step !== 3) {
      setSetupProgress(0);
      setSetupDone(false);
    }
    setStep(nextStep);
  }

  /* ── Finish ────────────────────────────────────────────────── */

  const handleFinish = useCallback(async () => {
    if (!user) return;

    setIsCompleting(true);
    setCompletionError(null);

    try {
      await completeOnboarding({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        selectedModels,
        purpose: selectedPurpose,
      });
      router.replace("/dashboard");
    } catch (error) {
      console.error("[OnboardingFlow] Failed to complete onboarding:", error);
      setCompletionError("We couldn't save onboarding. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  }, [completeOnboarding, user, selectedModels, selectedPurpose, router]);

  /* ── Model toggle ──────────────────────────────────────────── */

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  /* ── Loading / no-user guard ───────────────────────────────── */

  if (loading || !user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div
          style={{
            width: 18, height: 18, borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderTopColor: "rgba(255,255,255,0.5)",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════ */

  return (
    <div style={{ width: "100%", maxWidth: 560, position: "relative" }}>
      {/* ── Progress indicator ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginBottom: 36,
        }}
      >
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
          Step {step + 1} of {TOTAL_STEPS}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === step
                    ? "rgba(255,255,255,0.7)"
                    : i < step
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.1)",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Step content ────────────────────────────────────── */}
      <AnimatePresence mode="wait" custom={direction}>
        {/* ── Step 1: Welcome ────────────────────────────────── */}
        {step === 0 && (
          <motion.div
            key="step-0"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={cardStyle}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={logoStyle}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect width="6" height="6" rx="1" fill="#000" />
                  <rect x="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
                  <rect y="8" width="6" height="6" rx="1" fill="#000" opacity="0.4" />
                  <rect x="8" y="8" width="6" height="6" rx="1" fill="#000" opacity="0.15" />
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.02em" }}>
                NexaFlow
              </span>
            </div>

            <h1 style={headingStyle}>
              Welcome to your<br />AI memory layer
            </h1>

            <p style={descStyle}>
              Continue your conversations across AI models without losing context.
            </p>

            {/* Model flow visualization */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 32 }}>
              {AI_MODELS.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 12px",
                    borderRadius: 7,
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{m.name}</span>
                  <svg style={{ marginLeft: "auto", color: "rgba(255,255,255,0.12)" }} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M3 7h8m0 0L8 4.5M11 7L8 9.5" />
                  </svg>
                </motion.div>
              ))}
            </div>

            <OnboardingButton onClick={goNext}>Get Started</OnboardingButton>
          </motion.div>
        )}

        {/* ── Step 2: Select AI Models ───────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={cardStyle}
          >
            <h2 style={headingStyle}>
              Which AI assistants<br />do you use?
            </h2>
            <p style={descStyle}>Select all that apply. You can change this later.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {AI_MODELS.map((m, i) => {
                const selected = selectedModels.includes(m.id);
                return (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleModel(m.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${selected ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      boxShadow: selected ? `0 0 20px ${m.color}10` : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: selected ? m.color : "rgba(255,255,255,0.15)",
                        transition: "background 0.2s",
                        flexShrink: 0,
                        boxShadow: selected ? `0 0 8px ${m.color}40` : "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: selected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                        transition: "color 0.2s",
                      }}
                    >
                      {m.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <OnboardingButton onClick={goNext} disabled={selectedModels.length === 0}>
              Continue
            </OnboardingButton>
          </motion.div>
        )}

        {/* ── Step 3: Purpose ────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={cardStyle}
          >
            <h2 style={headingStyle}>
              How do you mainly<br />use AI?
            </h2>
            <p style={descStyle}>This helps us personalize your workspace.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {PURPOSES.map((p, i) => {
                const selected = selectedPurpose === p.id;
                return (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPurpose(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${selected ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{p.icon}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: selected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                        transition: "color 0.2s",
                      }}
                    >
                      {p.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <OnboardingButton onClick={goNext} disabled={!selectedPurpose}>
              Continue
            </OnboardingButton>
          </motion.div>
        )}

        {/* ── Step 4: Building workspace ─────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step-3"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={cardStyle}
          >
            {!setupDone ? (
              <>
                <h2 style={{ ...headingStyle, textAlign: "center" }}>
                  Creating your<br />NexaFlow workspace
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8, marginBottom: 8 }}>
                  {SETUP_STEPS.map((label, i) => {
                    const done = setupProgress > i;
                    const active = setupProgress === i;
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: done ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${done ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)"}`,
                          transition: "all 0.4s ease",
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.3s ease",
                            ...(done
                              ? { background: "rgba(52,211,153,0.15)" }
                              : active
                              ? {
                                  border: "1.5px solid rgba(255,255,255,0.3)",
                                  animation: "spin 1s linear infinite",
                                }
                              : { border: "1.5px solid rgba(255,255,255,0.08)" }),
                          }}
                        >
                          {done && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5.5L4 7.5L8 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 450,
                            color: done
                              ? "rgba(52,211,153,0.8)"
                              : active
                              ? "rgba(255,255,255,0.6)"
                              : "rgba(255,255,255,0.2)",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center" }}
              >
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "rgba(52,211,153,0.08)",
                    border: "1px solid rgba(52,211,153,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                <h2 style={{ ...headingStyle, textAlign: "center", marginBottom: 8 }}>
                  Your workspace is ready.
                </h2>
                <p style={{ ...descStyle, textAlign: "center", marginBottom: 32 }}>
                  Everything is set up. Let&apos;s get started.
                </p>

                {completionError && (
                  <p style={{ ...descStyle, textAlign: "center", color: "rgba(248,113,113,0.9)" }}>
                    {completionError}
                  </p>
                )}

                <OnboardingButton onClick={handleFinish} disabled={isCompleting}>
                  {isCompleting ? "Saving..." : "Enter NexaFlow"}
                </OnboardingButton>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════ */

function OnboardingButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.012 }}
      whileTap={disabled ? {} : { scale: 0.988 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 44,
        borderRadius: 10,
        background: disabled ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.92)",
        color: "#050505",
        fontSize: 14,
        fontWeight: 600,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background 0.2s, box-shadow 0.2s",
        boxShadow: disabled ? "none" : "0 1px 12px rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Styles (shared)
   ═══════════════════════════════════════════════════════════════ */

const cardStyle: React.CSSProperties = {
  width: "100%",
  padding: "36px 32px 32px",
  borderRadius: 16,
  background: "rgba(10,10,10,0.65)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 24px 48px rgba(0,0,0,0.4)",
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(22px, 4vw, 28px)",
  fontWeight: 650,
  letterSpacing: "-0.03em",
  color: "#fff",
  lineHeight: 1.2,
  marginBottom: 12,
};

const descStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.3)",
  lineHeight: 1.6,
  marginBottom: 28,
};

const logoStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(255,255,255,0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 16px rgba(255,255,255,0.15)",
};
