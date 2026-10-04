'use client';

import React from 'react';
import { Camera, Sliders, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Face Scan in Daylight',
      subtitle: '10 seconds in front of your camera',
      description:
        'Optical algorithms analyze your face contour, undertone, surface shine, and hydration levels directly on your device. Zero photos are stored or sent anywhere.',
      icon: Camera,
      tag: '100% On-Device',
    },
    {
      num: '02',
      title: 'Share Your Skincare Rules',
      subtitle: 'Plain words or quick toggles',
      description:
        'Tell us what you want to fix—breakouts, redness, dark circles—plus your maximum budget and any ingredients you choose to avoid (like fragrance or essential oils).',
      icon: Sliders,
      tag: 'Custom Constraints',
    },
    {
      num: '03',
      title: 'Meet Your Daily Routine',
      subtitle: 'Clear reasons, zero guesswork',
      description:
        'Get precision-ranked cleansers, serums, and barrier creams calibrated for your face, complete with active ingredient breakdowns and AM/PM routine order.',
      icon: Sparkles,
      tag: 'AM / PM Steps',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4E2D2]/40 dark:bg-white/5 border border-[#D4E2D2] dark:border-white/10 text-xs font-bold text-[#405C45] dark:text-[#D4E2D2] uppercase tracking-wider">
            <span>The Science of Precision Care</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight">
            How CosmicPick finds what works
          </h2>
          <p className="text-sm sm:text-base text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
            Three simple steps to replace trial-and-error beauty shopping with clinical, personalized matching.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-3xl glass-card bg-white/70 dark:bg-[#222B25]/75 border border-[#DCDACD] dark:border-white/10 p-8 shadow-soft-luxury hover:shadow-luxury-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Ambient Soft Corner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E2EADD]/40 via-transparent to-transparent rounded-full pointer-events-none" />

                <div>
                  {/* Step Number & Category Tag */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-[#C7A77A] dark:text-[#B86A4B]/80">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F7F6F0] dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] border border-[#DCDACD]/60 dark:border-white/10">
                      {step.tag}
                    </span>
                  </div>

                  {/* Real Photo / Visual Slot */}
                  <div className="w-full aspect-[16/10] rounded-2xl bg-gradient-to-b from-[#E2EADD]/20 via-[#F7F6F0] to-[#F7F6F0] dark:from-white/[0.04] dark:to-transparent border border-[#DCDACD]/50 dark:border-white/10 flex items-center justify-center p-4 mb-6 shadow-inner">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-[#DCDACD]/70 dark:border-white/10 flex items-center justify-center text-[#213A30] dark:text-[#E2EADD] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#213A30] dark:text-[#F7F6F0] mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#B86A4B] dark:text-[#C7A77A] block mb-3">
                    {step.subtitle}
                  </span>
                  <p className="text-xs sm:text-sm text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#DCDACD]/50 dark:border-white/5 flex items-center text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                  <span>Explore step</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action Link */}
        <div className="text-center mt-12">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#213A30] dark:text-[#E2EADD] hover:underline"
          >
            <span>Ready? Try the on-device scan now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
