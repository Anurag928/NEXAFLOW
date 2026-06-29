"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 glass-nav"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
            <div className="w-3.5 h-3.5 bg-black rounded-[3px]" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white group-hover:text-white/80 transition-colors">
            NexaFlow
          </span>
        </Link>

        {/* Nav links – hidden on mobile */}
        <div className="hidden md:flex items-center gap-7">
          {["Features", "How it Works", "Pricing", "About"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA group */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Login
          </Link>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 rounded-full glass-button text-sm font-medium whitespace-nowrap"
          >
            Start Free
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
