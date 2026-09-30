'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, X, Info } from 'lucide-react';

interface ActiveIngredient {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  bestFor: string;
  timeOfDay: 'AM & PM' | 'AM only' | 'PM only';
  plainLanguage: string;
  safetyNote: string;
  badgeColor: string;
}

export function IngredientMarquee() {
  const ingredients: ActiveIngredient[] = [
    {
      id: 'niacinamide',
      name: 'Niacinamide (Vitamin B3)',
      shortName: 'Niacinamide 5%',
      tagline: 'The universal skin balancer',
      category: 'Oil & Pore Regulator',
      bestFor: 'T-zone shine, enlarged pores, redness & post-blemish marks',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A gentle, non-irritating vitamin that tells overactive oil glands to slow down. It also helps build keratin to keep your skin surface firm, even-toned, and resilient.',
      safetyNote: 'Well tolerated by virtually all skin types, including sensitive skin.',
      badgeColor: 'bg-[#F4D9D6]/80 text-[#3B1F2B]',
    },
    {
      id: 'ceramides',
      name: 'Ceramides (1, 3, 6-II)',
      shortName: 'Ceramides NP',
      tagline: 'The skin barrier mortar',
      category: 'Barrier Repair',
      bestFor: 'Dryness, flaking, tight-feeling skin, barrier irritation',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'Think of skin cells as bricks and ceramides as the cement holding them together. Ceramides prevent moisture from evaporating into the air and keep irritants out.',
      safetyNote: 'Naturally found in healthy skin. Zero risk of irritation.',
      badgeColor: 'bg-[#C9D6C3]/80 text-[#44633B]',
    },
    {
      id: 'hyaluronic',
      name: 'Hyaluronic Acid Multi-Weight',
      shortName: 'Hyaluronic Acid',
      tagline: 'The moisture magnet',
      category: 'Deep Hydration',
      bestFor: 'Dehydration, dullness, fine surface lines, tired morning skin',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A sugar molecule naturally occurring in tissue that holds up to 1,000 times its weight in water. Applied to slightly damp skin, it instantly plumps surface layers for a dewy, bouncy glow.',
      safetyNote: 'Apply on damp skin followed by a moisturizer to lock it in.',
      badgeColor: 'bg-[#E8D3C0]/80 text-[#856453]',
    },
    {
      id: 'centella',
      name: 'Centella Asiatica (Cica)',
      shortName: 'Cica Extract',
      tagline: 'The botanical redness calmer',
      category: 'Soothing Botanical',
      bestFor: 'Flushed skin, irritation, burning sensations, reactive barrier',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A traditional medicinal herb rich in madecassoside. It calms burning sensations, accelerates natural skin recovery, and cools down facial flushing.',
      safetyNote: 'Extremely gentle; ideal after sun exposure or active exfoliation.',
      badgeColor: 'bg-[#C9D6C3]/80 text-[#44633B]',
    },
    {
      id: 'salicylic',
      name: 'Salicylic Acid (BHA 2%)',
      shortName: 'Salicylic Acid 2%',
      tagline: 'The deep pore unclogger',
      category: 'Gentle Exfoliant',
      bestFor: 'Blackheads, whiteheads, bumpy texture, congested T-zones',
      timeOfDay: 'PM only',
      plainLanguage:
        'Unlike water-soluble acids, Salicylic Acid dissolves in oil. It travels directly into deep pores to dissolve accumulated dead skin and hardened sebum plugs.',
      safetyNote: 'Start 2–3 nights a week. Always pair with daytime sunscreen.',
      badgeColor: 'bg-[#F4D9D6]/80 text-[#3B1F2B]',
    },
    {
      id: 'vitaminc',
      name: 'Stabilized Vitamin C (10%)',
      shortName: 'Vitamin C 10%',
      tagline: 'The daytime glow antioxidant',
      category: 'Antioxidant & Brightener',
      bestFor: 'Sun spots, uneven tone, dull morning complexion, pollution defense',
      timeOfDay: 'AM only',
      plainLanguage:
        'A potent antioxidant that neutralizes daily pollution and UV damage before it causes dark spots. It boosts collagen production for lasting luminosity.',
      safetyNote: 'Wear under your morning sunscreen for double the UV defense.',
      badgeColor: 'bg-[#E8D3C0]/80 text-[#856453]',
    },
    {
      id: 'azelaic',
      name: 'Azelaic Acid 10%',
      shortName: 'Azelaic Acid 10%',
      tagline: 'The tone & clarity specialist',
      category: 'Clarifying Treatment',
      bestFor: 'Persistent redness, rosacea flush, stubborn post-blemish shadows',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'Naturally derived from grains, Azelaic Acid selectively targets abnormal hyperpigmentation while dramatically toning down inflammatory facial redness.',
      safetyNote: 'One of the few clarifying actives safe for reactive and acne-prone skin.',
      badgeColor: 'bg-[#F4D9D6]/80 text-[#3B1F2B]',
    },
    {
      id: 'squalane',
      name: '100% Plant Squalane',
      shortName: 'Plant Squalane',
      tagline: 'The weightless moisture seal',
      category: 'Barrier Lipid',
      bestFor: 'Dryness without heaviness, softening rough texture',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A lightweight oil derived from olives or sugarcane that closely mimics your skin’s own natural sebum. It sinks in immediately with zero greasy film.',
      safetyNote: 'Non-comedogenic; will not clog pores or trigger breakouts.',
      badgeColor: 'bg-[#C9D6C3]/80 text-[#44633B]',
    },
  ];

  const [selectedIngredient, setSelectedIngredient] = useState<ActiveIngredient | null>(ingredients[0]);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate for seamless infinite marquee loop
  const marqueeItems = [...ingredients, ...ingredients];

  return (
    <section
      id="ingredients"
      className="py-20 sm:py-24 relative scroll-mt-24 overflow-hidden bg-[#FAF5F0]/60 dark:bg-white/[0.01]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4D9D6]/60 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#CE7F79] dark:text-[#FAF3F0] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formulation Transparency</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
            Active ingredients in plain language
          </h2>
          <p className="text-sm sm:text-base text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            No marketing mystery. Tap any moving ingredient below to read an instant plain-language explanation of what it does, when to apply it, and its dermal tolerance.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Track (Row 1) */}
      <div
        className="relative w-full overflow-hidden py-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Scrim Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF5F0] dark:from-[#120B0F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF5F0] dark:from-[#120B0F] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={isPaused ? {} : { x: ['0%', '-50%'] }}
          transition={{
            duration: 35,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex gap-4 w-max"
        >
          {marqueeItems.map((ing, idx) => {
            const isSelected = selectedIngredient?.id === ing.id;
            return (
              <button
                key={`${ing.id}-${idx}`}
                type="button"
                onClick={() => setSelectedIngredient(ing)}
                className={`group px-5 py-3 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-2.5 shadow-sm whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#3B1F2B] text-white border-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-soft-luxury scale-105'
                    : 'bg-white/90 dark:bg-[#20151C]/90 text-[#3B1F2B] dark:text-[#FAF3F0] border-[#E8D3C0] dark:border-white/10 hover:border-[#3B1F2B]/40 hover:bg-[#F4D9D6]/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-[#CE7F79]'}`} />
                <span>{ing.shortName}</span>
                <span className="text-[10px] opacity-75 font-normal">· {ing.category}</span>
                <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Tap-to-Explain Plain Language Tooltip / Spotlight Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AnimatePresence mode="wait">
          {selectedIngredient && (
            <motion.div
              key={selectedIngredient.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
              className="rounded-3xl glass-card bg-white/95 dark:bg-[#20151C]/95 border border-[#E8D3C0] dark:border-white/10 p-6 sm:p-8 shadow-soft-luxury relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedIngredient(null)}
                aria-label="Close explainer"
                className="absolute top-5 right-5 p-2 rounded-full text-[#7E636E] hover:text-[#3B1F2B] dark:text-[#B59FA9] dark:hover:text-[#FAF3F0] hover:bg-[#F4D9D6]/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E8D3C0]/60 dark:border-white/10 pr-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE7F79] dark:text-[#D9B99B] block">
                    {selectedIngredient.category}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                    {selectedIngredient.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#856453] dark:text-[#D9B99B] mt-0.5">
                    {selectedIngredient.tagline}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3] text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedIngredient.timeOfDay}</span>
                </div>
              </div>

              <div className="pt-5 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0] block mb-2">
                    What it actually does:
                  </span>
                  <p className="text-sm sm:text-base text-[#5A404C] dark:text-[#E0CFD7] leading-relaxed">
                    {selectedIngredient.plainLanguage}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/50 dark:border-white/10 space-y-1">
                    <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8CA583]" />
                      Ideal For:
                    </span>
                    <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                      {selectedIngredient.bestFor}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4D9D6]/30 dark:bg-white/5 border border-[#E8D3C0]/50 dark:border-white/10 space-y-1">
                    <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#CE7F79]" />
                      Tolerance & Safety:
                    </span>
                    <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                      {selectedIngredient.safetyNote}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
