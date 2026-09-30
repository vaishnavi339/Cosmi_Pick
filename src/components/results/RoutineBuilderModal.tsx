'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sun,
  Moon,
  Sparkles,
  Clock,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { RecommendationResult, ExtractedFaceTraits } from '@/types';
import { ProductVisual } from '@/components/common/ProductVisual';
import { formatINR } from '@/lib/utils';

interface Props {
  results: RecommendationResult[];
  traits: ExtractedFaceTraits;
  isOpen: boolean;
  onClose: () => void;
}

export function RoutineBuilderModal({ results, traits, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'am' | 'pm'>('am');

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

  // Filter products by category into routine roles
  const cleansers = results.filter((r) =>
    r.product.category.toLowerCase().includes('cleanse')
  );
  const serums = results.filter((r) =>
    r.product.category.toLowerCase().includes('serum') ||
    r.product.category.toLowerCase().includes('treatment')
  );
  const moisturizers = results.filter((r) =>
    r.product.category.toLowerCase().includes('moistur') ||
    r.product.category.toLowerCase().includes('cream') ||
    r.product.category.toLowerCase().includes('gel')
  );
  const sunscreens = results.filter((r) =>
    r.product.category.toLowerCase().includes('sunscreen') ||
    r.product.category.toLowerCase().includes('spf')
  );

  // Fallback product picker if specific category missing
  const getProductForStep = (
    candidates: RecommendationResult[],
    fallbackIdx: number
  ) => {
    return candidates[0] || results[fallbackIdx % results.length];
  };

  const amSteps = [
    {
      step: 1,
      role: 'Cleanse & Refresh',
      time: '1 minute',
      instructions: 'Wash with lukewarm water and a pea-sized amount. Pat dry gently with a clean towel—never rub.',
      product: getProductForStep(cleansers, 0),
    },
    {
      step: 2,
      role: 'Calibrate & Target',
      time: '2–3 drops',
      instructions: 'Press 2–3 drops onto slightly damp skin. Pat across your T-zone and cheeks until fully absorbed.',
      product: getProductForStep(serums, 0),
    },
    {
      step: 3,
      role: 'Seal Barrier Moisture',
      time: 'Dime-sized amount',
      instructions: 'Smooth over face and neck to lock in active hydration and protect against daily moisture loss.',
      product: getProductForStep(moisturizers, 1),
    },
    {
      step: 4,
      role: 'Broad Spectrum Defense',
      time: 'Two finger lengths',
      instructions: 'Generously apply across face, ears, and neck 15 minutes before heading outdoors. Reapply every 2 hours.',
      product: getProductForStep(sunscreens, 2),
    },
  ];

  const pmSteps = [
    {
      step: 1,
      role: 'Purify Daily Buildup',
      time: '1–2 minutes',
      instructions: 'Gently dissolve sunscreen, excess sebum, and environmental pollution without stripping natural barrier lipids.',
      product: getProductForStep(cleansers, 0),
    },
    {
      step: 2,
      role: 'Night Treatment & Renewal',
      time: '3–4 drops',
      instructions: 'Apply your restorative active treatment while cell turnover peaks during sleep. Wait 60 seconds before moisturizing.',
      product: getProductForStep(serums, 1),
    },
    {
      step: 3,
      role: 'Overnight Barrier Recovery',
      time: 'Nickel-sized amount',
      instructions: 'Seal skin with ceramides and calming botanicals to prevent nocturnal transepidermal water loss.',
      product: getProductForStep(moisturizers, 2),
    },
  ];

  const activeSteps = activeTab === 'am' ? amSteps : pmSteps;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E0C15]/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl rounded-3xl glass-card bg-[#FBF7F4] dark:bg-[#1C1218] border border-[#E8D3C0] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8D3C0]/70 dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4D9D6] dark:bg-[#3B1F2B] border border-[#E8D3C0] flex items-center justify-center text-[#3B1F2B] dark:text-[#F4D9D6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="routine-modal-title" className="font-serif font-bold text-xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                Your Custom AM / PM Routine
              </h3>
              <p className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                Calibrated for your {traits.faceShape.value} face shape & {traits.skinTone.value} skin tone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close routine modal"
            className="p-2 rounded-full border border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] hover:bg-[#F4D9D6]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AM / PM Tab Switcher */}
        <div className="px-6 py-3.5 border-b border-[#E8D3C0]/60 dark:border-white/10 bg-[#FAF5F0]/50 dark:bg-white/[0.01] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('am')}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'am'
                  ? 'bg-[#3B1F2B] text-white shadow-soft-luxury dark:bg-[#F4D9D6] dark:text-[#3B1F2B]'
                  : 'bg-white/80 dark:bg-white/5 text-[#7E636E] dark:text-[#B59FA9] border border-[#E8D3C0] dark:border-white/10 hover:bg-[#F4D9D6]/30'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Morning Ritual (AM)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pm')}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'pm'
                  ? 'bg-[#3B1F2B] text-white shadow-soft-luxury dark:bg-[#F4D9D6] dark:text-[#3B1F2B]'
                  : 'bg-white/80 dark:bg-white/5 text-[#7E636E] dark:text-[#B59FA9] border border-[#E8D3C0] dark:border-white/10 hover:bg-[#F4D9D6]/30'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evening Ritual (PM)</span>
            </button>
          </div>

          <span className="hidden sm:inline text-xs font-medium text-[#7E636E] dark:text-[#B59FA9]">
            {activeTab === 'am' ? '4 Simple Steps' : '3 Restorative Steps'}
          </span>
        </div>

        {/* Routine Steps Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSteps.map((stepItem) => {
            const { step, role, time, instructions, product } = stepItem;
            return (
              <div
                key={step}
                className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                {/* Left: Step Badge & Product Photography Slot */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4D9D6]/50 dark:bg-[#3B1F2B]/60 border border-[#E8D3C0] flex items-center justify-center font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0] flex-shrink-0">
                    {step}
                  </div>

                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#E8D3C0]/60 dark:border-white/10 flex-shrink-0">
                    <ProductVisual product={product.product} size="fill" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#CE7F79] dark:text-[#D9B99B] block">
                      Step {step} • {role}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0] truncate">
                      {product.product.name}
                    </h4>
                    <span className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                      {product.product.brand} • {formatINR(product.product.priceINR)}
                    </span>
                  </div>
                </div>

                {/* Right: Application Guidance & Dosage */}
                <div className="sm:max-w-xs space-y-1.5 border-t sm:border-t-0 sm:border-l border-[#E8D3C0]/60 dark:border-white/10 pt-3 sm:pt-0 sm:pl-6 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                    <Clock className="w-3.5 h-3.5 text-[#8CA583]" />
                    <span>Dose: {time}</span>
                  </div>
                  <p className="text-[#7E636E] dark:text-[#B59FA9] leading-relaxed">
                    {instructions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8D3C0]/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#8CA583] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Formulation harmony verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Routine</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#3B1F2B] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-sm"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
