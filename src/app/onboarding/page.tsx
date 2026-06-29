import SplineBackground from "@/components/SplineBackground";
import OnboardingFlow from "@/components/OnboardingFlow";
import AuthRouteGuard from "@/components/AuthRouteGuard";

const SPLINE_SCENE =
  "https://prod.spline.design/tlxScbctM4Xvt00H/scene.splinecode";

export default function OnboardingPage() {
  return (
    <AuthRouteGuard mode="onboarding">
      {/* Layer 1 — Spline 3D background */}
      <SplineBackground scene={SPLINE_SCENE} />

      {/* Layer 2 — Atmosphere overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3 — Onboarding UI */}
      <main
        className="relative flex items-center justify-center min-h-screen px-6 py-12"
        style={{ zIndex: 10 }}
      >
        <OnboardingFlow />
      </main>
    </AuthRouteGuard>
  );
}
