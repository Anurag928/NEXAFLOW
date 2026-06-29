import SplineBackground from "@/components/SplineBackground";
import SignupVisual from "@/components/SignupVisual";
import SignupForm from "@/components/SignupForm";
import AuthRouteGuard from "@/components/AuthRouteGuard";

const SPLINE_SCENE =
  "https://prod.spline.design/tlxScbctM4Xvt00H/scene.splinecode";

export default function SignupPage() {
  return (
    <AuthRouteGuard mode="guest">
      {/* Layer 1 — Spline 3D scene */}
      <SplineBackground scene={SPLINE_SCENE} />

      {/* Layer 2 — Atmosphere overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.58) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3 — UI */}
      <main
        className="relative flex min-h-screen"
        style={{ zIndex: 10 }}
      >
        {/* LEFT — brand panel (desktop only) */}
        <div className="hidden lg:flex lg:w-[52%] items-center justify-center px-16 xl:px-24">
          <SignupVisual />
        </div>

        {/* Hairline vertical divider */}
        <div
          aria-hidden="true"
          className="hidden lg:block w-px self-stretch my-16"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* RIGHT — signup form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              style={{
                width: "520px",
                height: "520px",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 70%)",
              }}
            />
          </div>

          <SignupForm />
        </div>
      </main>
    </AuthRouteGuard>
  );
}
