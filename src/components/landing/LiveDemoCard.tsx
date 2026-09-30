'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function LiveDemoCard() {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            Live Interactive Preview
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            See Exactly What You Receive
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Every recommendation is transparent, explainable, and formulated around your facial traits.
          </p>
        </div>

        {/* Demo Recommendation Showcase */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl relative overflow-hidden group">
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Header: Brand, Title, Match Score Pill */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F4D9D6]/30 dark:bg-white/5 flex items-center justify-center flex-shrink-0 border border-[#E8D3C0] dark:border-white/10 shadow-sm">
                  <Sparkles className="w-8 h-8 text-[#CE7F79]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Minimalist
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                      Bestseller
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    Niacinamide 10% + Zinc 1% Serum
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-[11px] font-medium">Catalog score: 4.8 <span className="text-[9px] text-[#CE7F79]">(demo data)</span></span>
                    <span>•</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-medium">Fragrance-Free</span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-sm" title="Match score based on your scan and preferences">
                  <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
                  <span className="font-display font-extrabold text-sm sm:text-base">Match Score</span>
                </div>
                <div className="text-right sm:mt-2">
                  <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    ₹599
                  </span>
                  <span className="text-[10px] text-[#CE7F79] block">(demo data)</span>
                </div>
              </div>
            </div>

            {/* Why This Suits You (AI Rationale) */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 dark:bg-white/[0.03] border border-indigo-500/20 dark:border-white/10 space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Why this suits you</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Formulated with pure 10% Niacinamide and 1% Zinc PCA to actively regulate your detected T-zone sebum production and calm surface redness. Fits comfortably under your ₹1,500 budget with clean, fragrance-free certification.
              </p>
            </div>

            {/* Key Ingredient Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Actives:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                10% Niacinamide
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                1% Zinc PCA
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                Aloe Vera Extract
              </span>
            </div>

            {/* Toggle Score Breakdown */}
            <div className="pt-2 border-t border-slate-200/50 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-400 transition-colors py-2"
              >
                <span>View Mathematical Scoring Breakdown</span>
                {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showBreakdown && (
                <div className="pt-3 pb-2 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Facial Trait Match (25% weight)</span>
                    <span className="font-mono font-bold text-emerald-400">96 / 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '96%' }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Concerns Match (35% weight)</span>
                    <span className="font-mono font-bold text-cyan-400">100 / 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '100%' }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Budget Compliance (10% weight)</span>
                    <span className="font-mono font-bold text-indigo-400">100 / 100 (₹599 vs ₹1,500 max)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link
                id="demo-test-own-scan-btn"
                href="/scan"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-soft-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Picks for Your Face</span>
              </Link>
              <a
                href="https://beminimalist.co/products/niacinamide-10-zinc-1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <span>Product Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
