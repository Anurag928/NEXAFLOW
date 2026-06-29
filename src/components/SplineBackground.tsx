"use client";

import React from "react";
import dynamic from "next/dynamic";

interface SplineBackgroundProps {
  scene?: string;
}

// Lazy load the Spline canvas to prevent Next.js SSR hydration mismatches
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050505]" />,
});

export default function SplineBackground({ scene }: SplineBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Spline 3D Scene */}
      {scene && (
        <div className="absolute inset-0 w-full h-full opacity-95 flex items-center justify-center pointer-events-none transition-opacity duration-700">
          <Spline scene={scene} />
        </div>
      )}

      {/* Ambient background glows for a clean, premium dark SaaS look */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/[0.06] rounded-full blur-[100px] pointer-events-none" />

      {/* Premium dark gradient and blur overlays - reduced opacity/darkness to boost WebGL scene visibility */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505]/80 via-transparent to-[#090909]/30 z-[1] pointer-events-none" />
    </div>
  );
}
