'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Crown,
  Layers,
  Heart,
} from 'lucide-react';
import { RecommendationResult } from '@/types';
import { ProductVisual } from '@/components/common/ProductVisual';
import { formatINR } from '@/lib/utils';

interface Props {
  result: RecommendationResult;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  canCompare: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function HeroPickCard({
  result,
  isCompared,
  onToggleCompare,
  canCompare,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const { product, matchScore, keyReasons, aiExplanation, conflictWarnings, scoreBreakdown } =
    result;
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    if (onToggleFavorite) onToggleFavorite(product.id);
  };

  // SVG Circular Ring Calculation
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const bullets = keyReasons && keyReasons.length > 0
    ? keyReasons.slice(0, 3)
    : [
        `Targeted formulation designed for your ${product.category.toLowerCase()} routine.`,
        `Contains ${product.keyIngredients.slice(0, 2).join(' & ')} to balance visible dermal traits.`,
        `Fully aligns with your specified budget and tolerance preferences.`,
      ];

  return (
    <div className="relative group">
      {/* Outer ambient soft blush glow */}
      <div className="absolute -inset-1 rounded-4xl bg-gradient-to-r from-[#F4D9D6]/50 via-[#E8D3C0]/40 to-[#C9D6C3]/40 blur-xl opacity-70 group-hover:opacity-95 transition duration-700 pointer-events-none" />

      {/* Main Hero Card Container with animated gradient border */}
      <div className="animated-gradient-border relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-white/95 dark:bg-[#20151C]/95 shadow-soft-luxury transition-all">
        {/* Top Header Badge, Favorite Heart & Compare Action */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold tracking-wider uppercase text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Your #1 Formulation Fit</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Favourite Heart */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2 rounded-full border transition-all ${
                favorite
                  ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-sm'
                  : 'bg-white/80 dark:bg-white/5 border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Compare Toggle */}
            <button
              type="button"
              disabled={!isCompared && !canCompare}
              onClick={() => onToggleCompare(product.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isCompared
                  ? 'bg-[#3B1F2B] text-white border-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-sm'
                  : canCompare
                  ? 'bg-white/80 dark:bg-white/5 border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/30'
                  : 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
              }`}
            >
              {isCompared && <Check className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* Hero Body: Left Visual + Right Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: 1:1 Product Visual Showcase */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-[#FBF7F4] to-[#FAF5F0] dark:from-white/[0.03] dark:to-transparent border border-[#E8D3C0] dark:border-white/10 shadow-inner group/visual">
              <ProductVisual product={product} size="hero" />

              {/* Volume & Type Capsule */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#180F14]/90 backdrop-blur-md border border-[#E8D3C0] dark:border-white/15 text-[11px] font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm flex items-center gap-2 whitespace-nowrap">
                <span>{product.volumeOrWeight}</span>
                <span className="w-1 h-1 rounded-full bg-[#8CA583]" />
                <span className="text-[#CE7F79] dark:text-[#D9B99B]">{product.category}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Specs, Reasons & Buy */}
          <div className="md:col-span-7 space-y-5">
            {/* Title & Brand Row */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7E636E] dark:text-[#B59FA9]">
                  {product.brand}
                </span>
                {product.badge && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] font-bold border border-[#C9D6C3]">
                    {product.badge}
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1F2B] dark:text-[#FAF3F0] mt-1 leading-snug">
                {product.name}
              </h3>
            </div>

            {/* Score, Rating & Price Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FBF7F4] dark:bg-white/[0.02] border border-[#E8D3C0]/70 dark:border-white/10">
              {/* Circular Score Ring */}
              <div className="flex items-center gap-3">
                <div className="relative w-15 h-15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
                    <circle
                      cx="36"
                      cy="36"
                      r={radius}
                      className="text-[#E8D3C0]/50 dark:text-white/10"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r={radius}
                      stroke="url(#hero-ring-gradient)"
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="hero-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B1F2B" />
                        <stop offset="60%" stopColor="#CE7F79" />
                        <stop offset="100%" stopColor="#D9B99B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif font-bold text-base leading-none text-[#3B1F2B] dark:text-[#FAF3F0]">
                      {matchScore}%
                    </span>
                    <span className="text-[8px] font-bold text-[#7E636E] dark:text-[#B59FA9] uppercase tracking-tighter">
                      Match
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-amber-500 text-xs">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-500 text-amber-500'
                              : 'fill-transparent text-[#E8D3C0]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1.5 font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8CA583] block">
                    Highest Precision Fit
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="text-right">
                <span className="text-[10px] text-[#7E636E] dark:text-[#B59FA9] font-medium block">
                  Best Available Price
                </span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                  {formatINR(product.priceINR)}
                </span>
              </div>
            </div>

            {/* Warning if any */}
            {conflictWarnings.length > 0 && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Avoid Warning:</strong> {conflictWarnings.join(', ')}
                </span>
              </div>
            )}

            {/* 3 Short Reason Bullets */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] block">
                Why this is your #1 pick:
              </span>
              <ul className="space-y-2">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3B1F2B] dark:text-[#FAF3F0] leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-[#F4D9D6] dark:bg-white/10 text-[#CE7F79] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Actives Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9]">Actives:</span>
              {product.keyIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-medium text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm"
                >
                  {ing}
                </span>
              ))}
            </div>

            {/* Action Row: Score Breakdown Toggle & Buy Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B] dark:hover:text-white transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showFullBreakdown ? 'Hide Biometric Breakdown' : 'View Full Score Breakdown'}</span>
                {showFullBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] dark:hover:bg-[#E9BDB9] shadow-soft-luxury hover:shadow-luxury-hover transition-all"
              >
                <span>Buy This Pick</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Expandable Biometric Score Breakdown Bars */}
            {showFullBreakdown && (
              <div className="pt-4 border-t border-[#E8D3C0]/70 dark:border-white/10 space-y-3 animate-fadeIn">
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] leading-relaxed italic">
                  &ldquo;{aiExplanation}&rdquo;
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FBF7F4] dark:bg-white/[0.02] border border-[#E8D3C0]/60 dark:border-white/5">
                  {/* Trait Match */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-[#7E636E] dark:text-[#B59FA9]">Trait Match</span>
                      <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">{scoreBreakdown.traitScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E8D3C0]/50 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#8CA583]" style={{ width: `${scoreBreakdown.traitScore}%` }} />
                    </div>
                  </div>

                  {/* Concern Match */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-[#7E636E] dark:text-[#B59FA9]">Concern Match</span>
                      <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">{scoreBreakdown.concernScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E8D3C0]/50 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#CE7F79]" style={{ width: `${scoreBreakdown.concernScore}%` }} />
                    </div>
                  </div>

                  {/* Requirement Match */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-[#7E636E] dark:text-[#B59FA9]">Requirement Match</span>
                      <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">{scoreBreakdown.requirementScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E8D3C0]/50 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#D9B99B]" style={{ width: `${scoreBreakdown.requirementScore}%` }} />
                    </div>
                  </div>

                  {/* Budget Fit */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-[#7E636E] dark:text-[#B59FA9]">Budget Fit</span>
                      <span className="text-[#3B1F2B] dark:text-[#FAF3F0] font-bold">{scoreBreakdown.budgetScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E8D3C0]/50 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#3B1F2B] dark:bg-[#F4D9D6]" style={{ width: `${scoreBreakdown.budgetScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
