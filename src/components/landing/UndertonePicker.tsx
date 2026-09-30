'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, Sun, Shield, ArrowRight } from 'lucide-react';

interface UndertoneInfo {
  id: string;
  name: string;
  veinCheck: string;
  sunResponse: string;
  jewelryClue: string;
  recommendedActives: string[];
  swatches: string[];
  description: string;
  sampleProduct: {
    brand: string;
    name: string;
    category: string;
    priceINR: number;
    matchScore: number;
    rationale: string;
    actives: string;
  };
}

export function UndertonePicker() {
  const undertones: UndertoneInfo[] = [
    {
      id: 'warm',
      name: 'Warm (Golden & Peach)',
      veinCheck: 'Veins appear greenish or olive on inner wrist',
      sunResponse: 'Tans easily with minimal immediate flushing',
      jewelryClue: 'Yellow gold jewelry complements your skin best',
      recommendedActives: ['Stabilized Vitamin C', 'Niacinamide', 'Ceramides', 'Mineral Zinc SPF'],
      swatches: ['#FBE2CD', '#EFC4A5', '#D29C71', '#9E6740'],
      description:
        'Warm undertones reflect golden, peachy, and honey hues. Active brightening agents like stabilized Vitamin C and barrier-restoring ceramides keep warm tones radiant and free from dullness.',
      sampleProduct: {
        brand: 'Minimalist',
        name: '10% Vitamin C + Acetyl Glucosamine',
        category: 'Antioxidant Radiance Serum',
        priceINR: 699,
        matchScore: 98,
        rationale: 'Stabilized Vitamin C brightens warm melanin pigments and neutralizes oxidative stress without barrier irritation.',
        actives: 'Ethyl Ascorbic Acid · Centella Water',
      },
    },
    {
      id: 'cool',
      name: 'Cool (Rosy & Bluish)',
      veinCheck: 'Veins appear distinctly blue or purple',
      sunResponse: 'Burns easily in direct sunlight before or without tanning',
      jewelryClue: 'Silver and white gold jewelry illuminate your skin',
      recommendedActives: ['Centella Asiatica', 'Hyaluronic Acid', 'Azelaic Acid', 'Broad Spectrum SPF 50'],
      swatches: ['#FCE7E6', '#F4CED0', '#CFA3A7', '#8E6068'],
      description:
        'Cool undertones carry subtle pink, red, or soft blue notes. Calming botanical soothers like Centella and Azelaic Acid counteract reactive redness and sensitive capillary flush.',
      sampleProduct: {
        brand: 'The Ordinary',
        name: 'Azelaic Acid Suspension 10%',
        category: 'Anti-Redness Treatment Cream',
        priceINR: 1100,
        matchScore: 97,
        rationale: 'Selectively cools visible capillary flushing and tones down erythema for a serene, porcelain-calm complexion.',
        actives: 'Pharmaceutical Azelaic Acid · Vitamin E',
      },
    },
    {
      id: 'neutral',
      name: 'Neutral (Balanced)',
      veinCheck: 'Veins look blue-green with no overwhelming tint',
      sunResponse: 'Tans gradually with occasional light sun flush',
      jewelryClue: 'Both gold and silver look equally flattering',
      recommendedActives: ['Niacinamide', 'Squalane', 'Peptides', 'Barrier Lipids'],
      swatches: ['#F7E5D8', '#E9CEBF', '#C2A391', '#856453'],
      description:
        'Neutral undertones feature an even equilibrium between warm and cool pigments. Balanced moisture barriers with plant-derived Squalane and multi-peptides thrive on this dermal canvas.',
      sampleProduct: {
        brand: 'Minimalist',
        name: 'Niacinamide 10% + Zinc 1% Serum',
        category: 'Pore & Barrier Balancer',
        priceINR: 599,
        matchScore: 99,
        rationale: 'Maintains perfect sebum equilibrium and reinforces skin elasticity across mixed warm-cool dermal planes.',
        actives: 'Pure Niacinamide B3 · Zinc PCA',
      },
    },
    {
      id: 'olive',
      name: 'Olive (Subtle Green & Ash)',
      veinCheck: 'Veins show mixed green-blue with an ashy or subtle khaki base',
      sunResponse: 'Tans very easily, prone to post-inflammatory dark marks',
      jewelryClue: 'Rose gold, bronze, and antiqued gold look exquisite',
      recommendedActives: ['Tranexamic Acid', 'Alpha Arbutin', 'Gentle BHA', 'Antioxidant Fluid'],
      swatches: ['#EDDFC9', '#D9C7A9', '#B39E7E', '#736145'],
      description:
        'Olive undertones combine greenish or grey undertones with warm or cool surface tones. Melanin-regulating actives like Tranexamic Acid and gentle exfoliants prevent hyperpigmentation.',
      sampleProduct: {
        brand: 'Minimalist',
        name: 'Tranexamic 3% + HPA Radiance Serum',
        category: 'Tone Harmonizer',
        priceINR: 649,
        matchScore: 96,
        rationale: 'Inhibits post-inflammatory pigmentation pathways that commonly affect olive skin after blemishes or sun exposure.',
        actives: 'Tranexamic Acid · Hydroxyphenoxy Propionic Acid',
      },
    },
  ];

  const [selected, setSelected] = useState<UndertoneInfo>(undertones[0]);

  return (
    <section
      id="undertone"
      className="py-20 sm:py-24 relative isolate overflow-clip scroll-mt-24 bg-[#FBF7F4] dark:bg-[#180F14] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D3C0]/40 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#CE7F79] dark:text-[#FAF3F0] uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Interactive Undertone Analysis</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
            Discover your skin undertone
          </h2>
          <p className="text-sm sm:text-base text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            Unlike surface tanning, undertones never change. Tap each undertone below to see how our optical scan matches your pigments to personalized routines in real time. Suggestions, not medical advice.
          </p>
        </div>

        {/* Swatch Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {undertones.map((ut) => {
            const isSelected = selected.id === ut.id;
            return (
              <button
                key={ut.id}
                type="button"
                onClick={() => setSelected(ut)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center gap-3 shadow-sm cursor-pointer ${
                  isSelected
                    ? 'bg-[#3B1F2B] text-white border-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-soft-luxury scale-105'
                    : 'bg-white/80 dark:bg-[#20151C]/80 border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/30'
                }`}
              >
                <div className="flex items-center -space-x-1">
                  {ut.swatches.slice(0, 3).map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>{ut.name.split(' ')[0]}</span>
                {isSelected && <Check className="w-4 h-4 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Selected Undertone Interactive Display Card */}
        <div className="max-w-5xl mx-auto rounded-3xl glass-card bg-white/85 dark:bg-[#20151C]/85 border border-[#E8D3C0] dark:border-white/10 p-8 sm:p-10 shadow-soft-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Swatches Spectrum & Visual Cues */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] block">
                Chromatic Spectrum Swatches
              </span>
              <div className="grid grid-cols-4 gap-2">
                {selected.swatches.map((color, idx) => (
                  <div key={idx} className="space-y-1.5 text-center">
                    <div
                      className="w-full aspect-square rounded-2xl border border-black/10 shadow-sm transition-transform duration-300 hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-mono text-[#7E636E] dark:text-[#B59FA9]">
                      {color}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/60 dark:border-white/10 space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <Sun className="w-4 h-4 text-[#CE7F79] flex-shrink-0 mt-0.5" />
                  <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-medium leading-snug">
                    <strong>Sun Response:</strong> {selected.sunResponse}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#8CA583] flex-shrink-0 mt-0.5" />
                  <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-medium leading-snug">
                    <strong>Vein Cue:</strong> {selected.veinCheck}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Undertone Description & Actives */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#3B1F2B] dark:text-[#FAF3F0] mb-2">
                  {selected.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Jewelry Clue */}
              <div className="p-3 rounded-2xl bg-[#F4D9D6]/30 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs text-[#3B1F2B] dark:text-[#FAF3F0] font-medium">
                ✨ <strong>Quick Test:</strong> {selected.jewelryClue}.
              </div>

              {/* Recommended Actives */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CE7F79]" />
                  Ideal Actives For This Undertone:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.recommendedActives.map((act) => (
                    <span
                      key={act}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/10 border border-[#E8D3C0] dark:border-white/10 text-[11px] font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Updating Sample Recommendation Card */}
            <div className="lg:col-span-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CE7F79] dark:text-[#D9B99B] block mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Matched Formulation:
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl p-5 bg-gradient-to-b from-[#FBF7F4] to-[#F4D9D6]/25 dark:from-white/10 dark:to-white/5 border border-[#E8D3C0] dark:border-white/10 shadow-sm space-y-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] block">
                        {selected.sampleProduct.brand}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0] leading-snug">
                        {selected.sampleProduct.name}
                      </h4>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-[#3B1F2B] text-white text-[10px] font-bold flex-shrink-0 shadow-sm">
                      Match Score: {selected.sampleProduct.matchScore}
                    </div>
                  </div>

                  <p className="text-xs text-[#5A404C] dark:text-[#E0CFD7] leading-relaxed">
                    {selected.sampleProduct.rationale}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-[#E8D3C0]/50 dark:border-white/5 text-[11px] text-[#7E636E] dark:text-[#B59FA9]">
                    <strong className="text-[#3B1F2B] dark:text-[#FAF3F0]">Key Actives:</strong>{' '}
                    {selected.sampleProduct.actives}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E8D3C0]/50 dark:border-white/5">
                    <span className="font-bold text-sm text-[#3B1F2B] dark:text-[#FAF3F0]">
                      ₹{selected.sampleProduct.priceINR}
                    </span>

                    <Link
                      href="/scan"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-sm transition-all"
                    >
                      <span>Match your face</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
