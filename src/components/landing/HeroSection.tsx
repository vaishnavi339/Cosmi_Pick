'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  EyeOff,
  CheckCircle2,
  ScanFace,
  Droplet,
  Flower2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subheading, CTAs & Trust Row */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D9D6]/60 dark:bg-[#3B1F2B]/50 border border-[#E8D3C0] dark:border-white/10 text-xs font-semibold text-[#3B1F2B] dark:text-[#F4D9D6] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#CE7F79]" />
              <span>Personalized Routine Formulation</span>
            </div>

            {/* Big Serif Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-[#3B1F2B] dark:text-[#FAF3F0] leading-[1.12] tracking-tight">
              Skincare, picked for <span className="italic font-normal text-[#CE7F79] dark:text-[#F4D9D6]">your</span> face.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#7E636E] dark:text-[#B59FA9] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              No generic bestsellers or 10-step guesswork. A gentle 10-second optical scan pairs your facial tone, contour, and daily concerns with exact active formulations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                id="hero-start-scan-btn"
                href="/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_10px_25px_-5px_rgba(59,31,43,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(59,31,43,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Start your scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                id="hero-quiz-btn"
                href="/scan?mode=quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-semibold text-[#3B1F2B] dark:text-[#F4D9D6] border-2 border-[#3B1F2B] dark:border-[#F4D9D6] hover:bg-[#3B1F2B]/5 dark:hover:bg-[#F4D9D6]/10 transition-all duration-200"
              >
                <span>Take the 3-question quiz</span>
              </Link>
            </div>

            {/* Trust Row */}
            <div className="pt-6 border-t border-[#E8D3C0]/60 dark:border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs font-medium text-[#7E636E] dark:text-[#B59FA9]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8CA583]" />
                <span>Scan stays on your device</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[#8CA583]" />
                <span>No photo stored</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CA583]" />
                <span>Free & instant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Photo Area + Floating Scan Card + Floating Product Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient luxury backdrop aura */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#F4D9D6]/50 via-[#E8D3C0]/40 to-[#C9D6C3]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Main Mood Photo Container */}
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden border border-[#E8D3C0] dark:border-white/10 shadow-2xl bg-gradient-to-b from-[#F4D9D6]/30 to-[#FAF5F0]/60 dark:from-[#3B1F2B]/40 dark:to-[#180F14] p-4 flex flex-col justify-between">
              
              {/* Fallback Editorial Mood Visual */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9ECE9] via-[#FAF5F0] to-[#E5ECE3]/50 dark:from-[#24181E] dark:to-[#180F14] flex flex-col items-center justify-center p-8 text-center">
                {/* Face Mesh Simulation Glow */}
                <div className="relative w-48 h-64 rounded-full border border-[#D9B99B]/50 dark:border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-[#F4D9D6]/40 to-transparent" />
                  
                  {/* Subtle animated optical scan lines */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [-80, 80, -80] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-full h-1 bg-gradient-to-r from-transparent via-[#CE7F79] to-transparent opacity-60"
                  />

                  {/* Face Landmarks Constellation Points */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex gap-12 justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#3B1F2B]/40 dark:bg-white/60 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-[#3B1F2B]/40 dark:bg-white/60 animate-pulse" />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8CA583] mx-auto" />
                    <div className="w-12 h-1 rounded-full bg-[#CE7F79]/50 mx-auto" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="font-serif text-lg font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                    Biometric Optical Canvas
                  </span>
                  <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] max-w-xs">
                    478 gentle optical mesh nodes evaluate dermal hydration, undertone, and T-zone balance.
                  </p>
                </div>
              </div>

              {/* Floating Card 1: Live Scan Indicator */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-6 left-6 p-3 rounded-2xl glass-luxury bg-white/85 dark:bg-[#180F14]/90 border border-[#E8D3C0] dark:border-white/10 shadow-lg flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-full bg-[#8CA583]/20 flex items-center justify-center text-[#44633B] dark:text-[#C9D6C3]">
                  <ScanFace className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#3B1F2B] dark:text-[#FAF3F0] block">
                    Warm Undertone Detected
                  </span>
                  <span className="text-[10px] text-[#7E636E] dark:text-[#B59FA9]">
                    Oval Contour • 98% Confidence
                  </span>
                </div>
              </motion.div>

              {/* Floating Card 2: #1 Matched Formulation */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 right-6 p-3.5 rounded-2xl glass-luxury bg-white/90 dark:bg-[#180F14]/95 border border-[#E8D3C0] dark:border-white/10 shadow-xl flex items-center gap-3 backdrop-blur-md max-w-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4D9D6]/50 flex items-center justify-center text-[#3B1F2B] flex-shrink-0">
                  <Droplet className="w-5 h-5 text-[#CE7F79]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#CE7F79]">
                      Preference Match
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#8CA583]" />
                    <span className="text-[9px] text-[#7E636E] dark:text-[#B59FA9]">
                      Daily AM Serum
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] truncate">
                    10% Niacinamide + Zinc 1%
                  </h4>
                  <span className="text-[10px] text-[#7E636E] dark:text-[#B59FA9] block">
                    Balances T-zone sebum excretion
                  </span>
                </div>
              </motion.div>

              {/* Floating Card 3: Free from sensitizers badge */}
              <motion.div
                animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-4 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#24181E]/95 border border-[#E8D3C0] dark:border-white/10 shadow-md text-[10px] font-bold text-[#3B1F2B] dark:text-[#FAF3F0]"
              >
                <Flower2 className="w-3.5 h-3.5 text-[#8CA583]" />
                <span>100% Fragrance-Free</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
