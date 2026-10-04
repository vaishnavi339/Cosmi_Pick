'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, ArrowRight, Camera, Sparkles } from 'lucide-react';

interface Props {
  onConsentGiven: () => void;
}

export function StepConsent({ onConsentGiven }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 sm:py-7">
      <div className="rounded-[1.75rem] glass-card p-5 sm:p-9 border border-[#DCDACD] dark:border-white/10 shadow-[0_24px_75px_-45px_rgba(33,58,48,.38)] space-y-6 bg-white/95 dark:bg-[#222B25]/95">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-[#E2EADD] dark:bg-white/10 flex items-center justify-center text-[#B86A4B] shadow-sm">
          <Camera className="w-7 h-7 text-[#B86A4B]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5]">
            <Sparkles className="w-3 h-3 text-[#B86A4B]" />
            <span>Step 1 of 5 • Your Privacy</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl tracking-tight text-[#213A30] dark:text-[#F7F6F0]">
            A private scan, by design.
          </h2>
          <p className="text-[#68766C] dark:text-[#A6B0A5] text-sm sm:text-base leading-relaxed">
            CosmicPick analyzes your face directly inside your browser to understand your skin tone, undertone, and visible needs. Nothing is ever sent to a server.
          </p>
        </div>

        {/* 3 Privacy Guarantees */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#D4E2D2]/20 border border-[#D4E2D2]/50 text-xs sm:text-sm text-[#213A30] dark:text-[#F7F6F0]">
            <ShieldCheck className="w-5 h-5 text-[#71896C] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#405C45] dark:text-[#D4E2D2] block mb-0.5 font-bold">100% on your device</strong>
              The scan runs entirely inside your browser. No video frames or face readings ever travel across the internet.
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#E2EADD]/30 border border-[#DCDACD] text-xs sm:text-sm text-[#213A30] dark:text-[#F7F6F0]">
            <EyeOff className="w-5 h-5 text-[#B86A4B] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#B86A4B] dark:text-[#E2EADD] block mb-0.5 font-bold">No photos saved</strong>
              We never save, record, or store photos or personal data. The stream is evaluated live and instantly discarded.
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs sm:text-sm text-[#213A30] dark:text-[#F7F6F0]">
            <Lock className="w-5 h-5 text-[#C7A77A] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#213A30] dark:text-[#F7F6F0] block mb-0.5 font-bold">Turns off immediately</strong>
              As soon as your scan completes—or if you close the tab—your camera hardware turns off automatically.
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-4 border-t border-[#DCDACD]/60 dark:border-white/10 space-y-3">
          <label className="flex items-start gap-3.5 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded-md border-2 border-[#DCDACD] dark:border-white/20 bg-[#F7F6F0] dark:bg-[#17201B] checked:bg-[#213A30] checked:border-[#213A30] focus:ring-2 focus:ring-[#B86A4B] cursor-pointer transition-all"
              />
            </div>
            <span className="text-xs sm:text-sm text-[#68766C] dark:text-[#A6B0A5] group-hover:text-[#213A30] dark:group-hover:text-[#F7F6F0] transition-colors leading-relaxed">
              I agree to let CosmicPick access my camera to analyze my skin profile. I understand that no photos are ever saved or uploaded, and recommendations are cosmetic advice only.
            </span>
          </label>

          <div className="text-xs text-[#68766C] dark:text-[#A6B0A5] pl-8.5">
            Read our complete{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-[#B86A4B] underline font-medium hover:text-[#213A30]"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-2">
          <button
            id="consent-continue-btn"
            type="button"
            disabled={!agreed}
            onClick={onConsentGiven}
            className={`w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 text-base transition-all duration-200 ${
              agreed
                ? 'bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] shadow-soft-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#DCDACD] dark:bg-white/10 text-white/70 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Camera Scan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
