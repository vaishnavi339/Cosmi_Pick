'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  PackageX,
  HelpCircle,
} from 'lucide-react';
import { checkAvoidIngredients, detectActives, AvoidMatch, DetectedActive } from '@/lib/ingredient-checker';

interface SearchResultItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  imageGallery?: string[];
  barcode: string;
  ingredientsText: string;
  category: string;
  source: 'local_catalog' | 'open_beauty_facts';
  obfUrl?: string;
  imageContributor?: string;
  imageLicense?: string;
}

interface Props {
  userAvoidList?: string[];
}

export function ProductLookupSection({ userAvoidList = ['fragrance', 'parabens', 'sulfates', 'alcohol'] }: Props) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Manual ingredient paste fallback
  const [manualInputOpen, setManualInputOpen] = useState(false);
  const [manualText, setManualText] = useState('');
  const [manualAnalysis, setManualAnalysis] = useState<{
    passed: boolean;
    matches: AvoidMatch[];
    actives: DetectedActive[];
  } | null>(null);

  // Expandable ingredients drawer for each result
  const [expandedIngredients, setExpandedIngredients] = useState<Record<string, boolean>>({});
  const [activePhotos, setActivePhotos] = useState<Record<string, number>>({});

  const toggleExpand = (id: string) => {
    setExpandedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setSearchError('Search query must be at least 3 characters.');
      return;
    }
    if (trimmed.length > 80) {
      setSearchError('Search query must not exceed 80 characters.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);
    setManualAnalysis(null);

    try {
      const res = await fetch(`/api/product-lookup?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setSearchError(data.message || 'Lookup failed. Please try again.');
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setSearchError('Network error connecting to Open Beauty Facts. Please check your connection.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualAnalyze = () => {
    if (!manualText.trim()) return;
    const check = checkAvoidIngredients(manualText, userAvoidList);
    const actives = detectActives(manualText);
    setManualAnalysis({
      passed: check.passed,
      matches: check.matches,
      actives,
    });
  };

  return (
    <section className="p-6 sm:p-8 rounded-3xl glass-card bg-white/85 dark:bg-[#1E2822]/90 border border-[#DCDACD] dark:border-white/10 shadow-soft-luxury space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCDACD]/60 dark:border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-semibold text-[#416A57] dark:text-[#E2EADD] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Product Photos & Ingredient Lookup</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#213A30] dark:text-[#F7F6F0]">
            Search Any Cosmetic Product
          </h3>
          <p className="text-xs sm:text-sm text-[#68766C] dark:text-[#A6B0A5] mt-1 max-w-xl">
            Search a skincare product to see its real package photo, photo credit, source, and available ingredients. Results come from the community-curated Open Beauty Facts catalog.
          </p>
        </div>

        {/* User Avoid List summary */}
        <div className="p-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.03] border border-[#DCDACD]/60 dark:border-white/5 text-right sm:text-left flex-shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#68766C] dark:text-[#A6B0A5] block mb-1">
            Your Avoid List ({userAvoidList.length})
          </span>
          <div className="flex flex-wrap gap-1 max-w-xs">
            {userAvoidList.map((item) => (
              <span
                key={item}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-white/10 text-[#213A30] dark:text-[#F7F6F0] border border-[#DCDACD]/80 dark:border-white/10 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input Bar (Submit on button / enter, no search-as-you-type) */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#68766C] dark:text-[#A6B0A5] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="product-lookup-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (searchError) setSearchError(null);
            }}
            placeholder="Search by brand, product name, or barcode (e.g. 'CeraVe Hydrating', 'The Ordinary', '3606000537576')..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.04] border border-[#DCDACD] dark:border-white/10 text-xs sm:text-sm text-[#213A30] dark:text-[#F7F6F0] placeholder:text-[#68766C]/60 focus:outline-none focus:ring-2 focus:ring-[#B86A4B] transition-all"
          />
        </div>

        <button
          id="product-lookup-submit-btn"
          type="submit"
          disabled={isSearching || query.trim().length < 3}
          className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] text-xs shadow-soft-luxury transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
        >
          {isSearching ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Searching products...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Search Product</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Searches */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
        <span className="text-[#68766C] dark:text-[#A6B0A5] text-[11px] font-medium">Try searching:</span>
        {['CeraVe Hydrating', 'The Ordinary Caffeine', 'Cetaphil Cleanser', 'La Roche-Posay Cicaplast'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setQuery(term);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white hover:border-[#B86A4B]/50 text-[11px] transition-colors"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Validation Error Message */}
      {searchError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-[#DCDACD]/60 dark:border-white/10 animate-pulse flex gap-4 items-start"
            >
              <div className="w-20 h-20 rounded-xl bg-[#F7F6F0] dark:bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-3 w-24 bg-[#DCDACD]/40 rounded" />
                <div className="h-4 w-3/4 bg-[#DCDACD]/60 rounded" />
                <div className="h-3 w-1/2 bg-[#DCDACD]/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results List */}
      {!isSearching && hasSearched && results.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs text-[#68766C] dark:text-[#A6B0A5]">
            <span className="font-semibold text-[#213A30] dark:text-[#F7F6F0]">
              Found {results.length} photographed result{results.length === 1 ? '' : 's'} in Open Beauty Facts
            </span>
            <span className="text-[11px] italic">Ingredients data from Open Beauty Facts (ODbL)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((item) => {
              const avoidCheck = checkAvoidIngredients(item.ingredientsText, userAvoidList);
              const actives = detectActives(item.ingredientsText);
              const isExpanded = expandedIngredients[item.id] || false;
              const photos = [item.imageUrl, ...(item.imageGallery || [])].filter(Boolean);
              const activePhoto = Math.min(activePhotos[item.id] || 0, Math.max(0, photos.length - 1));

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#DCDACD] dark:border-white/10 shadow-sm transition-all hover:border-[#71896C]/60 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Clean White Rounded Tile for Image */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white border border-[#DCDACD]/80 p-2 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                      {item.imageUrl ? (
                        <Image
                          src={photos[activePhoto]}
                          alt={`${item.brand} ${item.name}, product photo ${activePhoto + 1} of ${photos.length}`}
                          fill
                          sizes="128px"
                          loading="lazy"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-[9px] uppercase font-bold text-[#68766C] block">Photo</span>
                          <span className="text-[8px] text-[#A6B0A5]">Unavailable</span>
                        </div>
                      )}
                      {photos.length > 1 && (
                        <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-between rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                          <button
                            type="button"
                            aria-label="Show previous product photo"
                            onClick={() => setActivePhotos((state) => ({ ...state, [item.id]: (activePhoto - 1 + photos.length) % photos.length }))}
                            className="text-[#213A30] hover:text-[#B86A4B]"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[9px] font-semibold tabular-nums text-[#213A30]">{activePhoto + 1} / {photos.length}</span>
                          <button
                            type="button"
                            aria-label="Show next product photo"
                            onClick={() => setActivePhotos((state) => ({ ...state, [item.id]: (activePhoto + 1) % photos.length }))}
                            className="text-[#213A30] hover:text-[#B86A4B]"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Specs */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#68766C] dark:text-[#A6B0A5]">
                          {item.brand}
                        </span>
                        {item.barcode && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] text-[#68766C] dark:text-[#A6B0A5] font-mono">
                            Barcode: {item.barcode}
                          </span>
                        )}
                        <span className="text-[10px] text-[#B86A4B] dark:text-[#C7A77A] font-medium">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#213A30] dark:text-[#F7F6F0] mt-1 leading-snug">
                        {item.name}
                      </h4>

                      {/* Avoid List Compatibility Badge */}
                      <div className="mt-3">
                        {item.ingredientsText ? (
                          avoidCheck.passed ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>Passed Avoid Check: Clean of all avoided ingredients in your profile.</span>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span>Contains {avoidCheck.warningCount} avoided ingredient{avoidCheck.warningCount === 1 ? '' : 's'}:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pl-6">
                                {avoidCheck.matches.map((m, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-white dark:bg-black/30 border border-amber-300 dark:border-amber-700 text-[11px] font-medium"
                                  >
                                    {m.ruleLabel}: <strong className="underline">{m.matchedIngredient}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            <span>Ingredients not yet transcribed in Open Beauty Facts for this barcode.</span>
                          </div>
                        )}
                      </div>

                      {/* Matched Actives */}
                      {actives.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#405C45] dark:text-[#A7C19E] block mb-1">
                            Detected Beneficial Actives:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {actives.map((act) => (
                              <div
                                key={act.id}
                                className="group/tip relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF2E8] dark:bg-[#71896C]/15 border border-[#D4E2D2] dark:border-[#71896C]/30 text-[11px] font-semibold text-[#405C45] dark:text-[#D4E2D2] cursor-help"
                              >
                                <Sparkles className="w-3 h-3 text-[#6A9460]" />
                                <span>{act.name}</span>
                                <HelpCircle className="w-3 h-3 text-[#71896C] opacity-60 group-hover/tip:opacity-100" />

                                {/* Active Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block z-30 w-56 p-2 rounded-xl bg-[#222B25] text-white text-[10px] leading-tight shadow-xl border border-white/10 pointer-events-none">
                                  <span className="font-bold block text-[#F7F6F0] mb-0.5">{act.name}</span>
                                  <span className="text-[#C7A77A]">{act.tagline}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Full Ingredients Drawer */}
                  {item.ingredientsText && (
                    <div className="pt-2 border-t border-[#DCDACD]/40 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] dark:hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#B86A4B]" />
                          <span>Full Ingredient Listing</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#F7F6F0] dark:bg-white/[0.02] border border-[#DCDACD]/60 dark:border-white/5 text-[11px] text-[#68766C] dark:text-[#A6B0A5] leading-relaxed max-h-48 overflow-y-auto font-mono">
                          {item.ingredientsText}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Photo and product data attribution */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-[#68766C] dark:text-[#A6B0A5] pt-2 border-t border-[#DCDACD]/30 dark:border-white/5">
                    <span>
                      Photo: {item.imageContributor || 'Open Beauty Facts contributors'} · {item.imageLicense || 'CC BY-SA'}
                    </span>
                    {item.obfUrl && (
                      <a
                        href={item.obfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#213A30] dark:hover:text-white font-medium transition-colors"
                      >
                        <span>Photo & product source: Open Beauty Facts</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-[#68766C]/80 dark:text-[#A6B0A5]/80">
                    Product and ingredient database: Open Beauty Facts (ODbL). Community photo license: CC BY-SA.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Friendly Empty State with Manual Ingredients Paste Option */}
      {!isSearching && hasSearched && results.length === 0 && !searchError && (
        <div className="p-8 text-center rounded-3xl bg-[#F7F6F0] dark:bg-white/[0.02] border border-[#DCDACD] dark:border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 flex items-center justify-center mx-auto text-[#68766C]">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#213A30] dark:text-[#F7F6F0]">
              No exact match found for &ldquo;{query}&rdquo;
            </h4>
            <p className="text-xs text-[#68766C] dark:text-[#A6B0A5] max-w-md mx-auto mt-1 leading-relaxed">
              Open Beauty Facts is an open, community-curated database that is continuously growing. If your formulation isn&apos;t listed yet, you can paste its ingredient list below to run the same avoid-check.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setManualInputOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Ingredient List Manually</span>
          </button>
        </div>
      )}

      {/* Manual Ingredient Paste Drawer / Toggle */}
      <div className="pt-2 border-t border-[#DCDACD]/50 dark:border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#68766C] dark:text-[#A6B0A5]">
            Have an unlisted product or bottle at hand?
          </span>
          <button
            type="button"
            onClick={() => setManualInputOpen(!manualInputOpen)}
            className="text-xs font-semibold text-[#416A57] dark:text-[#E2EADD] hover:underline flex items-center gap-1"
          >
            <span>{manualInputOpen ? 'Hide Manual Checker' : 'Paste Ingredients Manually'}</span>
            {manualInputOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {manualInputOpen && (
          <div className="mt-4 p-5 rounded-2xl bg-[#F7F6F0] dark:bg-white/[0.02] border border-[#DCDACD] dark:border-white/10 space-y-3">
            <label
              htmlFor="manual-ingredients-textarea"
              className="block text-xs font-bold uppercase tracking-wider text-[#213A30] dark:text-[#F7F6F0]"
            >
              Paste Ingredients Text:
            </label>
            <textarea
              id="manual-ingredients-textarea"
              rows={4}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. Water, Glycerin, Niacinamide, Cetearyl Alcohol, Dimethicone, Methylparaben, Fragrance, Ceramide NP..."
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs text-[#213A30] dark:text-[#F7F6F0] placeholder:text-[#68766C]/60 focus:outline-none focus:ring-1 focus:ring-[#B86A4B] font-mono leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleManualAnalyze}
                disabled={!manualText.trim()}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] disabled:opacity-40 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Ingredients</span>
              </button>
            </div>

            {/* Manual Analysis Output */}
            {manualAnalysis && (
              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-[#DCDACD] dark:border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#213A30] dark:text-[#F7F6F0]">
                  Analysis Results:
                </div>

                {manualAnalysis.passed ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Passed Avoid Check: Clean of all avoided ingredients in your profile.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Contains avoided ingredients:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {manualAnalysis.matches.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-black/30 border border-amber-300 dark:border-amber-700 text-[11px] font-medium"
                        >
                          {m.ruleLabel}: <strong className="underline">{m.matchedIngredient}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {manualAnalysis.actives.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#405C45] dark:text-[#A7C19E] block mb-1">
                      Detected Actives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {manualAnalysis.actives.map((act) => (
                        <div
                          key={act.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF2E8] dark:bg-[#71896C]/15 border border-[#D4E2D2] dark:border-[#71896C]/30 text-[11px] font-semibold text-[#405C45] dark:text-[#D4E2D2]"
                          title={`${act.name}: ${act.tagline}`}
                        >
                          <Sparkles className="w-3 h-3 text-[#6A9460]" />
                          <span>{act.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
