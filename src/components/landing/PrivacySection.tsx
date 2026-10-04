'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  EyeOff,
  Cpu,
  Lock,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export function PrivacySection() {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <section
      className="py-20 relative isolate overflow-clip bg-[#F7F6F0] dark:bg-[#17201B] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container */}
        <div className="rounded-3xl glass-card bg-white/80 dark:bg-[#222B25]/80 border border-[#DCDACD] dark:border-white/10 p-8 sm:p-12 shadow-soft-luxury">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4E2D2]/40 text-[#405C45] dark:text-[#D4E2D2] border border-[#D4E2D2] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Our Privacy Promise</span>
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight">
                Your face never leaves your device
              </h2>
              <p className="text-sm sm:text-base text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                We believe skincare should feel safe and trustworthy. We designed CosmicPick so that no photographs are ever saved, uploaded, or transmitted.
              </p>
            </div>

            {/* 3 Core Benefit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#71896C]/20 flex items-center justify-center text-[#405C45] dark:text-[#D4E2D2]">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#213A30] dark:text-[#F7F6F0]">
                  No Photo Stored
                </h3>
                <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                  Your camera feed is analyzed in volatile browser memory. The second your scan ends, video data is wiped clean.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#B86A4B]/20 flex items-center justify-center text-[#B86A4B]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#213A30] dark:text-[#F7F6F0]">
                  Zero Cloud Upload
                </h3>
                <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                  The artificial vision engine runs entirely on your phone or laptop. No face images are ever sent across the web.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#C7A77A]/20 flex items-center justify-center text-[#846A4F] dark:text-[#C7A77A]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#213A30] dark:text-[#F7F6F0]">
                  Instant Disconnect
                </h3>
                <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                  Hardware access terminates the millisecond your traits are confirmed. You are always in complete control.
                </p>
              </div>
            </div>

            {/* Expandable "For the Curious" Technical Details Accordion */}
            <div className="pt-4 border-t border-[#DCDACD]/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full py-3 px-4 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD]/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#213A30] dark:text-[#F7F6F0] hover:bg-[#E2EADD]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#B86A4B]" />
                  <span>For the curious: technical architecture details</span>
                </div>
                {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechnical && (
                <div className="mt-4 p-6 rounded-2xl bg-white dark:bg-[#17201B] border border-[#DCDACD] dark:border-white/10 space-y-4 text-xs text-[#68766C] dark:text-[#A6B0A5] animate-fadeIn">
                  <div className="space-y-2">
                    <strong className="text-[#213A30] dark:text-[#F7F6F0] block font-serif text-sm">
                      How Optical Analysis Works Without Servers:
                    </strong>
                    <p className="leading-relaxed">
                      1. <strong>Local Model Execution:</strong> CosmicPick downloads Google’s MediaPipe Face Landmarker WebAssembly binary once into your local browser cache.
                    </p>
                    <p className="leading-relaxed">
                      2. <strong>Vector Coordinates Only:</strong> The model extracts 478 numerical landmark points (e.g. cheekbone width, jawline angle). Only these mathematical ratios are evaluated—never pixel images.
                    </p>
                    <p className="leading-relaxed">
                      3. <strong>Immediate Garbage Collection:</strong> Video frame canvases are discarded from JavaScript memory at 60fps.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5 text-[#71896C]">
                      <Check className="w-3.5 h-3.5" />
                      Client-side sandbox verified
                    </span>
                    <Link href="/privacy" className="text-[#213A30] dark:text-[#E2EADD] hover:underline">
                      Read full Privacy Whitepaper &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
