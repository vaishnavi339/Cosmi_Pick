'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface Props {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'fill';
  className?: string;
  showHoverEffect?: boolean;
  showAttribution?: boolean;
}

export function ProductVisual({
  product,
  size = 'md',
  className = '',
  showHoverEffect = true,
  showAttribution = true,
}: Props) {
  const [imageError, setImageError] = useState(false);

  // Soft brand-tinted palette for intentional non-photo fallback design
  const getBrandTint = (brand: string) => {
    const b = (brand || '').toLowerCase();
    if (b.includes('cerave') || b.includes('cetaphil') || b.includes('simple') || b.includes('klairs')) {
      return 'bg-[#F2F7F9] dark:bg-[#152026] border-[#D0E2EC] dark:border-[#243B47] text-[#1E3A4C] dark:text-[#D5E6F0]';
    }
    if (b.includes('minimalist') || b.includes('ordinary') || b.includes('paula')) {
      return 'bg-[#F8F5F2] dark:bg-[#211D1A] border-[#E5DDD4] dark:border-[#38312B] text-[#382F28] dark:text-[#EDE6DE]';
    }
    if (b.includes('plum') || b.includes('dot') || b.includes('laneige') || b.includes('foxtale')) {
      return 'bg-[#FAF3F4] dark:bg-[#25171F] border-[#EED4DC] dark:border-[#422533] text-[#4A2033] dark:text-[#F3DDE5]';
    }
    if (b.includes('cosrx') || b.includes('joseon') || b.includes('sheth') || b.includes('derma') || b.includes('equil')) {
      return 'bg-[#F6F7F3] dark:bg-[#1A2219] border-[#DCE4D5] dark:border-[#2D3D2B] text-[#2F3D2A] dark:text-[#DEE8D9]';
    }
    return 'bg-[#FAF6F3] dark:bg-[#211B1F] border-[#E8DDD4] dark:border-[#382B33] text-[#3B2932] dark:text-[#EFE2E8]';
  };

  // Aspect sizes
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-48 h-48 sm:w-60 sm:h-60',
    fill: 'w-full h-full aspect-square',
  };

  const hasImage = Boolean(product.image && !imageError);
  const brandTintClass = getBrandTint(product.brand);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 group/visual ${
        showHoverEffect ? 'hover:-translate-y-1 hover:shadow-soft-luxury' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Real Photography Slot on Clean White Rounded Tile */}
      {hasImage ? (
        <div className="relative w-full h-full rounded-2xl bg-white p-2.5 sm:p-3 border border-[#E8D3C0]/80 shadow-sm flex items-center justify-center overflow-hidden">
          <Image
            src={product.image!}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes={
              size === 'hero'
                ? '(max-width: 768px) 240px, 300px'
                : size === 'lg'
                ? '(max-width: 768px) 180px, 220px'
                : '(max-width: 768px) 140px, 180px'
            }
            loading="lazy"
            onError={() => setImageError(true)}
            className="object-contain p-2 rounded-xl transition-transform duration-300 group-hover/visual:scale-105"
          />

          {/* Attribution for Open Beauty Facts */}
          {showAttribution && (size === 'lg' || size === 'hero' || size === 'fill') && (
            <Link
              href="/credits"
              title="Photo: Open Beauty Facts contributors, CC BY-SA"
              className="absolute bottom-1 right-1.5 z-10 px-1.5 py-0.5 rounded bg-white/90 dark:bg-[#180F14]/90 backdrop-blur-xs text-[8px] sm:text-[9px] font-medium text-[#7E636E] dark:text-[#B59FA9] border border-[#E8D3C0]/50 hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors line-clamp-1 max-w-[90%]"
            >
              Photo: Open Beauty Facts (CC BY-SA)
            </Link>
          )}
        </div>
      ) : (
        /* Intentional Fallback Design: Soft brand-tinted tile, brand name, large serif title, product-type, Photo coming soon */
        <div
          className={`w-full h-full rounded-2xl ${brandTintClass} border p-3 sm:p-4 flex flex-col items-center justify-between text-center shadow-inner select-none transition-colors duration-200`}
        >
          {/* Top Brand Tag */}
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-80 line-clamp-1">
            {product.brand}
          </span>

          {/* Large Serif Product Title */}
          <div className="my-auto py-1 w-full px-1">
            <h4
              className={`font-serif font-bold text-[#3B1F2B] dark:text-[#FAF3F0] line-clamp-2 leading-snug ${
                size === 'sm'
                  ? 'text-[10px]'
                  : size === 'md'
                  ? 'text-xs sm:text-sm'
                  : 'text-sm sm:text-base'
              }`}
            >
              {product.name}
            </h4>
          </div>

          {/* Bottom Row: Product Category & Photo Coming Soon Note */}
          <div className="flex flex-col items-center gap-0.5 w-full">
            <span className="inline-block text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/80 dark:bg-white/10 border border-current/20 opacity-90 line-clamp-1">
              {product.category}
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#7E636E] dark:text-[#B59FA9] font-medium tracking-wide">
              Photo coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
