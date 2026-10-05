'use client';

import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  Columns,
  AlertCircle,
  X,
} from 'lucide-react';
import { RecommendationResult, ExtractedFaceTraits, UserRequirements } from '@/types';
import { TopSummaryStrip } from '@/components/results/TopSummaryStrip';
import { HeroPickCard } from '@/components/results/HeroPickCard';
import { ProductCard } from '@/components/results/ProductCard';
import { CompareModal } from '@/components/results/CompareModal';
import { ProfileCard } from '@/components/results/ProfileCard';
import { RoutineBuilderModal } from '@/components/results/RoutineBuilderModal';
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton';
import { ProductVisual } from '@/components/common/ProductVisual';
import { ProductLookupSection } from '@/components/results/ProductLookupSection';

interface Props {
  initialResults: RecommendationResult[];
  routineResults?: RecommendationResult[];
  traits: ExtractedFaceTraits;
  requirements: UserRequirements;
  onRestart: () => void;
  onEditTraits?: () => void;
  onEditRequirements?: () => void;
}

type SortOption = 'match' | 'price_asc' | 'price_desc' | 'rating';

export function StepResults({
  initialResults,
  routineResults = initialResults,
  traits,
  requirements,
  onRestart,
  onEditTraits,
  onEditRequirements,
}: Props) {
  const [results, setResults] = useState<RecommendationResult[]>(initialResults);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Conversational Refinement
  const [refineQuery, setRefineQuery] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Reduced motion preference
  const shouldReduceMotion = useReducedMotion();

  // Toggle compare selection (up to 3 products)
  const handleToggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length < 3) {
        setComparedIds([...comparedIds, id]);
      }
    }
  };

  const handleRemoveCompare = (id: string) => {
    setComparedIds(comparedIds.filter((item) => item !== id));
  };

  // Toggle save favorites
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Conversational re-ranking action
  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineQuery.trim()) return;

    setIsRefining(true);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traits,
          requirements,
          refinementQuery: refineQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setResults(data.recommendations);
          setRefineQuery('');
        }
      }
    } catch (err) {
      console.error('Error during conversational refine:', err);
    } finally {
      setIsRefining(false);
    }
  };

  // Filtered and sorted products list
  const filteredAndSorted = useMemo(() => {
    let list = [...results];

    if (filterCategory !== 'all') {
      list = list.filter((r) =>
        r.product.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'price_asc') return a.product.priceINR - b.product.priceINR;
      if (sortBy === 'price_desc') return b.product.priceINR - a.product.priceINR;
      if (sortBy === 'rating') return b.product.rating - a.product.rating;
      return 0;
    });

    return list;
  }, [results, filterCategory, sortBy]);

  // #1 Hero product and remaining products
  const heroProduct = filteredAndSorted[0] || null;
  const remainingProducts = filteredAndSorted.slice(1);

  // Compared results subset
  const comparedResults = useMemo(() => {
    return results.filter((r) => comparedIds.includes(r.product.id));
  }, [results, comparedIds]);

  // Categories available
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    results.forEach((r) => cats.add(r.product.category));
    return Array.from(cats);
  }, [results]);

  if (isRefining) {
    return <ResultsSkeleton />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 pb-32"
    >
      {/* 1. TOP SUMMARY STRIP WITH EDIT LINKS & ROUTINE BUTTON */}
      <motion.div variants={itemVariants}>
        <TopSummaryStrip
          traits={traits}
          requirements={requirements}
          onEditTraits={onEditTraits}
          onEditRequirements={onEditRequirements}
          onOpenProfileCard={() => setIsProfileModalOpen(true)}
          onOpenRoutineBuilder={() => setIsRoutineModalOpen(true)}
          onRestart={onRestart}
        />
      </motion.div>

      {/* 2. REFINEMENT SEARCH BAR (Warm luxury styling) */}
      <motion.div variants={itemVariants}>
        <div className="p-4 sm:p-5 rounded-3xl glass-card bg-white/80 dark:bg-[#222B25]/80 border border-[#DCDACD] dark:border-white/10 shadow-soft-luxury">
          <form onSubmit={handleRefineSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#68766C] dark:text-[#A6B0A5] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="refine-query-input"
                type="text"
                value={refineQuery}
                onChange={(e) => setRefineQuery(e.target.value)}
                placeholder="Refine in plain text (e.g. 'under ₹1000', 'strictly fragrance-free', 'lightweight gel texture')..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.04] border border-[#DCDACD] dark:border-white/10 text-xs sm:text-sm text-[#213A30] dark:text-[#F7F6F0] placeholder:text-[#68766C]/60 focus:outline-none focus:ring-2 focus:ring-[#B86A4B] transition-all"
              />
            </div>

            <button
              id="apply-refine-btn"
              type="submit"
              disabled={isRefining || !refineQuery.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] text-xs shadow-soft-luxury transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRefining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isRefining ? 'Re-Ranking...' : 'Re-Rank'}</span>
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#68766C] dark:text-[#A6B0A5] text-[11px] font-medium">Quick adjustments:</span>
            {['show cheaper ones', 'only sunscreens', 'more soothing & gentle', 'only serums'].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setRefineQuery(sug)}
                className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white hover:border-[#B86A4B]/50 text-[11px] transition-colors"
              >
                &ldquo;{sug}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. YOUR #1 PICK HERO CARD */}
      {heroProduct && (
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#213A30] dark:text-[#F7F6F0] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B86A4B]" />
              <span>Your Recommended Pick</span>
            </h3>
            <span className="text-xs font-semibold text-[#68766C] dark:text-[#A6B0A5]">
              Suggestions, not medical advice
            </span>
          </div>

          <HeroPickCard
            result={heroProduct}
            isCompared={comparedIds.includes(heroProduct.product.id)}
            onToggleCompare={handleToggleCompare}
            canCompare={comparedIds.length < 3}
            isFavorite={favorites.includes(heroProduct.product.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        </motion.div>
      )}

      {/* 4. STICKY FILTER & SORT BAR (Warm luxury aesthetic) */}
      <div className="sticky top-16 sm:top-20 z-30 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl glass-card bg-white/95 dark:bg-[#17201B]/95 backdrop-blur-xl border border-[#DCDACD] dark:border-white/10 shadow-soft-luxury">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-bold text-[#68766C] dark:text-[#A6B0A5] uppercase tracking-wider hidden sm:flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#B86A4B]" />
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterCategory === 'all'
                  ? 'bg-[#213A30] text-white dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm'
                  : 'bg-white/80 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white border border-[#DCDACD] dark:border-white/10'
              }`}
            >
              All Types ({results.length})
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-[#213A30] text-white dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm'
                    : 'bg-white/80 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white border border-[#DCDACD] dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-[#68766C] dark:text-[#A6B0A5] uppercase tracking-wider hidden sm:flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#71896C]" />
              Sort:
            </span>
            <select
              id="results-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#222B25] border border-[#DCDACD] dark:border-white/15 text-xs font-semibold text-[#213A30] dark:text-[#F7F6F0] focus:outline-none focus:ring-1 focus:ring-[#B86A4B] cursor-pointer"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. 2-COLUMN GRID OF REMAINING PRODUCTS */}
      {remainingProducts.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between px-2 pt-2">
            <h4 className="font-serif font-bold text-lg sm:text-xl text-[#213A30] dark:text-[#F7F6F0]">
              Complementary Formulations
            </h4>
            <span className="text-xs text-[#68766C] dark:text-[#A6B0A5]">
              Showing {remainingProducts.length} more picks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingProducts.map((item, index) => (
              <ProductCard
                key={item.product.id}
                result={item}
                rank={index + 2}
                isCompared={comparedIds.includes(item.product.id)}
                onToggleCompare={handleToggleCompare}
                canCompare={comparedIds.length < 3}
                isFavorite={favorites.includes(item.product.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredAndSorted.length === 0 && (
        <div className="p-12 text-center rounded-3xl glass-card border border-[#DCDACD] dark:border-white/10 space-y-3 bg-white/70 dark:bg-white/[0.02]">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-serif font-bold text-lg text-[#213A30] dark:text-[#F7F6F0]">
            No matching products found
          </h4>
          <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] max-w-sm mx-auto">
            Try adjusting your category filter or resetting conversational refinement criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('all');
              setSortBy('match');
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#213A30] text-white hover:bg-[#14271F] dark:bg-white/10 dark:text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 6. SEARCH ANY PRODUCT ON OPEN BEAUTY FACTS (Live Lookups & Ingredient Avoid-Check) */}
      <motion.div variants={itemVariants}>
        <ProductLookupSection userAvoidList={requirements.avoidIngredients} />
      </motion.div>

      {/* 7. BOTTOM COMPARISON TRAY (When 1+ products selected) */}
      {comparedIds.length > 0 && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4"
        >
          <div className="p-3.5 sm:p-4 rounded-3xl glass-card bg-[#222B25]/95 border border-[#B86A4B]/50 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-2xl text-white">
            {/* Left Thumbnails & Counter */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center -space-x-2 overflow-hidden flex-shrink-0">
                {comparedResults.map((cr) => (
                  <div
                    key={cr.product.id}
                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center p-0.5"
                    title={cr.product.name}
                  >
                    <ProductVisual product={cr.product} size="sm" className="w-7 h-7" />
                  </div>
                ))}
              </div>

              <div className="min-w-0">
                <span className="text-xs font-bold text-white block">
                  {comparedIds.length} of 3 Selected
                </span>
                <span className="text-[10px] text-[#C7A77A] truncate block">
                  {comparedResults.map((r) => r.product.brand).join(', ')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setComparedIds([])}
                className="p-1.5 rounded-lg text-[#A6B0A5] hover:text-white hover:bg-white/10 transition-colors"
                title="Clear all selected"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                id="open-compare-modal-btn"
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 rounded-full font-bold text-xs text-[#213A30] bg-[#E2EADD] hover:bg-[#CAD8C8] shadow-md flex items-center gap-1.5 transition-all"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Compare ({comparedIds.length})</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <CompareModal
        results={comparedResults}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={handleRemoveCompare}
      />

      <ProfileCard
        traits={traits}
        topResults={results}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <RoutineBuilderModal
        results={routineResults}
        traits={traits}
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
      />
    </motion.div>
  );
}
