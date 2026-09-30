'use client';

import React, { useState } from 'react';
import {
  Droplets,
  Sun,
  Sparkles,
  Wind,
  Heart,
  Flower2,
  Package,
} from 'lucide-react';
import { Product } from '@/types';

interface Props {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'fill';
  className?: string;
  showHoverEffect?: boolean;
}

export function ProductVisual({
  product,
  size = 'md',
  className = '',
  showHoverEffect = true,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Category Icon Resolver
  const getCategoryIcon = (category: string) => {
    const c = (category || '').toLowerCase();
    if (c.includes('sunscreen') || c.includes('spf')) return Sun;
    if (c.includes('serum') || c.includes('ampoule')) return Droplets;
    if (c.includes('cleanser') || c.includes('wash')) return Wind;
    if (c.includes('moisturizer') || c.includes('cream') || c.includes('lotion')) return Flower2;
    if (c.includes('treatment') || c.includes('exfoliant')) return Sparkles;
    if (c.includes('eye')) return Heart;
    return Package;
  };

  const CategoryIcon = getCategoryIcon(product.category);

  // Aspect sizes
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-48 h-48 sm:w-60 sm:h-60',
    fill: 'w-full h-full aspect-square',
  };

  const hasImage = Boolean(product.image && !imageError);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 ${
        showHoverEffect ? 'hover:-translate-y-1 hover:shadow-soft-luxury' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Real Photography Slot */}
      {hasImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain p-2 rounded-2xl transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      )}

      {/* Neutral "Image Coming Soon" Luxury Fallback Tile */}
      {(!hasImage || !imageLoaded) && (
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#F4D9D6]/35 via-[#FBF7F4] to-[#E8D3C0]/30 dark:from-[#3B1F2B]/40 dark:via-[#24181E] dark:to-[#180F14] border border-[#E8D3C0]/70 dark:border-white/10 p-3 flex flex-col items-center justify-center text-center shadow-inner select-none">
          {/* Category Icon Badge */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-white/10 shadow-sm border border-[#E8D3C0]/50 dark:border-white/10 flex items-center justify-center mb-1.5 flex-shrink-0">
            <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B1F2B] dark:text-[#F4D9D6]" />
          </div>

          {/* Brand Name */}
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0] line-clamp-1 max-w-[90%]">
            {product.brand}
          </span>

          {/* Subtle Coming Soon Caption */}
          <span className="text-[9px] sm:text-[10px] text-[#7E636E] dark:text-[#B59FA9] font-medium tracking-wide mt-0.5">
            Image coming soon
          </span>
        </div>
      )}
    </div>
  );
}
