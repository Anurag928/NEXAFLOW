"use client";

import { useEffect, useRef } from "react";

/**
 * UnicornBackground
 *
 * Renders the UnicornStudio canvas as a true fixed-position fullscreen
 * background layer.  The script is injected *after* the host div is
 * confirmed in the DOM (useEffect), which prevents the race condition
 * where UnicornStudio.init() scans for [data-us-project] before the
 * element exists.
 *
 * Guard: window.UnicornStudio.isInitialized prevents double-init in
 * React Strict Mode (double-invoke) and on soft navigations.
 */

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

interface UnicornBackgroundProps {
  projectId: string;
}

export default function UnicornBackground({ projectId }: UnicornBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Container must be in the DOM before we call init()
    if (!containerRef.current) return;

    function loadAndInit() {
      // Guard: already running
      if (window.UnicornStudio?.isInitialized) return;

      if (!window.UnicornStudio) {
        window.UnicornStudio = { isInitialized: false, init: () => {} };
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js";
      script.async = true;

      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };

      document.head.appendChild(script);
    }

    loadAndInit();
  }, []);

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        // NO pointer-events:none here — UnicornStudio needs to bind
        // resize / intersection observers on the host element.
        // The overlay above will intercept stray clicks instead.
        pointerEvents: "none",
      }}
    />
  );
}
