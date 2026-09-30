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
      className="py-20 relative isolate overflow-clip bg-[#FBF7F4] dark:bg-[#180F14] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container */}
        <div className="rounded-3xl glass-card bg-white/80 dark:bg-[#20151C]/80 border border-[#E8D3C0] dark:border-white/10 p-8 sm:p-12 shadow-soft-luxury">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Our Privacy Promise</span>
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
                Your face never leaves your device
              </h2>
              <p className="text-sm sm:text-base text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                We believe skincare should feel safe and trustworthy. We designed CosmicPick so that no photographs are ever saved, uploaded, or transmitted.
              </p>
            </div>

            {/* 3 Core Benefit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#8CA583]/20 flex items-center justify-center text-[#44633B] dark:text-[#C9D6C3]">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0]">
                  No Photo Stored
                </h3>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  Your camera feed is analyzed in volatile browser memory. The second your scan ends, video data is wiped clean.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#CE7F79]/20 flex items-center justify-center text-[#CE7F79]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0]">
                  Zero Cloud Upload
                </h3>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  The artificial vision engine runs entirely on your phone or laptop. No face images are ever sent across the web.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D9B99B]/20 flex items-center justify-center text-[#856453] dark:text-[#D9B99B]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0]">
                  Instant Disconnect
                </h3>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  Hardware access terminates the millisecond your traits are confirmed. You are always in complete control.
                </p>
              </div>
            </div>

            {/* Expandable "For the Curious" Technical Details Accordion */}
            <div className="pt-4 border-t border-[#E8D3C0]/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full py-3 px-4 rounded-2xl bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#CE7F79]" />
                  <span>For the curious: technical architecture details</span>
                </div>
                {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechnical && (
                <div className="mt-4 p-6 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0] dark:border-white/10 space-y-4 text-xs text-[#7E636E] dark:text-[#B59FA9] animate-fadeIn">
                  <div className="space-y-2">
                    <strong className="text-[#3B1F2B] dark:text-[#FAF3F0] block font-serif text-sm">
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
                    <span className="flex items-center gap-1.5 text-[#8CA583]">
                      <Check className="w-3.5 h-3.5" />
                      Client-side sandbox verified
                    </span>
                    <Link href="/privacy" className="text-[#3B1F2B] dark:text-[#F4D9D6] hover:underline">
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
