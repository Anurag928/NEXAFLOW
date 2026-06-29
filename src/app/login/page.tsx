import SplineBackground from "@/components/SplineBackground";
import LoginVisual from "@/components/LoginVisual";
import LoginForm from "@/components/LoginForm";
import AuthRouteGuard from "@/components/AuthRouteGuard";

const SPLINE_SCENE =
  "https://prod.spline.design/cqY4EwmOzb4HnJz9/scene.splinecode";

export default function LoginPage() {
  return (
    <AuthRouteGuard mode="guest">
      {/*
       * ── LAYER 1 ─ Spline 3D scene ─────────────────────────────
       * Fixed fullscreen, lazy-loaded, pointer-events-none.
       * z-index: 0  (canvas lives here)
       * ──────────────────────────────────────────────────────────
       */}
      <SplineBackground scene={SPLINE_SCENE} />

      {/*
       * ── LAYER 2 ─ Atmosphere overlay ──────────────────────────
       * Darkens the 3D scene for readability without killing depth.
       * z-index: 1  (sits directly above canvas)
       * ──────────────────────────────────────────────────────────
       */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          // Vignette-style: darker edges, lighter centre — keeps the
          // 3D scene visible in the middle where it's most impactful.
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.58) 100%)",
          pointerEvents: "none",
        }}
      />

      {/*
       * ── LAYER 3 ─ UI content ──────────────────────────────────
       * The entire login system floats above the background layers.
       * z-index: 10  (always above layers 1 & 2)
       * ──────────────────────────────────────────────────────────
       */}
      <main
        className="relative flex min-h-screen"
        style={{ zIndex: 10 }}
      >
        {/* LEFT — brand panel (desktop only) */}
        <div className="hidden lg:flex lg:w-[52%] items-center justify-center px-16 xl:px-24">
          <LoginVisual />
        </div>

        {/* Hairline vertical divider */}
        <div
          aria-hidden="true"
          className="hidden lg:block w-px self-stretch my-16"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* RIGHT — auth form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
          {/* Ambient radial glow behind the form card */}
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

          <LoginForm />
        </div>
      </main>
    </AuthRouteGuard>
  );
}
