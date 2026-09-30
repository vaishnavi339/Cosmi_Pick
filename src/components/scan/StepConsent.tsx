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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="rounded-3xl glass-card p-6 sm:p-10 border border-[#E8D3C0] dark:border-white/10 shadow-soft-luxury space-y-6 bg-white/90 dark:bg-[#20151C]/90">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-[#F4D9D6] dark:bg-white/10 flex items-center justify-center text-[#CE7F79] shadow-sm">
          <Camera className="w-7 h-7 text-[#CE7F79]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9]">
            <Sparkles className="w-3 h-3 text-[#CE7F79]" />
            <span>Step 1 of 5 • Your Privacy</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1F2B] dark:text-[#FAF3F0]">
            Camera Access & Privacy Promise
          </h2>
          <p className="text-[#7E636E] dark:text-[#B59FA9] text-sm sm:text-base leading-relaxed">
            CosmicPick analyzes your face directly inside your browser to understand your skin tone, undertone, and visible needs. Nothing is ever sent to a server.
          </p>
        </div>

        {/* 3 Privacy Guarantees */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#C9D6C3]/20 border border-[#C9D6C3]/50 text-xs sm:text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
            <ShieldCheck className="w-5 h-5 text-[#8CA583] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#44633B] dark:text-[#C9D6C3] block mb-0.5 font-bold">100% on your device</strong>
              The scan runs entirely inside your browser. No video frames or face readings ever travel across the internet.
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F4D9D6]/30 border border-[#E8D3C0] text-xs sm:text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
            <EyeOff className="w-5 h-5 text-[#CE7F79] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#CE7F79] dark:text-[#F4D9D6] block mb-0.5 font-bold">No photos saved</strong>
              We never save, record, or store photos or personal data. The stream is evaluated live and instantly discarded.
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs sm:text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
            <Lock className="w-5 h-5 text-[#D9B99B] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#3B1F2B] dark:text-[#FAF3F0] block mb-0.5 font-bold">Turns off immediately</strong>
              As soon as your scan completes—or if you close the tab—your camera hardware turns off automatically.
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-4 border-t border-[#E8D3C0]/60 dark:border-white/10 space-y-3">
          <label className="flex items-start gap-3.5 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded-md border-2 border-[#E8D3C0] dark:border-white/20 bg-[#FAF5F0] dark:bg-[#180F14] checked:bg-[#3B1F2B] checked:border-[#3B1F2B] focus:ring-2 focus:ring-[#CE7F79] cursor-pointer transition-all"
              />
            </div>
            <span className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] group-hover:text-[#3B1F2B] dark:group-hover:text-[#FAF3F0] transition-colors leading-relaxed">
              I agree to let CosmicPick access my camera to analyze my skin profile. I understand that no photos are ever saved or uploaded, and recommendations are cosmetic advice only.
            </span>
          </label>

          <div className="text-xs text-[#7E636E] dark:text-[#B59FA9] pl-8.5">
            Read our complete{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-[#CE7F79] underline font-medium hover:text-[#3B1F2B]"
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
                ? 'bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] dark:hover:bg-[#E9BDB9] shadow-soft-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#E8D3C0] dark:bg-white/10 text-white/70 cursor-not-allowed'
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
