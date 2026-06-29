"use client";

import Link from "next/link";

const links = {
  Product: ["Features", "How it Works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API Reference", "Status", "Support"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "Security"],
};

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-black rounded-sm" />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">NexaFlow</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              AI conversation portability for the modern era.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white/50 tracking-widest uppercase mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05] gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 NexaFlow, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed with precision. Built for intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
