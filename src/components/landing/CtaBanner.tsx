import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function CtaBanner() {
  return (
    <section
      className="py-20 sm:py-24 relative isolate overflow-clip bg-[#F7F6F0] dark:bg-[#17201B] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-10 sm:p-16 lg:p-20 relative overflow-hidden border border-[#DCDACD] dark:border-white/10 text-center space-y-6 shadow-soft-luxury">
          
          {/* Real Photography Background with Luxury Overlay (z-0, NO negative z-index) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F7F6F0] dark:bg-[#17201B]">
            <Image
              src="/images/mood/hero-woman-applying.webp"
              alt="Woman gently applying serum to cheek"
              fill
              quality={88}
              className="object-cover object-center brightness-[0.85] dark:brightness-[0.3]"
            />
            {/* Scrim Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F0]/95 via-[#F7F6F0]/90 to-[#E2EADD]/80 dark:from-[#17201B]/95 dark:via-[#17201B]/92 dark:to-[#213A30]/85" />
            <div className="absolute inset-0 bg-[#F7F6F0]/30 dark:bg-black/30 backdrop-blur-[1px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-white/10 border border-[#DCDACD] dark:border-white/10 text-[#213A30] dark:text-[#F7F6F0] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B86A4B]" />
            <span>Ready in 10 Seconds · 100% Free</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight max-w-3xl mx-auto leading-tight">
            Stop guessing your routine. Meet formulations made for your face.
          </h2>

          <p className="text-[#4B5A4F] dark:text-[#E0CFD7] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Private, on-device optical matching paired with verified active ingredients. No subscriptions, zero image storage, and no sponsored bias.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="cta-start-scan-bottom-btn"
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-[#F7F6F0] bg-[#213A30] hover:bg-[#14271F] shadow-[0_10px_25px_-5px_rgba(59,31,43,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(59,31,43,0.45)] hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Start your scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#ritual-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-[#213A30] dark:text-[#E2EADD] border-2 border-[#213A30] dark:border-[#E2EADD] hover:bg-[#213A30]/10 dark:hover:bg-[#E2EADD]/15 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Explore by concern</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#68766C] dark:text-[#A6B0A5]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Runs completely in your local browser · Zero photos stored</span>
          </div>

        </div>
      </div>
    </section>
  );
}
