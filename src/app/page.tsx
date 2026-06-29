'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustSection from '@/components/TrustSection';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import ProductDemo from '@/components/ProductDemo';
import Pricing from '@/components/Pricing';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={loaded ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden"
    >
      <Navbar />
      <Hero />
      <TrustSection />
      <HowItWorks />
      <Features />
      <ProductDemo />
      <Pricing />
      <CallToAction />
      <Footer />
    </motion.div>
  );
}
