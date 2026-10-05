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
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({});

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

  // Keep each routine step in its own category and let the user choose an alternative.
  const getProductForStep = (key: string, candidates: RecommendationResult[]) =>
    candidates.find((candidate) => candidate.product.id === selectedProducts[key]) || candidates[0] || null;

  const amSteps = [
    {
      step: 1,
      role: 'Cleanse & Refresh',
      time: '1 minute',
      instructions: 'Wash with lukewarm water and a pea-sized amount. Pat dry gently with a clean towel—never rub.',
      key: 'am-cleanser', candidates: cleansers, product: getProductForStep('am-cleanser', cleansers),
    },
    {
      step: 2,
      role: 'Calibrate & Target',
      time: '2–3 drops',
      instructions: 'Press 2–3 drops onto slightly damp skin. Pat across your T-zone and cheeks until fully absorbed.',
      key: 'am-serum', candidates: serums, product: getProductForStep('am-serum', serums),
    },
    {
      step: 3,
      role: 'Seal Barrier Moisture',
      time: 'Dime-sized amount',
      instructions: 'Smooth over face and neck to lock in active hydration and protect against daily moisture loss.',
      key: 'am-moisturizer', candidates: moisturizers, product: getProductForStep('am-moisturizer', moisturizers),
    },
    {
      step: 4,
      role: 'Broad Spectrum Defense',
      time: 'Two finger lengths',
      instructions: 'Generously apply across face, ears, and neck 15 minutes before heading outdoors. Reapply every 2 hours.',
      key: 'am-sunscreen', candidates: sunscreens, product: getProductForStep('am-sunscreen', sunscreens),
    },
  ];

  const pmSteps = [
    {
      step: 1,
      role: 'Purify Daily Buildup',
      time: '1–2 minutes',
      instructions: 'Gently dissolve sunscreen, excess sebum, and environmental pollution without stripping natural barrier lipids.',
      key: 'pm-cleanser', candidates: cleansers, product: getProductForStep('pm-cleanser', cleansers),
    },
    {
      step: 2,
      role: 'Night Treatment & Renewal',
      time: '3–4 drops',
      instructions: 'Apply your restorative active treatment while cell turnover peaks during sleep. Wait 60 seconds before moisturizing.',
      key: 'pm-serum', candidates: serums, product: getProductForStep('pm-serum', serums),
    },
    {
      step: 3,
      role: 'Overnight Barrier Recovery',
      time: 'Nickel-sized amount',
      instructions: 'Seal skin with ceramides and calming botanicals to prevent nocturnal transepidermal water loss.',
      key: 'pm-moisturizer', candidates: moisturizers, product: getProductForStep('pm-moisturizer', moisturizers),
    },
  ];

  const activeSteps = activeTab === 'am' ? amSteps : pmSteps;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111B15]/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl rounded-3xl glass-card bg-[#F7F6F0] dark:bg-[#1E2822] border border-[#DCDACD] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#DCDACD]/70 dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E2EADD] dark:bg-[#213A30] border border-[#DCDACD] flex items-center justify-center text-[#213A30] dark:text-[#E2EADD]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="routine-modal-title" className="font-serif font-bold text-xl text-[#213A30] dark:text-[#F7F6F0]">
                Your Custom AM / PM Routine
              </h3>
              <p className="text-xs text-[#68766C] dark:text-[#A6B0A5]">
                Calibrated for your {traits.faceShape.value} face shape & {traits.skinTone.value} skin tone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close routine modal"
            className="p-2 rounded-full border border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] hover:bg-[#E2EADD]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AM / PM Tab Switcher */}
        <div className="px-6 py-3.5 border-b border-[#DCDACD]/60 dark:border-white/10 bg-[#F7F6F0]/50 dark:bg-white/[0.01] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('am')}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'am'
                  ? 'bg-[#213A30] text-white shadow-soft-luxury dark:bg-[#E2EADD] dark:text-[#213A30]'
                  : 'bg-white/80 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] border border-[#DCDACD] dark:border-white/10 hover:bg-[#E2EADD]/30'
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
                  ? 'bg-[#213A30] text-white shadow-soft-luxury dark:bg-[#E2EADD] dark:text-[#213A30]'
                  : 'bg-white/80 dark:bg-white/5 text-[#68766C] dark:text-[#A6B0A5] border border-[#DCDACD] dark:border-white/10 hover:bg-[#E2EADD]/30'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-forest-400" />
              <span>Evening Ritual (PM)</span>
            </button>
          </div>

          <span className="hidden sm:inline text-xs font-medium text-[#68766C] dark:text-[#A6B0A5]">
            {activeTab === 'am' ? '4 Simple Steps' : '3 Restorative Steps'}
          </span>
        </div>

        {/* Routine Steps Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSteps.map((stepItem) => {
            const { step, role, time, instructions, product, key, candidates } = stepItem;
            return (
              <div
                key={step}
                className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-white/[0.03] border border-[#DCDACD] dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                {/* Left: Step Badge & Product Photography Slot */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#E2EADD]/50 dark:bg-[#213A30]/60 border border-[#DCDACD] flex items-center justify-center font-serif font-bold text-lg text-[#213A30] dark:text-[#F7F6F0] flex-shrink-0">
                    {step}
                  </div>

                  {product && <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#DCDACD]/60 dark:border-white/10 flex-shrink-0">
                    <ProductVisual product={product.product} size="fill" />
                  </div>}

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B86A4B] dark:text-[#C7A77A] block">
                      Step {step} • {role}
                    </span>
                    {product ? <>
                      <h4 className="font-serif font-bold text-base text-[#213A30] dark:text-[#F7F6F0] truncate">{product.product.name}</h4>
                      <span className="text-xs text-[#68766C] dark:text-[#A6B0A5]">{product.product.brand} • {formatINR(product.product.priceINR)}</span>
                      {candidates.length > 1 && <select aria-label={`Choose ${role} product`} value={product.product.id} onChange={(event) => setSelectedProducts((current) => ({ ...current, [key]: event.target.value }))} className="mt-2 block max-w-full rounded-lg border border-[#DCDACD] bg-white px-2 py-1 text-xs text-[#213A30]">
                        {candidates.map((candidate) => <option key={candidate.product.id} value={candidate.product.id}>{candidate.product.brand} — {candidate.product.name}</option>)}
                      </select>}
                    </> : <p className="text-sm text-[#68766C]">No matching {role.toLowerCase()} in this product list yet.</p>}
                  </div>
                </div>

                {/* Right: Application Guidance & Dosage */}
                <div className="sm:max-w-xs space-y-1.5 border-t sm:border-t-0 sm:border-l border-[#DCDACD]/60 dark:border-white/10 pt-3 sm:pt-0 sm:pl-6 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#213A30] dark:text-[#F7F6F0]">
                    <Clock className="w-3.5 h-3.5 text-[#71896C]" />
                    <span>Dose: {time}</span>
                  </div>
                  <p className="text-[#68766C] dark:text-[#A6B0A5] leading-relaxed">
                    {instructions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DCDACD]/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#71896C] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Formulation harmony verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[#DCDACD] dark:border-white/10 text-[#213A30] dark:text-[#F7F6F0] hover:bg-[#E2EADD]/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Routine</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#213A30] dark:bg-[#E2EADD] dark:text-[#213A30] shadow-sm"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
