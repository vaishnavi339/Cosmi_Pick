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

  // Image Scale Transforms (subtle cinematic zoom per step)
  const img1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);
  const img2Scale = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.05]);
  const img3Scale = useTransform(scrollYProgress, [0.65, 1], [1, 1.05]);

  // Content card opacities
  const card1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.34], [1, 1, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.60, 0.68], [0, 1, 1, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.62, 0.70, 1], [0, 1, 1]);

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
        'Receive a clinically ranked AM/PM routine where every cleanser, active serum, and barrier moisturizer includes clear reasons for its score. Zero sponsored placements or fake ratings.',
      icon: Sparkles,
      pill: 'Clear Active Ingredient Rationale',
    },
  ];

  return (
    <section id="how-it-works" className="relative scroll-mt-24">
      {/* ================= DESKTOP PINNED SCROLL (lg and above) ================= */}
      <div ref={containerRef} className="hidden lg:block relative h-[300vh]">
        {/* Sticky 100vh Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-6 sm:px-10 lg:px-16">
          {/* Background Images Crossfading with Depth */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Step 1 Image */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? (activeStep === 0 ? 1 : 0) : img1Opacity,
                scale: shouldReduceMotion ? 1 : img1Scale,
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

            {/* High-legibility Ivory & Blush Glass Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F4]/95 via-[#FBF7F4]/80 to-[#F4D9D6]/30 dark:from-[#180F14]/88 dark:via-[#180F14]/65 dark:to-[#180F14]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FBF7F4] via-transparent to-[#FBF7F4]/40 dark:from-[#180F14] dark:to-[#180F14]/40" />
          </div>

          {/* Top Section Header */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B1F2B]/5 dark:bg-white/10 border border-[#3B1F2B]/15 dark:border-white/10 text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] uppercase tracking-wider">
              <span>The 3-Step Precision Story</span>
            </div>

            {/* Step Indicator Pills */}
            <div className="flex items-center gap-3">
              {steps.map((st, idx) => (
                <div
                  key={st.number}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeStep === idx
                      ? 'bg-[#3B1F2B] text-white dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-sm scale-105'
                      : 'bg-white/70 dark:bg-white/5 text-[#7E636E] dark:text-[#B59FA9] border border-[#E8D3C0]/60 dark:border-white/5'
                  }`}
                >
                  <span className="font-serif">{st.number}</span>
                  <span className="hidden sm:inline">{st.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Interactive Stage */}
          <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-12 gap-12 items-center z-10">
            {/* Left Narrative Column (Text & Step Details) */}
            <div className="col-span-6 space-y-6">
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
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4D9D6]/80 dark:bg-[#3B1F2B]/80 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#3B1F2B] dark:text-[#F4D9D6] mb-4">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{step.pill}</span>
                      </div>

                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="font-serif text-5xl font-bold text-[#CE7F79] dark:text-[#D9B99B]">
                          {step.number}
                        </span>
                        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
                          {step.title}
                        </h2>
                      </div>

                      <p className="text-sm font-semibold text-[#856453] dark:text-[#D9B99B] mb-4">
                        {step.subtitle}
                      </p>

                      <p className="text-base text-[#5A404C] dark:text-[#E0CFD7] leading-relaxed max-w-lg mb-8">
                        {step.description}
                      </p>

                      <Link
                        href="/scan"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_4px_16px_rgba(59,31,43,0.25)] hover:shadow-[0_8px_24px_rgba(59,31,43,0.35)] hover:-translate-y-0.5 transition-all"
                      >
                        <span>Experience Step {step.number}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E8D3C0]/40 dark:bg-white/10 h-1.5 rounded-full overflow-hidden max-w-md">
                <motion.div
                  className="bg-[#3B1F2B] dark:bg-[#F4D9D6] h-full"
                  style={{
                    width: shouldReduceMotion
                      ? `${((activeStep + 1) / 3) * 100}%`
                      : progressWidth,
                  }}
                />
              </div>
            </div>

            {/* Right Column: Dynamic Mock UI Stage */}
            <div className="col-span-6 relative flex items-center justify-center">
              {/* Glass Frame Container */}
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl glass-card bg-white/85 dark:bg-[#1C1218]/90 border border-white/80 dark:border-white/15 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                
                {/* Step 1 Mock UI: Optical Camera & Face Landmarker Radar */}
                <motion.div
                  style={{
                    opacity: shouldReduceMotion ? (activeStep === 0 ? 1 : 0) : card1Opacity,
                    y: shouldReduceMotion ? 0 : card1Y,
                  }}
                  className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity ${
                    activeStep === 0 ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8D3C0]/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                        On-Device Optical Vision
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#CE7F79] font-bold">
                      478 Landmark Nodes Locked
                    </span>
                  </div>

                  {/* Simulated Face Oval with Scanning Laser */}
                  <div className="relative my-auto w-40 h-52 mx-auto rounded-[50%] border-2 border-dashed border-[#CE7F79]/60 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F4D9D6]/20 via-transparent to-[#F4D9D6]/30" />
                    {/* Scanning radar line */}
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#3B1F2B] dark:via-[#F4D9D6] to-transparent animate-bounce opacity-80" />
                    <div className="text-center space-y-1 z-10">
                      <Camera className="w-6 h-6 text-[#3B1F2B] dark:text-[#FAF3F0] mx-auto opacity-70" />
                      <span className="text-[10px] font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] block">
                        Align Face
                      </span>
                    </div>
                  </div>

                  {/* Real-time telemetry badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8D3C0]/50 dark:border-white/10">
                    <div className="p-2 rounded-xl bg-[#FBF7F4] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#7E636E] dark:text-[#B59FA9] block">Undertone</span>
                      <strong className="text-xs text-[#3B1F2B] dark:text-[#FAF3F0]">Warm Peach</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FBF7F4] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#7E636E] dark:text-[#B59FA9] block">Hydration</span>
                      <strong className="text-xs text-[#3B1F2B] dark:text-[#FAF3F0]">Balanced</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FBF7F4] dark:bg-white/5 text-center">
                      <span className="text-[9px] text-[#7E636E] dark:text-[#B59FA9] block">Privacy</span>
                      <strong className="text-xs text-[#44633B] dark:text-[#C9D6C3] flex items-center justify-center gap-1">
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
                  }}
                  className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity ${
                    activeStep === 1 ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8D3C0]/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#CE7F79]" />
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                        Custom Rule Constraints
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8CA583]/20 text-[#44633B] dark:text-[#C9D6C3] font-bold">
                      Strict Mode Active
                    </span>
                  </div>

                  <div className="space-y-3.5 my-auto">
                    {/* Primary Goal */}
                    <div className="p-3 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#7E636E] dark:text-[#B59FA9]">Focus Concern:</span>
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-[#E8D3C0]/50 dark:border-white/10">
                        Barrier Repair & Redness
                      </span>
                    </div>

                    {/* Excluded Ingredients */}
                    <div className="p-3 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 space-y-2">
                      <span className="text-[11px] font-bold text-[#CE7F79] block">
                        Strictly Avoid:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#CE7F79]/15 text-[#3B1F2B] dark:text-[#F4D9D6] text-[10px] font-semibold">
                          ✕ Synthetic Fragrance
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#CE7F79]/15 text-[#3B1F2B] dark:text-[#F4D9D6] text-[10px] font-semibold">
                          ✕ Essential Oils
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#CE7F79]/15 text-[#3B1F2B] dark:text-[#F4D9D6] text-[10px] font-semibold">
                          ✕ Drying Alcohols
                        </span>
                      </div>
                    </div>

                    {/* Price Tier */}
                    <div className="p-3 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#7E636E] dark:text-[#B59FA9]">Budget Range:</span>
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                        ₹500 — ₹1,500 / item
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-2 text-[11px] text-[#7E636E] dark:text-[#B59FA9]">
                    Every recommendation is mathematically filtered against these rules.
                  </div>
                </motion.div>

                {/* Step 3 Mock UI: Verified Routine Picks */}
                <motion.div
                  style={{
                    opacity: shouldReduceMotion ? (activeStep === 2 ? 1 : 0) : card3Opacity,
                    y: shouldReduceMotion ? 0 : card3Y,
                  }}
                  className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity ${
                    activeStep === 2 ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8D3C0]/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#CE7F79]" />
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                        Top Routine Recommendation
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3B1F2B] text-white text-[10px] font-bold">
                      <span>98% Fit</span>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="my-auto p-4 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/70 dark:border-white/10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#7E636E] dark:text-[#B59FA9]">
                          Step 2 · Active Serum (AM & PM)
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0]">
                          Ceramides 0.3% + Madecassoside
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                        ₹599
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#5A404C] dark:text-[#E0CFD7]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Restores compromised barrier lipids</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Zero fragrance, non-comedogenic texture</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8D3C0]/50 dark:border-white/5 text-[10px] text-[#7E636E] dark:text-[#B59FA9]">
                      <span>Key Actives: Pure Ceramide NP + Centella</span>
                      <span className="font-bold text-[#CE7F79]">Optimal for Warm Peach</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#7E636E] dark:text-[#B59FA9]">Full 3-step routine ready</span>
                    <span className="font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                      Cleanser · Serum · SPF
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Bottom subtle scroll helper cue */}
          <div className="max-w-7xl mx-auto w-full text-center text-xs text-[#7E636E] dark:text-[#B59FA9] z-10">
            <span>Scroll downward to progress through the optical story</span>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET VIEW (< lg) ================= */}
      <div className="block lg:hidden py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4D9D6]/60 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#CE7F79] dark:text-[#FAF3F0] uppercase tracking-wider">
              <span>The 3-Step Precision Story</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
              How CosmicPick works
            </h2>
            <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9]">
              Three simple steps replacing beauty trial-and-error with clinical, private matching.
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
                  className="rounded-3xl glass-card bg-white/85 dark:bg-[#20151C]/85 border border-[#E8D3C0] dark:border-white/10 p-6 shadow-soft-luxury space-y-4"
                >
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-inner">
                    <Image
                      src={imageSrc}
                      alt={st.title}
                      fill
                      quality={85}
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#3B1F2B] text-white text-xs font-serif font-bold shadow-md">
                      Step {st.number}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE7F79] block mb-1">
                      {st.tag}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                      {st.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#856453] dark:text-[#D9B99B] mb-2">
                      {st.subtitle}
                    </p>
                    <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                      {st.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/scan"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-sm transition-colors"
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
