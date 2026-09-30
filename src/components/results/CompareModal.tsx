'use client';

import React, { useEffect } from 'react';
import { X, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import { RecommendationResult } from '@/types';
import { ProductVisual } from '@/components/common/ProductVisual';
import { formatINR } from '@/lib/utils';

interface Props {
  results: RecommendationResult[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function CompareModal({ results, isOpen, onClose, onRemove }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#180F14]/70 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl rounded-3xl glass-card border border-[#E8D3C0] dark:border-white/15 bg-[#FBF7F4] dark:bg-[#20151C] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8D3C0] dark:border-white/10 flex items-center justify-between bg-white/60 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F4D9D6] dark:bg-white/10 text-[#CE7F79] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#CE7F79]" />
            </div>
            <div>
              <h3 id="compare-modal-title" className="font-serif font-bold text-lg sm:text-xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                Side-by-Side Product Comparison
              </h3>
              <p className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                Comparing {results.length} formulation{results.length > 1 ? 's' : ''} against your facial profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison modal"
            className="p-2 rounded-full border border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B] hover:bg-[#F4D9D6]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table / Grid */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="min-w-[600px] grid grid-cols-4 gap-4">
            
            {/* Row 1: Attribute Labels Column */}
            <div className="space-y-6 pt-24 text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] border-r border-[#E8D3C0] dark:border-white/10 pr-4">
              <div className="h-10 flex items-center">Match Compatibility</div>
              <div className="h-8 flex items-center">Price & Volume</div>
              <div className="h-8 flex items-center">Rating & Reviews</div>
              <div className="h-8 flex items-center">Formulation Type</div>
              <div className="h-20 flex items-center">Key Actives</div>
              <div className="h-16 flex items-center">Targeted Concerns</div>
              <div className="h-12 flex items-center">Avoid Flags</div>
              <div className="h-12 flex items-center">Purchase Action</div>
            </div>

            {/* Product Columns (up to 3) */}
            {results.map((item) => {
              const { product, matchScore } = item;
              return (
                <div
                  key={product.id}
                  className="space-y-6 p-4 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 relative flex flex-col shadow-sm"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    aria-label={`Remove ${product.name} from comparison`}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-[#7E636E] hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Product Header */}
                  <div className="h-20 flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#E8D3C0] dark:border-white/10 flex items-center justify-center bg-[#FAF5F0] dark:bg-white/5">
                      <ProductVisual product={product} size="sm" className="w-12 h-12" />
                    </div>
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-[#7E636E] dark:text-[#B59FA9] uppercase tracking-wider block">
                        {product.brand}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#3B1F2B] dark:text-[#FAF3F0] line-clamp-2">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  {/* Match Compatibility */}
                  <div className="h-10 flex items-center">
                    <span className="px-3 py-1 rounded-full bg-[#C9D6C3]/40 border border-[#8CA583]/40 text-[#44633B] dark:text-[#C9D6C3] font-bold text-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {matchScore}% Match
                    </span>
                  </div>

                  {/* Price & Volume */}
                  <div className="h-8 flex items-center">
                    <span className="font-serif font-bold text-[#3B1F2B] dark:text-[#FAF3F0] text-sm">
                      {formatINR(product.priceINR)}
                    </span>
                    <span className="text-[10px] text-[#CE7F79] ml-1">(demo)</span>
                    <span className="text-xs text-[#7E636E] dark:text-[#B59FA9] ml-1.5">({product.volumeOrWeight})</span>
                  </div>

                  {/* Rating */}
                  <div className="h-8 flex items-center text-xs text-[#7E636E] dark:text-[#B59FA9] gap-1">
                    <span>Score: <strong className="text-[#3B1F2B] dark:text-[#FAF3F0]">{product.rating}</strong></span>
                    <span className="text-[10px] text-[#CE7F79]">(demo)</span>
                  </div>

                  {/* Category */}
                  <div className="h-8 flex items-center text-xs font-semibold text-[#CE7F79] dark:text-[#D9B99B]">
                    {product.category}
                  </div>

                  {/* Key Actives */}
                  <div className="h-20 flex items-center">
                    <div className="flex flex-wrap gap-1">
                      {product.keyIngredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2 py-0.5 rounded-lg bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[11px] text-[#3B1F2B] dark:text-[#FAF3F0]"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Targeted Concerns */}
                  <div className="h-16 flex items-center">
                    <div className="flex flex-wrap gap-1">
                      {product.targetedConcerns.map((tc) => (
                        <span
                          key={tc}
                          className="px-2 py-0.5 rounded-lg bg-[#F4D9D6]/40 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[10px] text-[#3B1F2B] dark:text-[#FAF3F0] capitalize"
                        >
                          {tc.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Avoid Flags */}
                  <div className="h-12 flex items-center text-xs">
                    {product.avoidFlags.length === 0 ? (
                      <span className="text-[#8CA583] font-semibold">Clean • 0 Avoid Flags</span>
                    ) : (
                      <span className="text-rose-600 font-semibold text-[11px]">
                        Contains: {product.avoidFlags.join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Purchase Action */}
                  <div className="h-12 flex items-center">
                    <a
                      href={product.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] transition-colors"
                    >
                      <span>Buy Direct</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8D3C0] dark:border-white/10 bg-white/60 dark:bg-white/[0.02] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E8D3C0] dark:bg-white/10 text-[#3B1F2B] dark:text-white hover:bg-[#D9B99B] transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
