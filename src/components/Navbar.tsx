"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const handleStartFree = () => {
    setIsOpen(false);
    router.push("/signup");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between gap-4 h-11">
          {/* Logo */}
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 shrink-0 group">
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

          {/* CTA group & Hamburger trigger */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Login
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartFree}
              className="hidden sm:inline-flex px-4 py-2 rounded-full glass-button text-sm font-medium whitespace-nowrap min-h-[40px] items-center justify-center"
            >
              Sign Up
            </motion.button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#050505]/98 border-t border-white/[0.04] backdrop-blur-xl"
          >
            <div className="px-5 py-6 space-y-4 flex flex-col">
              {["Features", "How it Works", "Pricing", "About"].map((label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setIsOpen(false)}
                  className="text-[15px] font-medium text-white/60 hover:text-white py-2.5 border-b border-white/[0.02] transition-colors"
                >
                  {label}
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>

                <button
                  onClick={handleStartFree}
                  className="w-full flex items-center justify-center h-11 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
