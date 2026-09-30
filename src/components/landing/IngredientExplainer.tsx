'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface ActiveIngredient {
  name: string;
  tagline: string;
  category: string;
  bestFor: string;
  timeOfDay: 'AM & PM' | 'AM only' | 'PM only';
  plainLanguage: string;
  safetyNote: string;
}

export function IngredientExplainer() {
  const ingredients: ActiveIngredient[] = [
    {
      name: 'Niacinamide (Vitamin B3)',
      tagline: 'The universal skin balancer',
      category: 'Oil & Pore Regulator',
      bestFor: 'T-zone shine, enlarged pores, redness & post-acne marks',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A gentle, non-irritating vitamin that tells overactive oil glands to slow down. It also helps build keratin to keep your skin surface firm, even-toned, and resilient.',
      safetyNote: 'Well tolerated by virtually all skin types, including sensitive skin.',
    },
    {
      name: 'Ceramides (1, 3, 6-II)',
      tagline: 'The skin barrier mortar',
      category: 'Barrier Repair',
      bestFor: 'Dryness, flaking, tight-feeling skin, barrier irritation',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'Think of skin cells as bricks and ceramides as the cement holding them together. Ceramides prevent moisture from evaporating into the air and keep irritants out.',
      safetyNote: 'Naturally found in healthy skin. Zero risk of irritation.',
    },
    {
      name: 'Hyaluronic Acid',
      tagline: 'The moisture magnet',
      category: 'Deep Hydration',
      bestFor: 'Dehydration, dullness, fine surface lines, tired skin',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A sugar molecule that holds up to 1,000 times its weight in water. Applied to slightly damp skin, it instantly plumps surface layers for an dewy, bouncy glow.',
      safetyNote: 'Apply on damp skin followed by a moisturizer to lock it in.',
    },
    {
      name: 'Centella Asiatica (Cica)',
      tagline: 'The botanical redness calmer',
      category: 'Soothing Botanical',
      bestFor: 'Flushed skin, irritation, burning sensations, reactive barrier',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A traditional medicinal herb rich in madecassoside. It calms burning sensations, accelerates natural skin recovery, and cools down facial flushing.',
      safetyNote: 'Extremely gentle; ideal after sun exposure or active exfoliation.',
    },
    {
      name: 'Salicylic Acid (BHA)',
      tagline: 'The deep pore unclogger',
      category: 'Gentle Exfoliant',
      bestFor: 'Blackheads, whiteheads, bumpy texture, congested T-zones',
      timeOfDay: 'PM only',
      plainLanguage:
        'Unlike water-soluble acids, Salicylic Acid dissolves in oil. It travels directly into deep pores to dissolve accumulated dead skin and hardened sebum plugs.',
      safetyNote: 'Start 2–3 nights a week. Always pair with daytime sunscreen.',
    },
    {
      name: 'Stabilized Vitamin C',
      tagline: 'The daytime glow antioxidant',
      category: 'Antioxidant & Brightener',
      bestFor: 'Sun spots, uneven tone, dull morning complexion, pollution defense',
      timeOfDay: 'AM only',
      plainLanguage:
        'A potent antioxidant that neutralizes daily pollution and UV damage before it causes dark spots. It boosts collagen production for lasting luminosity.',
      safetyNote: 'Wear under your morning sunscreen for double the UV defense.',
    },
    {
      name: 'Azelaic Acid',
      tagline: 'The tone & clarity specialist',
      category: 'Clarifying Treatment',
      bestFor: 'Persistent redness, rosacea flush, stubborn dark marks',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'Naturally derived from grains, Azelaic Acid selectively targets abnormal hyperpigmentation while dramatically toning down inflammatory facial redness.',
      safetyNote: 'One of the few clarifying actives safe for reactive and acne-prone skin.',
    },
    {
      name: 'Plant Squalane',
      tagline: 'The weightless moisture seal',
      category: 'Barrier Lipid',
      bestFor: 'Dryness without heaviness, softening rough texture',
      timeOfDay: 'AM & PM',
      plainLanguage:
        'A lightweight oil derived from olives or sugarcane that closely mimics your skin’s own natural sebum. It sinks in immediately with zero greasy film.',
      safetyNote: 'Non-comedogenic; will not clog pores or trigger breakouts.',
    },
  ];

  const [active, setActive] = useState<ActiveIngredient>(ingredients[0]);

  return (
    <section id="ingredients" className="py-20 relative scroll-mt-24 bg-[#FAF5F0]/60 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4D9D6]/60 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#CE7F79] dark:text-[#FAF3F0] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Formulations Demystified</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
            Plain language ingredient guide
          </h2>
          <p className="text-sm sm:text-base text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
            Tap any active ingredient to see what it actually does for your skin, when to use it, and why CosmicPick recommends it.
          </p>
        </div>

        {/* Interactive Ingredient Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-10">
          {ingredients.map((ing) => {
            const isSelected = active.name === ing.name;
            return (
              <button
                key={ing.name}
                type="button"
                onClick={() => setActive(ing)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border shadow-sm ${
                  isSelected
                    ? 'bg-[#3B1F2B] text-white border-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] scale-105 shadow-soft-luxury'
                    : 'bg-white/90 dark:bg-[#20151C]/90 text-[#3B1F2B] dark:text-[#FAF3F0] border-[#E8D3C0] dark:border-white/10 hover:bg-[#F4D9D6]/40'
                }`}
              >
                {ing.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Active Ingredient Spotlight Card */}
        <div className="max-w-3xl mx-auto rounded-3xl glass-card bg-white/90 dark:bg-[#20151C]/90 border border-[#E8D3C0] dark:border-white/10 p-8 sm:p-10 shadow-soft-luxury transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E8D3C0]/60 dark:border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE7F79] dark:text-[#D9B99B] block">
                {active.category}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                {active.name}
              </h3>
              <p className="text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9] mt-0.5">
                {active.tagline}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3] text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{active.timeOfDay}</span>
              </span>
            </div>
          </div>

          <div className="pt-6 space-y-6">
            {/* Plain Language Explanation */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0] block mb-2">
                What it actually does:
              </span>
              <p className="text-sm sm:text-base text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                {active.plainLanguage}
              </p>
            </div>

            {/* Target Concerns & Safety Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FBF7F4] dark:bg-white/5 border border-[#E8D3C0]/50 dark:border-white/10 space-y-1.5">
                <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8CA583]" />
                  Best For:
                </span>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                  {active.bestFor}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4D9D6]/30 dark:bg-white/5 border border-[#E8D3C0]/50 dark:border-white/10 space-y-1.5">
                <span className="text-xs font-bold text-[#3B1F2B] dark:text-[#FAF3F0] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#CE7F79]" />
                  Tolerance & Safety:
                </span>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                  {active.safetyNote}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
