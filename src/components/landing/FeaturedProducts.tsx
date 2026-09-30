'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { ProductVisual } from '@/components/common/ProductVisual';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Take top curated products across categories
  const featured = (productsData as Product[]).slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Drag-to-scroll mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for smooth drag feel
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      id="featured"
      className="py-20 sm:py-24 relative isolate overflow-clip scroll-mt-24 bg-[#FBF7F4] dark:bg-[#180F14] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4D9D6]/60 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold text-[#CE7F79] dark:text-[#F4D9D6] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Formulations</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#3B1F2B] dark:text-[#FAF3F0] tracking-tight">
              Curated Formulations Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
              Thoughtful formulations matched to skin concerns and ingredient preferences. Suggestions, not medical advice. Drag or scroll to browse.
            </p>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-3 rounded-full bg-white dark:bg-[#20151C] border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/40 shadow-sm transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-3 rounded-full bg-white dark:bg-[#20151C] border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/40 shadow-sm transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Drag/Scroll Carousel Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="min-w-[280px] sm:min-w-[320px] max-w-[320px] rounded-3xl glass-card bg-white/85 dark:bg-[#20151C]/85 border border-[#E8D3C0] dark:border-white/10 p-5 shadow-soft-luxury hover:shadow-luxury-hover transition-shadow duration-300 flex flex-col justify-between group flex-shrink-0"
            >
              <div>
                {/* 1:1 Product Photography Slot with Hover Image Zoom */}
                <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-[#FBF7F4] to-[#FAF5F0] dark:from-white/[0.02] dark:to-transparent border border-[#E8D3C0]/40 dark:border-white/5 flex items-center justify-center p-3 mb-4 overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#180F14]/95 text-[#3B1F2B] dark:text-[#FAF3F0] border border-[#E8D3C0] dark:border-white/10 shadow-sm z-10">
                      {product.badge}
                    </span>
                  )}
                  {/* Inner image container with zoom effect */}
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-108">
                    <ProductVisual product={product} size="fill" showHoverEffect={false} />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9]">
                    {product.brand}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0] line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </div>

                {/* Category & Demo Rating */}
                <div className="flex items-center justify-between text-xs text-[#7E636E] dark:text-[#B59FA9] pt-3">
                  <span className="font-medium text-[#CE7F79] dark:text-[#D9B99B]">
                    {product.category}
                  </span>
                  <div className="text-[11px] font-medium text-[#7E636E] dark:text-[#B59FA9]">
                    Catalog score: <span className="font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">{product.rating}</span> <span className="text-[9px] text-[#CE7F79]">(demo data)</span>
                  </div>
                </div>
              </div>

              {/* Price & Buy/Scan Action */}
              <div className="pt-4 mt-4 border-t border-[#E8D3C0]/60 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7E636E] dark:text-[#B59FA9] block">
                    Price <span className="text-[9px] text-[#CE7F79]">(demo data)</span>
                  </span>
                  <span className="font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0]">
                    {formatINR(product.priceINR)}
                  </span>
                </div>

                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_4px_12px_rgba(59,31,43,0.25)] hover:shadow-[0_6px_16px_rgba(59,31,43,0.35)] transition-all"
                >
                  <span>Match with Face</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
