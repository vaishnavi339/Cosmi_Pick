'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  EyeOff,
  ServerOff,
  Cpu,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function PrivacyPage() {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Return to Home link at top */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#3B1F2B] dark:text-[#F4D9D6] hover:text-[#2B141F] dark:hover:text-[#FAF3F0] hover:-translate-x-0.5 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 text-[#CE7F79] group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9D6C3] bg-[#C9D6C3]/30 dark:bg-white/5 text-[#44633B] dark:text-[#C9D6C3] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#8CA583]" />
          <span>100% On-Device Privacy Commitment</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
          Your scan stays on your device.
        </h1>
        <p className="text-[#7E636E] dark:text-[#B59FA9] text-base sm:text-lg leading-relaxed max-w-2xl">
          We designed CosmicPick so you never have to choose between finding your ideal skincare and protecting your privacy. No photos are saved, no videos are uploaded, and no face data ever leaves your browser.
        </p>
      </div>

      {/* Core Benefit Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#20151C]/80 border border-[#E8D3C0] dark:border-white/10 space-y-3 shadow-soft-luxury">
          <div className="w-10 h-10 rounded-2xl bg-[#8CA583]/20 text-[#44633B] dark:text-[#C9D6C3] flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0]">
            No Photo Stored
          </h3>
          <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            Your camera feed exists only in temporary device memory. The moment your scan is complete, every frame is completely wiped.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#20151C]/80 border border-[#E8D3C0] dark:border-white/10 space-y-3 shadow-soft-luxury">
          <div className="w-10 h-10 rounded-2xl bg-[#CE7F79]/20 text-[#CE7F79] flex items-center justify-center">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0]">
            Zero Cloud Upload
          </h3>
          <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            All facial trait analysis runs locally on your machine. We never transmit video streams or facial biometrics to any remote server.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#20151C]/80 border border-[#E8D3C0] dark:border-white/10 space-y-3 shadow-soft-luxury">
          <div className="w-10 h-10 rounded-2xl bg-[#D9B99B]/25 text-[#856453] dark:text-[#D9B99B] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0]">
            Instant Disconnect
          </h3>
          <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            Your webcam is automatically powered down the instant trait coordinates are registered. You retain complete agency at every step.
          </p>
        </div>
      </div>

      {/* Expandable "For the curious" technical details */}
      <div className="rounded-3xl border border-[#E8D3C0] dark:border-white/10 bg-[#FAF5F0]/80 dark:bg-white/[0.02] overflow-hidden shadow-soft-luxury">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-[#F4D9D6]/20 transition-colors"
          aria-expanded={showTechnical}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CE7F79]">
              <FileCode2 className="w-4 h-4" />
              <span>Deep Dive Architecture</span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1F2B] dark:text-[#FAF3F0]">
              For the curious: technical specifications & data flow
            </h2>
            <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9]">
              Click to view how our WebAssembly sandbox and off-screen canvas process scans with zero cloud exposure.
            </p>
          </div>
          <div className="p-2 rounded-full border border-[#E8D3C0] dark:border-white/10 bg-white dark:bg-white/5 text-[#3B1F2B] dark:text-[#FAF3F0] ml-4 flex-shrink-0">
            {showTechnical ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showTechnical && (
          <div className="px-6 pb-8 sm:px-8 space-y-6 border-t border-[#E8D3C0]/60 dark:border-white/10 pt-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
                  <Cpu className="w-4 h-4 text-[#8CA583]" />
                  <span>Client-Side WebAssembly</span>
                </div>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  The Google MediaPipe Face Landmarker model runs locally via WebAssembly compiled binaries cached inside your browser. No external inference API calls are ever initiated.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
                  <EyeOff className="w-4 h-4 text-[#CE7F79]" />
                  <span>478 Landmark Coordinates</span>
                </div>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  The detector computes 478 dimensionless 3D mathematical vectors. Only calculated geometric ratios (jaw curve, cheekbone width) and surface reflection values are retained.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
                  <Lock className="w-4 h-4 text-[#D9B99B]" />
                  <span>HTML5 Canvas Memory Purge</span>
                </div>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  Frames are sampled onto an off-screen HTML5 <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-[#FAF5F0] dark:bg-white/10">&lt;canvas&gt;</code> element in volatile RAM. Frame contexts are explicitly cleared and unreferenced every tick.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
                  <ServerOff className="w-4 h-4 text-[#8CA583]" />
                  <span>Hardware Track Termination</span>
                </div>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  Upon completion or cancellation, <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-[#FAF5F0] dark:bg-white/10">MediaStreamTrack.stop()</code> is invoked immediately to release device camera hardware indicator lights.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
                Data Payload Passed to Scoring
              </h4>
              <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                When you click &ldquo;View My Recommendations&rdquo;, only anonymous text descriptors (e.g., <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-[#FAF5F0] dark:bg-white/10">{`{ faceShape: 'Oval', skinTone: 'Warm Peach', concerns: ['breakouts'] }`}</code>) and your user-stated constraints are sent to the local deterministic scoring matrix. No biometric templates or images exist to be shared.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-6 rounded-3xl border border-[#E8D3C0] bg-[#FAF5F0] dark:bg-white/[0.02] text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#CE7F79]" />
        <div className="space-y-1">
          <strong className="block font-semibold text-[#3B1F2B] dark:text-[#FAF3F0]">
            Cosmetic & Routine Advisory
          </strong>
          <p className="leading-relaxed">
            CosmicPick provides algorithmic cosmetic product matching based on optical traits and ingredient compatibility. CosmicPick is not a medical diagnostic tool and does not treat, cure, or diagnose clinical skin diseases. For medical concerns, always consult a board-certified dermatologist.
          </p>
        </div>
      </div>

      {/* Bottom CTA & Return Link */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] border-2 border-[#3B1F2B] dark:border-[#F4D9D6] hover:bg-[#3B1F2B]/5 dark:hover:bg-[#F4D9D6]/10 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>

        <Link
          id="privacy-start-scan-btn"
          href="/scan"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_10px_25px_-5px_rgba(59,31,43,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(59,31,43,0.45)] hover:-translate-y-0.5 transition-all text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start a Free, Private Scan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
