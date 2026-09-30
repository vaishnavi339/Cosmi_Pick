'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  EyeOff,
  CheckCircle2,
  Droplet,
  ChevronDown,
  Scan,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroCinematic() {
  const shouldReduceMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 35;
      const y = (e.clientY - innerHeight / 2) / 35;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  // Staggered line animation variants
  const lineVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.15 + i * 0.18,
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section
      className="relative isolate overflow-clip w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between bg-[#FBF7F4] dark:bg-[#180F14] section-stack pt-4 pb-8 lg:pt-8 lg:pb-12"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      {/* Background Image with Slow Ken Burns Breathing Zoom (z-0, NO negative z-index) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#FBF7F4] dark:bg-[#180F14]">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/mood/hero-skincare-wide.webp"
            alt="Botanical skincare formulations and serum droplets"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-right lg:object-center select-none"
          />
        </motion.div>

        {/* Soft Ivory to Blush Luxury Gradient Overlay for pristine text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F4]/98 via-[#FBF7F4]/90 to-[#F4D9D6]/40 dark:from-[#180F14]/98 dark:via-[#180F14]/92 dark:to-[#3B1F2B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF7F4] via-transparent to-[#FBF7F4]/40 dark:from-[#180F14] dark:to-[#180F14]/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Line-by-Line Staggered Headline, Subheading, CTAs & Reassurance */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Pill Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D9D6]/70 dark:bg-[#3B1F2B]/70 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#3B1F2B] dark:text-[#F4D9D6] shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CE7F79]" />
              <span>Tailored Cosmetic Formulation</span>
            </motion.div>

            {/* Line-by-line staggered masked headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-[#3B1F2B] dark:text-[#FAF3F0] leading-[1.08] tracking-tight">
              <span className="block overflow-hidden py-1">
                <motion.span
                  custom={0}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block"
                >
                  Skincare,
                </motion.span>
              </span>
              <span className="block overflow-hidden py-1">
                <motion.span
                  custom={1}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block"
                >
                  picked for <span className="italic font-normal text-[#CE7F79] dark:text-[#F4D9D6]">your</span> face.
                </motion.span>
              </span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-base sm:text-lg text-[#7E636E] dark:text-[#B59FA9] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              No generic bestsellers or 10-step guesswork. A gentle 10-second optical scan pairs your facial tone, contour, and daily concerns with exact active formulations.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                id="hero-start-scan-btn"
                href="/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_10px_25px_-5px_rgba(59,31,43,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(59,31,43,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Start your scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                id="hero-quiz-btn"
                href="/scan?mode=quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm sm:text-base font-semibold text-[#3B1F2B] dark:text-[#F4D9D6] border-2 border-[#3B1F2B] dark:border-[#F4D9D6] hover:bg-[#3B1F2B]/5 dark:hover:bg-[#F4D9D6]/10 transition-all duration-200"
              >
                <span>Take the quick quiz</span>
              </Link>
            </motion.div>

            {/* Reassurance Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="pt-4 border-t border-[#E8D3C0]/60 dark:border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8CA583]" />
                <span>Your scan stays on your device</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[#8CA583]" />
                <span>No photos recorded</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CA583]" />
                <span>100% Free & Instant</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating Interactive Glass Cards with Mouse Parallax */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
            {/* Ambient luxury halo backdrop */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#F4D9D6]/60 via-[#E8D3C0]/40 to-[#C9D6C3]/40 dark:from-[#3B1F2B]/40 dark:via-[#20151C]/40 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Card 1: Central Scan Preview with Animated Face-Mesh Outline */}
            <motion.div
              style={
                shouldReduceMotion
                  ? {}
                  : {
                      x: mouseOffset.x * 0.7,
                      y: mouseOffset.y * 0.7,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [-6, 6, -6],
                    }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] rounded-3xl p-6 sm:p-7 bg-[#FBF7F4]/85 dark:bg-[#20151C]/85 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-2xl"
            >
              {/* Scan Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8D3C0]/50 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#8CA583]/20 flex items-center justify-center text-[#44633B] dark:text-[#C9D6C3]">
                    <Scan className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
                      Optical Mesh Tracker
                    </h4>
                    <p className="text-[10px] text-[#7E636E] dark:text-[#B59FA9]">
                      478 Client-side Landmark Nodes
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3]">
                  Active
                </span>
              </div>

              {/* Animated Face-Mesh Simulation Area */}
              <div className="relative my-6 aspect-square w-full rounded-2xl bg-gradient-to-b from-[#F4D9D6]/30 via-white/50 to-[#FAF5F0]/60 dark:from-[#3B1F2B]/30 dark:to-[#180F14]/50 border border-[#E8D3C0]/60 dark:border-white/10 overflow-hidden flex items-center justify-center">
                {/* Simulated Face Contour Outline */}
                <svg className="w-36 h-48 opacity-75 animate-pulse" viewBox="0 0 100 130">
                  <path
                    d="M 50 15 C 25 15, 18 35, 18 65 C 18 95, 32 118, 50 118 C 68 118, 82 95, 82 65 C 82 35, 75 15, 50 15 Z"
                    fill="none"
                    stroke="#CE7F79"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Subtle landmark points */}
                  <circle cx="50" cy="40" r="1.8" fill="#CE7F79" />
                  <circle cx="36" cy="52" r="2" fill="#8CA583" />
                  <circle cx="64" cy="52" r="2" fill="#8CA583" />
                  <circle cx="50" cy="68" r="1.5" fill="#CE7F79" />
                  <circle cx="50" cy="85" r="2" fill="#CE7F79" />
                  <circle cx="38" cy="98" r="1.8" fill="#8CA583" />
                  <circle cx="62" cy="98" r="1.8" fill="#8CA583" />
                </svg>

                {/* Vertical Sweep Radar Line */}
                <motion.div
                  animate={{ y: [-90, 90, -90] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#CE7F79] to-transparent shadow-[0_0_12px_#CE7F79]"
                />

                <div className="absolute bottom-2 text-center text-[10px] font-bold text-[#7E636E] dark:text-[#B59FA9] uppercase tracking-wider">
                  Analyzing Dermal Undertone
                </div>
              </div>

              {/* Trait Output Preview */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10">
                  <span className="block text-[10px] text-[#7E636E] dark:text-[#B59FA9]">Tone</span>
                  <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">Warm Peach</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10">
                  <span className="block text-[10px] text-[#7E636E] dark:text-[#B59FA9]">T-Zone</span>
                  <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">Balanced Hydration</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Floating Match-Score Ring */}
            <motion.div
              style={
                shouldReduceMotion
                  ? {}
                  : {
                      x: mouseOffset.x * -1.1,
                      y: mouseOffset.y * -1.1,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [8, -8, 8],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -top-4 -right-2 sm:-right-6 z-20 p-4 rounded-2xl bg-white/90 dark:bg-[#180F14]/90 backdrop-blur-xl border border-[#E8D3C0] dark:border-white/15 shadow-xl flex items-center gap-3.5"
            >
              {/* Circular SVG match score ring */}
              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#E8D3C0] dark:text-white/10"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#CE7F79]"
                    strokeDasharray="98, 100"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold text-xs text-[#3B1F2B] dark:text-[#FAF3F0]">
                  Match
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#CE7F79]">
                  Preference Match
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
                  Tailored Routine
                </span>
              </div>
            </motion.div>

            {/* Card 3: Floating Ingredient Chip */}
            <motion.div
              style={
                shouldReduceMotion
                  ? {}
                  : {
                      x: mouseOffset.x * 0.9,
                      y: mouseOffset.y * 0.9,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [-8, 6, -8],
                    }
              }
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-5 -left-2 sm:-left-6 z-20 px-4 py-3 rounded-2xl bg-white/90 dark:bg-[#180F14]/90 backdrop-blur-xl border border-[#E8D3C0] dark:border-white/15 shadow-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F4D9D6] dark:bg-[#3B1F2B] flex items-center justify-center text-[#CE7F79]">
                <Droplet className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <span className="block font-serif font-bold text-xs text-[#3B1F2B] dark:text-[#FAF3F0]">
                  Niacinamide + Zinc 1%
                </span>
                <span className="text-[10px] text-[#7E636E] dark:text-[#B59FA9]">
                  Calibrates T-zone & pores
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Subtle Scroll Cue at the bottom */}
      <div className="w-full flex justify-center items-center pt-2">
        <Link
          href="/#how-it-works"
          aria-label="Scroll to How It Works"
          className="flex flex-col items-center gap-1.5 text-[11px] font-semibold text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors group"
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-[#CE7F79] group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
