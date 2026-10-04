'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Camera,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export function PinnedScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  // Hook into scroll progress of the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Keep active step state in sync for indicators
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.33) {
        setActiveStep(0);
      } else if (latest < 0.66) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Image Opacity Transforms
  const img1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0]);
  const img2Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.62, 0.70], [0, 1, 1, 0]);
  const img3Opacity = useTransform(scrollYProgress, [0.62, 0.70, 1], [0, 1, 1]);

  // Derived Visibility & Pointer Events: strictly hide layers when opacity is 0
  const img1Visibility = useTransform(img1Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const img1PointerEvents = useTransform(img1Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  const img2Visibility = useTransform(img2Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const img2PointerEvents = useTransform(img2Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  const img3Visibility = useTransform(img3Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const img3PointerEvents = useTransform(img3Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  // Image Scale Transforms (subtle cinematic zoom per step)
  const img1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);
  const img2Scale = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.05]);
  const img3Scale = useTransform(scrollYProgress, [0.65, 1], [1, 1.05]);

  // Content card opacities
  const card1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.34], [1, 1, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.60, 0.68], [0, 1, 1, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.62, 0.70, 1], [0, 1, 1]);

  const card1Visibility = useTransform(card1Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const card1PointerEvents = useTransform(card1Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  const card2Visibility = useTransform(card2Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const card2PointerEvents = useTransform(card2Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  const card3Visibility = useTransform(card3Opacity, (v) => (v > 0.01 ? 'visible' : 'hidden'));
  const card3PointerEvents = useTransform(card3Opacity, (v) => (v > 0.01 ? 'auto' : 'none'));

  // Mock UI y-offset shifts
  const card1Y = useTransform(scrollYProgress, [0, 0.26, 0.34], [0, 0, -20]);
  const card2Y = useTransform(scrollYProgress, [0.28, 0.36, 0.60, 0.68], [20, 0, 0, -20]);
  const card3Y = useTransform(scrollYProgress, [0.62, 0.70, 1], [20, 0, 0]);

  // Overall scroll progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const steps = [
    {
      number: '01',
      tag: '10-Second Vision',
      title: 'Scan in Daylight',
      subtitle: 'No upload. No photo saved.',
      description:
        'Position your face in front of your camera for 10 seconds. On-device vision maps 478 dermal landmark points to evaluate undertone pigments, hydration reflection, and surface shine directly in your browser memory.',
      icon: Camera,
      pill: '100% On-Device WebAssembly',
    },
    {
      number: '02',
      tag: 'Tailored Rules',
      title: 'Tell Us What You Need',
      subtitle: 'Your concerns, your constraints.',
      description:
        'Tell us what you want to improve—redness, hydration, or surface texture. Flag ingredients you refuse (like drying alcohol or fragrance) and set your budget ceiling. We strictly honor every constraint.',
      icon: Sliders,
      pill: 'Strict Avoid-Ingredient Filtering',
    },
    {
      number: '03',
      tag: 'Personalized Care',
      title: 'Get Your Picks',
      subtitle: 'Transparent rationale for every choice.',
      description:
        'Receive a routine where every cleanser, active serum, and barrier moisturizer includes clear reasons for its match score based on your scan and preferences. Suggestions, not medical advice.',
      icon: Sparkles,
      pill: 'Clear Active Ingredient Rationale',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-clip scroll-mt-24 bg-[#F7F6F0] dark:bg-[#17201B] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      {/* ================= DESKTOP PINNED SCROLL (lg and above) ================= */}
      <div
        ref={containerRef}
        className="hidden lg:block relative h-[300vh] isolate overflow-clip bg-[#F7F6F0] dark:bg-[#17201B]"
      >
        {/* Sticky 100vh Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-6 sm:px-10 lg:px-16 bg-[#F7F6F0] dark:bg-[#17201B] z-0">
          {/* Background Images Crossfading with Depth (z-0, NO negative z-index) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F7F6F0] dark:bg-[#17201B]">
            {/* Solid opaque background layer under any image */}
            <div className="absolute inset-0 bg-[#F7F6F0] dark:bg-[#17201B] z-0" />

            {/* Step 1 Image */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? (activeStep === 0 ? 1 : 0) : img1Opacity,
                scale: shouldReduceMotion ? 1 : img1Scale,
                visibility: shouldReduceMotion
                  ? activeStep === 0
                    ? 'visible'
                    : 'hidden'
                  : img1Visibility,
                pointerEvents: shouldReduceMotion
                  ? activeStep === 0
                    ? 'auto'
                    : 'none'
                  : img1PointerEvents,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src="/images/mood/step-01-daylight-scan.webp"
                alt="Natural skin texture in soft morning daylight"
                fill
                quality={90}
                className="object-cover object-center select-none brightness-[0.94] dark:brightness-[0.65]"
              />
            </motion.div>

            {/* Step 2 Image */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? (activeStep === 1 ? 1 : 0) : img2Opacity,
                scale: shouldReduceMotion ? 1 : img2Scale,
                visibility: shouldReduceMotion
                  ? activeStep === 1
                    ? 'visible'
                    : 'hidden'
                  : img2Visibility,
                pointerEvents: shouldReduceMotion
                  ? activeStep === 1
                    ? 'auto'
                    : 'none'
                  : img2PointerEvents,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src="/images/mood/step-02-dropper-rules.webp"
                alt="Amber dropper pipette with active serum and facial roller"
                fill
                quality={90}
                className="object-cover object-center select-none brightness-[0.94] dark:brightness-[0.65]"
              />
            </motion.div>

            {/* Step 3 Image */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? (activeStep === 2 ? 1 : 0) : img3Opacity,
                scale: shouldReduceMotion ? 1 : img3Scale,
                visibility: shouldReduceMotion
                  ? activeStep === 2
                    ? 'visible'
                    : 'hidden'
                  : img3Visibility,
                pointerEvents: shouldReduceMotion
                  ? activeStep === 2
                    ? 'auto'
                    : 'none'
                  : img3PointerEvents,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src="/images/mood/step-03-routine-picks.webp"
                alt="Curated skincare routine bottles with floral petals"
                fill
                quality={90}
                className="object-cover object-center select-none brightness-[0.94] dark:brightness-[0.65]"
              />
            </motion.div>

            {/* High-legibility Ivory & Moss Glass Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F0]/95 via-[#F7F6F0]/80 to-[#E2EADD]/30 dark:from-[#17201B]/88 dark:via-[#17201B]/65 dark:to-[#17201B]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F0] via-transparent to-[#F7F6F0]/40 dark:from-[#17201B] dark:to-[#17201B]/40" />
          </div>

          {/* Top Section Header (z-10) */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#213A30]/5 dark:bg-white/10 border border-[#213A30]/15 dark:border-white/10 text-xs font-bold text-[#213A30] dark:text-[#F7F6F0] uppercase tracking-wider">
              <span>The 3-Step Precision Story</span>
            </div>

            {/* Step Indicator Pills */}
            <div className="flex items-center gap-3">
              {steps.map((st, idx) => (
                <div
                  key={st.number}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeStep === idx
                      ? 'bg-[#213A30] text-white dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm scale-105'
                      : 'bg-white/70 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] border border-[#DCDACD]/60 dark:border-white/5'
                  }`}
                >
                  <span className="font-serif">{st.number}</span>
                  <span className="hidden sm:inline">{st.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Interactive Stage */}
          <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Narrative Column (Text & Step Details) */}
            <div className="col-span-6 space-y-6 relative z-10">
              <div className="relative min-h-[300px] flex flex-col justify-center">
                {steps.map((step, idx) => {
                  const isCurrent = activeStep === idx;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.number}
                      className={`transition-all duration-500 ${
                        isCurrent
                          ? 'opacity-100 translate-y-0 relative'
                          : 'opacity-0 translate-y-4 absolute pointer-events-none'
                      }`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2EADD]/80 dark:bg-[#213A30]/80 border border-[#DCDACD] dark:border-white/10 text-xs font-bold text-[#213A30] dark:text-[#E2EADD] mb-4">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{step.pill}</span>
                      </div>

                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="font-serif text-5xl font-bold text-[#B86A4B] dark:text-[#C7A77A]">
                          {step.number}
                        </span>
                        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight">
                          {step.title}
                        </h2>
                      </div>

                      <p className="text-sm font-semibold text-[#846A4F] dark:text-[#C7A77A] mb-4">
                        {step.subtitle}
                      </p>

                      <p className="text-base text-[#4B5A4F] dark:text-[#E0CFD7] leading-relaxed max-w-lg mb-8">
                        {step.description}
                      </p>

                      <Link
                        href="/scan"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-[#F7F6F0] bg-[#213A30] hover:bg-[#14271F] shadow-[0_4px_16px_rgba(59,31,43,0.25)] hover:shadow-[0_8px_24px_rgba(59,31,43,0.35)] hover:-translate-y-0.5 transition-all"
                      >
                        <span>Experience Step {step.number}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#DCDACD]/40 dark:bg-white/10 h-1.5 rounded-full overflow-hidden max-w-md">
                <motion.div
                  className="bg-[#213A30] dark:bg-[#E2EADD] h-full"
                  style={{
                    width: shouldReduceMotion
                      ? `${((activeStep + 1) / 3) * 100}%`
                      : progressWidth,
                  }}
                />
              </div>
            </div>

            {/* Right Column: Dynamic Mock UI Stage */}
            <div className="col-span-6 relative flex items-center justify-center z-10">
              {/* Glass Frame Container */}
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl glass-card bg-white/85 dark:bg-[#1E2822]/90 border border-white/80 dark:border-white/15 p-6 shadow-2xl backdrop-blur-xl overflow-hidden z-10">
                
                {/* Step 1 Mock UI: Optical Camera & Face Landmarker Radar */}
                <motion.div
                  style={{
                    opacity: shouldReduceMotion ? (activeStep === 0 ? 1 : 0) : card1Opacity,
                    y: shouldReduceMotion ? 0 : card1Y,
                    visibility: shouldReduceMotion
                      ? activeStep === 0
                        ? 'visible'
                        : 'hidden'
                      : card1Visibility,
                    pointerEvents: shouldReduceMotion
                      ? activeStep === 0
                        ? 'auto'
                        : 'none'
                      : card1PointerEvents,
                  }}
                  className="absolute inset-0 p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCDACD]/50 dark:border-white/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                        On-Device Optical Vision
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#B86A4B] font-bold">
                      478 Landmark Nodes Locked
                    </span>
                  </div>

                  {/* Simulated Face Oval with Scanning Laser (strictly kept inside mock scanner area, z-0 below text) */}
                  <div className="relative my-auto w-40 h-52 mx-auto rounded-[50%] border-2 border-dashed border-[#B86A4B]/60 flex items-center justify-center overflow-hidden z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#E2EADD]/20 via-transparent to-[#E2EADD]/30 z-0" />
                    {/* Scanning radar line */}
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#213A30] dark:via-[#E2EADD] to-transparent animate-bounce opacity-80 z-0" />
                    <div className="text-center space-y-1 relative z-10">
                      <Camera className="w-6 h-6 text-[#213A30] dark:text-[#F7F6F0] mx-auto opacity-70" />
                      <span className="text-[10px] font-semibold text-[#213A30] dark:text-[#F7F6F0] block">
                        Align Face
                      </span>
                    </div>
                  </div>

                  {/* Real-time telemetry badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#DCDACD]/50 dark:border-white/10 relative z-10">
                    <div className="p-2 rounded-xl bg-[#F7F6F0] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#68766C] dark:text-[#A6B0A5] block">Undertone</span>
                      <strong className="text-xs text-[#213A30] dark:text-[#F7F6F0]">Warm Peach</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F7F6F0] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#68766C] dark:text-[#A6B0A5] block">Hydration</span>
                      <strong className="text-xs text-[#213A30] dark:text-[#F7F6F0]">Balanced</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F7F6F0] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#68766C] dark:text-[#A6B0A5] block">Privacy</span>
                      <strong className="text-xs text-[#405C45] dark:text-[#D4E2D2] flex items-center justify-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> 100% Local
                      </strong>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 Mock UI: Rules & Avoidances */}
                <motion.div
                  style={{
                    opacity: shouldReduceMotion ? (activeStep === 1 ? 1 : 0) : card2Opacity,
                    y: shouldReduceMotion ? 0 : card2Y,
                    visibility: shouldReduceMotion
                      ? activeStep === 1
                        ? 'visible'
                        : 'hidden'
                      : card2Visibility,
                    pointerEvents: shouldReduceMotion
                      ? activeStep === 1
                        ? 'auto'
                        : 'none'
                      : card2PointerEvents,
                  }}
                  className="absolute inset-0 p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCDACD]/50 dark:border-white/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#B86A4B]" />
                      <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                        Custom Rule Constraints
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#71896C]/20 text-[#405C45] dark:text-[#D4E2D2] font-bold">
                      Strict Mode Active
                    </span>
                  </div>

                  <div className="space-y-3.5 my-auto relative z-10">
                    {/* Primary Goal */}
                    <div className="p-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#68766C] dark:text-[#A6B0A5]">Focus Concern:</span>
                      <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0] bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-[#DCDACD]/50 dark:border-white/10">
                        Barrier Repair & Redness
                      </span>
                    </div>

                    {/* Excluded Ingredients */}
                    <div className="p-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 space-y-2">
                      <span className="text-[11px] font-bold text-[#B86A4B] block">
                        Strictly Avoid:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#B86A4B]/15 text-[#213A30] dark:text-[#E2EADD] text-[10px] font-semibold">
                          ✕ Synthetic Fragrance
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#B86A4B]/15 text-[#213A30] dark:text-[#E2EADD] text-[10px] font-semibold">
                          ✕ Essential Oils
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#B86A4B]/15 text-[#213A30] dark:text-[#E2EADD] text-[10px] font-semibold">
                          ✕ Drying Alcohols
                        </span>
                      </div>
                    </div>

                    {/* Price Tier */}
                    <div className="p-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#68766C] dark:text-[#A6B0A5]">Budget Range:</span>
                      <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                        ₹500 — ₹1,500 / item
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-2 text-[11px] text-[#68766C] dark:text-[#A6B0A5] relative z-10">
                    Recommendations are filtered strictly against your constraints.
                  </div>
                </motion.div>

                {/* Step 3 Mock UI: Verified Routine Picks (oval never shown here) */}
                <motion.div
                  style={{
                    opacity: shouldReduceMotion ? (activeStep === 2 ? 1 : 0) : card3Opacity,
                    y: shouldReduceMotion ? 0 : card3Y,
                    visibility: shouldReduceMotion
                      ? activeStep === 2
                        ? 'visible'
                        : 'hidden'
                      : card3Visibility,
                    pointerEvents: shouldReduceMotion
                      ? activeStep === 2
                        ? 'auto'
                        : 'none'
                      : card3PointerEvents,
                  }}
                  className="absolute inset-0 p-6 flex flex-col justify-between z-10"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCDACD]/50 dark:border-white/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#B86A4B]" />
                      <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                        Top Routine Recommendation
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#213A30] text-white text-[10px] font-bold">
                      <span>Match score based on preferences</span>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="my-auto p-4 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/70 dark:border-white/10 space-y-3 relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#68766C] dark:text-[#A6B0A5]">
                          Step 2 · Active Serum (AM & PM)
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#213A30] dark:text-[#F7F6F0]">
                          Ceramides 0.3% + Madecassoside
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0] block">
                          ₹599
                        </span>
                        <span className="text-[9px] text-[#B86A4B] font-medium block">
                          (demo data)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#4B5A4F] dark:text-[#E0CFD7]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Restores compromised barrier lipids</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Zero fragrance, non-comedogenic texture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#DCDACD]/50 dark:border-white/5 text-[10px] text-[#68766C] dark:text-[#A6B0A5]">
                      <span>Key Actives: Pure Ceramide NP + Centella</span>
                      <span className="font-medium text-[#68766C] dark:text-[#A6B0A5]">Suggestions, not medical advice</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs relative z-10">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Full 3-step routine ready</span>
                    <span className="font-bold text-[#213A30] dark:text-[#F7F6F0]">
                      Cleanser · Serum · SPF
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Bottom subtle scroll helper cue (z-10) */}
          <div className="max-w-7xl mx-auto w-full text-center text-xs text-[#68766C] dark:text-[#A6B0A5] relative z-10">
            <span>Scroll downward to progress through the optical story</span>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET VIEW (< lg) ================= */}
      <div
        className="block lg:hidden py-16 px-4 sm:px-6 relative isolate overflow-clip bg-[#F7F6F0] dark:bg-[#17201B] section-stack"
        style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
      >
        <div className="max-w-xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EADD]/60 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-bold text-[#B86A4B] dark:text-[#F7F6F0] uppercase tracking-wider">
              <span>The 3-Step Precision Story</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight">
              How CosmicPick works
            </h2>
            <p className="text-xs sm:text-sm text-[#68766C] dark:text-[#A6B0A5]">
              Three simple steps replacing beauty trial-and-error with private, preference-based matching. Suggestions, not medical advice.
            </p>
          </div>

          {/* 3 Mobile Step Cards */}
          <div className="space-y-8">
            {steps.map((st, idx) => {
              const imageSrc =
                idx === 0
                  ? '/images/mood/step-01-daylight-scan.webp'
                  : idx === 1
                  ? '/images/mood/step-02-dropper-rules.webp'
                  : '/images/mood/step-03-routine-picks.webp';

              return (
                <div
                  key={st.number}
                  className="rounded-3xl glass-card bg-white/85 dark:bg-[#222B25]/85 border border-[#DCDACD] dark:border-white/10 p-6 shadow-soft-luxury space-y-4"
                >
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-inner">
                    <Image
                      src={imageSrc}
                      alt={st.title}
                      fill
                      quality={85}
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#213A30] text-white text-xs font-serif font-bold shadow-md">
                      Step {st.number}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86A4B] block mb-1">
                      {st.tag}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#213A30] dark:text-[#F7F6F0]">
                      {st.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#846A4F] dark:text-[#C7A77A] mb-2">
                      {st.subtitle}
                    </p>
                    <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                      {st.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/scan"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold text-[#F7F6F0] bg-[#213A30] hover:bg-[#14271F] shadow-sm transition-colors"
                    >
                      <span>Start with Step {st.number}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
