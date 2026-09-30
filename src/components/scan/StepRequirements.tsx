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

  const [rawText, setRawText] = useState(
    'Oily T-zone, lightweight texture, budget under ₹1500, fragrance-free'
  );
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl glass-card p-6 sm:p-8 border border-[#E8D3C0] dark:border-white/10 shadow-soft-luxury space-y-8 bg-white/90 dark:bg-[#20151C]/90"
      >
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] mb-1">
            <Sparkles className="w-3 h-3 text-[#CE7F79]" />
            <span>Step 4 of 5 • Your Goals</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1F2B] dark:text-[#FAF3F0]">
            What Are Your Skincare Goals & Rules?
          </h2>
          <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] mt-1">
            Describe what you need in plain words, or select your preferences below.
          </p>
        </div>

        {/* 1. Conversational Free-Text Box */}
        <div className="space-y-2">
          <label
            htmlFor="user-query-input"
            className="block text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9]"
          >
            What does your skin need? (in your own words)
          </label>
          <div className="relative">
            <textarea
              id="user-query-input"
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Oily T-zone, prone to breakouts, budget under ₹1500, strictly fragrance-free daily serum..."
              className="w-full p-4 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.04] border border-[#E8D3C0] dark:border-white/15 text-[#3B1F2B] dark:text-white placeholder:text-[#7E636E]/60 focus:ring-2 focus:ring-[#CE7F79] focus:outline-none text-sm leading-relaxed"
            />
          </div>
          <p className="text-[11px] text-[#7E636E] dark:text-[#B59FA9]">
            We will pair your wording directly with formulation ingredients and skin compatibility.
          </p>
        </div>

        {/* 2. Budget Range Slider */}
        <div className="p-5 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#8CA583]" />
              Maximum Budget Per Product
            </span>
            <span className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0]">
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
            className="w-full h-2 bg-[#E8D3C0] dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3B1F2B] dark:accent-[#F4D9D6]"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#7E636E] dark:text-[#B59FA9] font-medium">Quick Presets:</span>
            {config.filterOptions.budgetPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudgetMax(preset)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  budgetMax === preset
                    ? 'bg-[#3B1F2B] text-white border-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] font-bold shadow-sm'
                    : 'bg-white/70 dark:bg-white/5 text-[#7E636E] dark:text-[#B59FA9] border-[#E8D3C0] dark:border-white/10 hover:text-[#3B1F2B]'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Targeted Skin Concerns */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9]">
            Goals & Concerns
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.concerns.map((c) => {
              const isSelected = selectedConcerns.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleConcern(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C9D6C3]/50 border-[#8CA583] text-[#44633B] dark:text-[#C9D6C3] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#8CA583]" />}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Ingredients to Avoid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#CE7F79]" />
            Ingredients to Avoid (Allergens & Sensitizers)
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.avoidIngredients.map((avoid) => {
              const isSelected = selectedAvoid.includes(avoid.id);
              return (
                <button
                  key={avoid.id}
                  type="button"
                  onClick={() => toggleAvoid(avoid.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#F4D9D6] border-[#CE7F79] text-[#8A4D71] dark:text-[#F4D9D6] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#CE7F79]" />}
                  <span>{avoid.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Product Types */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#D9B99B]" />
            Product Types You Need
          </label>
          <div className="flex flex-wrap gap-2">
            {config.filterOptions.productTypes.map((type) => {
              const isSelected = selectedProductTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleType(type.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D9B99B]/30 border-[#D9B99B] text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm'
                      : 'bg-white/70 dark:bg-white/[0.03] border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#3B1F2B] dark:text-white" />}
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-[#E8D3C0]/60 dark:border-white/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-full border border-[#E8D3C0] dark:border-white/15 text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B]"
          >
            Back
          </button>

          <button
            id="generate-picks-btn"
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-full font-bold text-white bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] dark:hover:bg-[#E9BDB9] shadow-soft-luxury hover:shadow-luxury-hover text-sm flex items-center gap-2 transition-all"
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
