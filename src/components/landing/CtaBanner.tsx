import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function CtaBanner() {
  return (
    <section
      className="py-20 sm:py-24 relative isolate overflow-clip bg-[#FBF7F4] dark:bg-[#180F14] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-10 sm:p-16 lg:p-20 relative overflow-hidden border border-[#E8D3C0] dark:border-white/10 text-center space-y-6 shadow-soft-luxury">
          
          {/* Real Photography Background with Luxury Overlay (z-0, NO negative z-index) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#FBF7F4] dark:bg-[#180F14]">
            <Image
              src="/images/mood/hero-woman-applying.webp"
              alt="Woman gently applying serum to cheek"
              fill
              quality={88}
              className="object-cover object-center brightness-[0.85] dark:brightness-[0.3]"
            />
            {/* Scrim Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F4]/95 via-[#FBF7F4]/90 to-[#F4D9D6]/80 dark:from-[#180F14]/95 dark:via-[#180F14]/92 dark:to-[#3B1F2B]/85" />
            <div className="absolute inset-0 bg-[#FBF7F4]/30 dark:bg-black/30 backdrop-blur-[1px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-white/10 border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#CE7F79]" />
            <span>Ready in 10 Seconds · 100% Free</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight max-w-3xl mx-auto leading-tight">
            Stop guessing your routine. Meet formulations made for your face.
          </h2>

          <p className="text-[#5A404C] dark:text-[#E0CFD7] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Private, on-device optical matching paired with verified active ingredients. No subscriptions, zero image storage, and no sponsored bias.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="cta-start-scan-bottom-btn"
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_10px_25px_-5px_rgba(59,31,43,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(59,31,43,0.45)] hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Start your scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/scan?mode=quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-[#3B1F2B] dark:text-[#F4D9D6] border-2 border-[#3B1F2B] dark:border-[#F4D9D6] hover:bg-[#3B1F2B]/10 dark:hover:bg-[#F4D9D6]/15 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Take the quick quiz</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#7E636E] dark:text-[#B59FA9]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Runs completely in your local browser · Zero photos stored</span>
          </div>

        </div>
      </div>
    </section>
  );
}
