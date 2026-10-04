'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  BarChart3,
  Heart,
} from 'lucide-react';
import { RecommendationResult } from '@/types';
import { ProductVisual } from '@/components/common/ProductVisual';
import { formatINR } from '@/lib/utils';

interface Props {
  result: RecommendationResult;
  rank?: number;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  canCompare: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ProductCard({
  result,
  rank,
  isCompared,
  onToggleCompare,
  canCompare,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const { product, matchScore, aiExplanation, conflictWarnings, scoreBreakdown } =
    result;
  const [expandedExplanation, setExpandedExplanation] = useState(false);
  const [expandedBreakdown, setExpandedBreakdown] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    if (onToggleFavorite) onToggleFavorite(product.id);
  };

  // SVG Circular Ring Calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  // Rating percentage for score breakdown
  const ratingPercent = Math.round((product.rating / 5) * 100);

  return (
    <div
      className={`rounded-3xl glass-card border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-luxury-hover ${
        isCompared
          ? 'border-[#213A30] dark:border-[#E2EADD] shadow-md shadow-[#213A30]/10'
          : 'border-[#DCDACD] dark:border-white/10 hover:border-[#B86A4B]/50'
      } bg-white/90 dark:bg-[#222B25]/90`}
    >
      <div>
        {/* Top Section: 1:1 Product Visual Container */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F7F6F0] via-[#F7F6F0]/60 to-transparent dark:from-white/[0.04] dark:via-white/[0.01] dark:to-transparent flex items-center justify-center p-4 border-b border-[#DCDACD]/60 dark:border-white/5 overflow-hidden">
          {/* Subtle Ambient Brand Glow */}
          <div
            className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${product.brandAccentColor || '#B86A4B'} 0%, transparent 70%)`,
            }}
          />

          {/* Floating Badges, Heart & Compare Action */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
            <div className="flex flex-wrap items-center gap-1.5">
              {rank && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#213A30] dark:bg-white/10 text-white dark:text-[#F7F6F0] font-bold tracking-wider uppercase border border-black/10 backdrop-blur-md">
                  #{rank}
                </span>
              )}
              {product.badge && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4E2D2]/50 text-[#405C45] dark:text-[#D4E2D2] font-bold border border-[#D4E2D2] backdrop-blur-md">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Save Favourite Heart */}
              <button
                type="button"
                onClick={handleFavoriteClick}
                aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
                className={`p-1.5 rounded-full border transition-all ${
                  favorite
                    ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-sm'
                    : 'bg-white/90 dark:bg-[#17201B]/90 border-[#DCDACD] dark:border-white/15 text-[#68766C] dark:text-[#A6B0A5] hover:text-rose-500'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Compare Toggle */}
              <button
                type="button"
                disabled={!isCompared && !canCompare}
                onClick={() => onToggleCompare(product.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-all ${
                  isCompared
                    ? 'bg-[#213A30] text-white border-[#213A30] dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm'
                    : canCompare
                    ? 'bg-white/90 dark:bg-[#17201B]/90 border-[#DCDACD] dark:border-white/15 text-[#213A30] dark:text-[#F7F6F0] hover:bg-[#E2EADD]/30'
                    : 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                }`}
              >
                {isCompared && <Check className="w-3 h-3" />}
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>
          </div>

          {/* Centered Product Visual (Real image or neutral coming soon card) */}
          <ProductVisual product={product} size="lg" className="z-10 group-hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header Row: Brand, Title, Circular Match Ring */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#68766C] dark:text-[#A6B0A5] uppercase tracking-widest block">
                {product.brand}
              </span>
              <h4 className="font-serif font-bold text-base sm:text-lg text-[#213A30] dark:text-[#F7F6F0] leading-snug mt-0.5 line-clamp-2" title={product.name}>
                {product.name}
              </h4>

              {/* Meta row: Rating, Category, Volume */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#68766C] dark:text-[#A6B0A5]">
                <span className="text-[11px] font-medium text-[#68766C] dark:text-[#A6B0A5]">
                  Catalog score: <strong className="text-[#213A30] dark:text-[#F7F6F0]">{product.rating}</strong>{' '}
                  <span className="text-[9px] text-[#B86A4B]">(demo data)</span>
                </span>
                <span>•</span>
                <span className="text-[#B86A4B] dark:text-[#C7A77A] font-medium">{product.category}</span>
                <span>•</span>
                <span>{product.volumeOrWeight}</span>
              </div>
            </div>

            {/* Circular Match Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0" title="Match score based on your scan and preferences">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 54 54">
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  className="text-[#DCDACD]/50 dark:text-white/10"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke={`url(#card-ring-grad-${product.id})`}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id={`card-ring-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#213A30" />
                    <stop offset="50%" stopColor="#B86A4B" />
                    <stop offset="100%" stopColor="#C7A77A" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-serif font-bold text-xs text-[#213A30] dark:text-[#F7F6F0] leading-none">
                  {matchScore}%
                </span>
                <span className="text-[8px] font-bold text-[#68766C] dark:text-[#A6B0A5] uppercase tracking-tighter">
                  Match
                </span>
              </div>
            </div>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-[#68766C] dark:text-[#A6B0A5] font-medium">
              Price <span className="text-[9px] text-[#B86A4B]">(demo data)</span>:
            </span>
            <span className="font-serif font-bold text-lg sm:text-xl text-[#213A30] dark:text-[#F7F6F0]">
              {formatINR(product.priceINR)}
            </span>
          </div>

          {/* Conflict Warning Badge if any */}
          {conflictWarnings.length > 0 && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> {conflictWarnings.join(', ')}
              </div>
            </div>
          )}

          {/* 2-line "Why this suits you" with "Read more" toggle */}
          <div className="p-3.5 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.02] border border-[#DCDACD]/60 dark:border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#B86A4B] dark:text-[#C7A77A] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#B86A4B]" />
              <span>Why this suits you</span>
            </div>
            <p
              className={`text-xs text-[#68766C] dark:text-[#A6B0A5] leading-relaxed ${
                !expandedExplanation ? 'line-clamp-2' : ''
              }`}
            >
              {aiExplanation}
            </p>
            <button
              type="button"
              onClick={() => setExpandedExplanation(!expandedExplanation)}
              className="text-[11px] font-bold text-[#213A30] dark:text-[#E2EADD] hover:underline pt-0.5 block transition-colors"
            >
              {expandedExplanation ? 'Read less' : 'Read more'}
            </button>
          </div>

          {/* Top 3 Active Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#68766C] dark:text-[#A6B0A5]">Key Actives:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.keyIngredients.slice(0, 3).map((act) => (
                <span
                  key={act}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-medium text-[#213A30] dark:text-[#F7F6F0] shadow-sm"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Score Breakdown Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setExpandedBreakdown(!expandedBreakdown)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white py-1.5 transition-colors border-t border-[#DCDACD]/50 dark:border-white/5"
            >
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#71896C]" />
                <span>Score Breakdown</span>
              </div>
              {expandedBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Score Breakdown Bars */}
            {expandedBreakdown && (
              <div className="pt-3 pb-1 space-y-2.5 text-xs animate-fadeIn">
                {/* Trait Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Trait Match</span>
                    <span className="text-[#213A30] dark:text-[#F7F6F0] font-bold">{scoreBreakdown.traitScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCDACD]/50 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#71896C]" style={{ width: `${scoreBreakdown.traitScore}%` }} />
                  </div>
                </div>

                {/* Concern Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Concern Match</span>
                    <span className="text-[#B86A4B] font-bold">{scoreBreakdown.concernScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCDACD]/50 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#B86A4B]" style={{ width: `${scoreBreakdown.concernScore}%` }} />
                  </div>
                </div>

                {/* Requirement Match */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Requirement Match</span>
                    <span className="text-[#C7A77A] font-bold">{scoreBreakdown.requirementScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCDACD]/50 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#C7A77A]" style={{ width: `${scoreBreakdown.requirementScore}%` }} />
                  </div>
                </div>

                {/* Budget Fit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Budget Fit</span>
                    <span className="text-[#213A30] dark:text-[#E2EADD] font-bold">{scoreBreakdown.budgetScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCDACD]/50 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#213A30] dark:bg-[#E2EADD]" style={{ width: `${scoreBreakdown.budgetScore}%` }} />
                  </div>
                </div>

                {/* Community Rating */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#68766C] dark:text-[#A6B0A5]">Community Rating</span>
                    <span className="text-amber-500 font-bold">{ratingPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DCDACD]/50 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${ratingPercent}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Buy Button */}
      <div className="p-5 sm:p-6 pt-0">
        <a
          href={product.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] shadow-soft-luxury transition-all group/btn"
        >
          <span>Buy Product</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
