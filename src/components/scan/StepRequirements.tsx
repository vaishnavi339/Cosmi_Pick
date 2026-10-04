'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Tag,
  IndianRupee,
  Check,
} from 'lucide-react';
import { UserRequirements, ExtractedFaceTraits } from '@/types';
import { activeCategoryConfig } from '@/config/category.config';

interface Props {
  traits: ExtractedFaceTraits;
  onSubmit: (rawText: string, requirements: Partial<UserRequirements>) => void;
  onBack: () => void;
  loading: boolean;
}

export function StepRequirements({ traits, onSubmit, onBack, loading }: Props) {
  const config = activeCategoryConfig;

  // Pre-populate sensible defaults from extracted traits
  const defaultConcerns: string[] = [];
  traits.visibleConcerns.forEach((c) => {
    if (c.level !== 'low') {
      if (c.concern === 'oiliness') defaultConcerns.push('oiliness', 'acne');
      if (c.concern === 'redness') defaultConcerns.push('redness', 'barrier_repair');
      if (c.concern === 'dark_circles') defaultConcerns.push('dark_circles');
      if (c.concern === 'dryness') defaultConcerns.push('dryness');
    }
  });

  const [rawText, setRawText] = useState(() => {
    const focus = defaultConcerns
      .map((id) => config.filterOptions.concerns.find((item) => item.id === id)?.label)
      .filter(Boolean);
    return focus.length
      ? `Please focus on ${focus.join(', ').toLowerCase()}. I prefer gentle, fragrance-free formulas.`
      : 'Please suggest a gentle everyday routine with fragrance-free formulas.';
  });
  const [budgetMax, setBudgetMax] = useState<number>(config.defaultBudget);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(Array.from(new Set(defaultConcerns)));
  const [selectedAvoid, setSelectedAvoid] = useState<string[]>(['fragrance']);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(['serum', 'moisturizer']);

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAvoid = (id: string) => {
    setSelectedAvoid((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleType = (id: string) => {
    setSelectedProductTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rawText, {
      budgetMax,
      targetedConcerns: selectedConcerns,
      avoidIngredients: selectedAvoid,
      productTypes: selectedProductTypes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-7">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] glass-card p-5 sm:p-8 border border-[#DCDACD] dark:border-white/10 shadow-[0_24px_75px_-45px_rgba(33,58,48,.38)] space-y-8 bg-white/95 dark:bg-[#222B25]/95"
      >
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] mb-1">
            <Sparkles className="w-3 h-3 text-[#B86A4B]" />
            <span>Step 4 of 5 • Your Goals</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl tracking-tight text-[#213A30] dark:text-[#F7F6F0]">
            Your routine, your rules.
          </h2>
          <p className="text-xs sm:text-sm text-[#68766C] dark:text-[#A6B0A5] mt-1">
            Describe what you need in plain words, or select your preferences below.
          </p>
        </div>

        {/* 1. Conversational Free-Text Box */}
        <div className="space-y-2">
          <label
            htmlFor="user-query-input"
            className="block text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5]"
          >
            Tell us what you’re looking for
          </label>
          <div className="relative">
            <textarea
              id="user-query-input"
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Oily T-zone, prone to breakouts, budget under ₹1500, strictly fragrance-free daily serum..."
              className="w-full p-4 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.04] border border-[#DCDACD] dark:border-white/15 text-[#213A30] dark:text-white placeholder:text-[#68766C]/60 focus:ring-2 focus:ring-[#B86A4B] focus:outline-none text-sm leading-relaxed"
            />
          </div>
          <p className="text-[11px] text-[#68766C] dark:text-[#A6B0A5]">
            We will pair your wording directly with formulation ingredients and skin compatibility.
          </p>
        </div>

        {/* 2. Budget Range Slider */}
        <div className="p-5 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.03] border border-[#DCDACD] dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#71896C]" />
              Maximum Budget Per Product
            </span>
            <span className="font-serif font-bold text-lg text-[#213A30] dark:text-[#F7F6F0]">
              ₹{budgetMax.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            id="budget-range-slider"
            type="range"
            min={400}
            max={config.maxBudgetLimit}
            step={100}
            value={budgetMax}
            onChange={(e) => setBudgetMax(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-[#DCDACD] dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#213A30] dark:accent-[#E2EADD]"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="w-full text-[11px] text-[#68766C] dark:text-[#A6B0A5] font-medium">Quick budget picks</span>
            {config.filterOptions.budgetPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={budgetMax === preset}
                onClick={() => setBudgetMax(preset)}
                className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${
                  budgetMax === preset
                    ? 'bg-[#213A30] text-white border-[#213A30] dark:bg-[#E2EADD] dark:text-[#213A30] font-bold shadow-sm'
                    : 'bg-white/70 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] border-[#DCDACD] dark:border-white/10 hover:text-[#213A30]'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Targeted Skin Concerns */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5]">
            Your goals and concerns
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.concerns.map((c) => {
              const isSelected = selectedConcerns.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleConcern(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D4E2D2]/50 border-[#71896C] text-[#405C45] dark:text-[#D4E2D2] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#71896C]" />}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Ingredients to Avoid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B86A4B]" />
            Ingredients you’d like to avoid
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.avoidIngredients.map((avoid) => {
              const isSelected = selectedAvoid.includes(avoid.id);
              return (
                <button
                  key={avoid.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleAvoid(avoid.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#E2EADD] border-[#B86A4B] text-[#54715C] dark:text-[#E2EADD] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B86A4B]" />}
                  <span>{avoid.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Product Types */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#C7A77A]" />
            Product formats you enjoy
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.productTypes.map((type) => {
              const isSelected = selectedProductTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleType(type.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C7A77A]/30 border-[#C7A77A] text-[#213A30] dark:text-[#F7F6F0] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#213A30] dark:text-white" />}
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-[#DCDACD]/60 dark:border-white/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-full border border-[#DCDACD] dark:border-white/15 text-xs font-semibold text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30]"
          >
            Back
          </button>

          <button
            id="generate-picks-btn"
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-full font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] shadow-soft-luxury hover:shadow-luxury-hover text-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Finding Formulations...' : 'See My Personalized Picks'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
