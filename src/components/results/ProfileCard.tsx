'use client';

import React, { useRef, useState } from 'react';
import { Download, Sparkles, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toPng } from 'html-to-image';
import { ExtractedFaceTraits, RecommendationResult } from '@/types';
import { formatINR } from '@/lib/utils';

interface Props {
  traits: ExtractedFaceTraits;
  topResults: RecommendationResult[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileCard({ traits, topResults, isOpen, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const top3 = topResults.slice(0, 3);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F7F6F0',
      });

      const link = document.createElement('a');
      link.download = `CosmicPick-Dermal-Profile-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export profile card as PNG:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-card-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17201B]/70 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-3xl glass-card border border-[#DCDACD] dark:border-white/15 bg-[#F7F6F0] dark:bg-[#222B25] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#DCDACD] dark:border-white/10 flex items-center justify-between bg-white/60 dark:bg-white/[0.02]">
          <span className="text-xs font-bold text-[#B86A4B] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Shareable Dermal Profile
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile card modal"
            className="p-1.5 rounded-full text-[#68766C] dark:text-[#A6B0A5] hover:text-[#213A30] hover:bg-[#E2EADD]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          
          {/* Exportable Profile Card (Target for html-to-image) */}
          <div
            ref={cardRef}
            className="w-full max-w-md rounded-3xl p-6 bg-gradient-to-b from-[#F7F6F0] via-[#F7F6F0] to-[#E2EADD]/40 border-2 border-[#DCDACD] shadow-soft-luxury relative overflow-hidden text-[#213A30] space-y-6"
          >
            {/* Header: CosmicPick Seal */}
            <div className="flex items-center justify-between border-b border-[#DCDACD] pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#213A30] flex items-center justify-center text-[#E2EADD]">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 id="profile-card-modal-title" className="font-serif font-bold text-lg text-[#213A30] leading-tight">
                    CosmicPick
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#B86A4B] font-bold block">
                    Personalized Dermal Profile
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#68766C] block font-mono">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-[9px] text-[#405C45] font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3 h-3 text-[#71896C]" />
                  Verified Private
                </span>
              </div>
            </div>

            {/* Traits Summary */}
            <div className="grid grid-cols-3 gap-2.5 relative z-10">
              <div className="p-3 rounded-2xl bg-white/80 border border-[#DCDACD] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#68766C] block mb-0.5">
                  Face Shape
                </span>
                <span className="font-serif font-bold text-sm text-[#213A30] capitalize">
                  {traits.faceShape.value}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 border border-[#DCDACD] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#68766C] block mb-0.5">
                  Skin Tone
                </span>
                <span className="font-serif font-bold text-sm text-[#213A30] capitalize">
                  {traits.skinTone.value}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 border border-[#DCDACD] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#68766C] block mb-0.5">
                  Undertone
                </span>
                <span className="font-serif font-bold text-sm text-[#213A30] capitalize">
                  {traits.skinUndertone?.value || (traits as any).undertone?.value || 'Neutral'}
                </span>
              </div>
            </div>

            {/* Primary Concerns */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#DCDACD] relative z-10 text-xs space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#68766C] block">
                Primary Dermal Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {traits.visibleConcerns.map((vc) => (
                  <span
                    key={vc.concern}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      vc.level === 'high'
                        ? 'bg-[#E2EADD] text-[#54715C] border-[#B86A4B]'
                        : vc.level === 'moderate'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-[#D4E2D2]/50 text-[#405C45] border-[#71896C]'
                    }`}
                  >
                    {vc.label}: {vc.level}
                  </span>
                ))}
              </div>
            </div>

            {/* Top 3 Product Matches */}
            <div className="space-y-2.5 relative z-10">
              <span className="text-[10px] uppercase font-bold text-[#68766C] block tracking-wider">
                Top 3 Calibrated Formulations
              </span>

              {top3.map((rec, index) => (
                <div
                  key={rec.product.id}
                  className="p-3 rounded-2xl bg-white/90 border border-[#DCDACD] flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#213A30] text-[#E2EADD] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#213A30] truncate">
                        {rec.product.name}
                      </p>
                      <span className="text-[10px] text-[#68766C]">
                        {rec.product.brand} • {formatINR(rec.product.priceINR)}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#405C45] bg-[#D4E2D2]/50 px-2 py-0.5 rounded-full border border-[#71896C] flex-shrink-0">
                    {rec.matchScore}%
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="pt-2 border-t border-[#DCDACD] text-center relative z-10 text-[9px] text-[#68766C] leading-tight">
              Personalized cosmetic guidance • Demo data • cosmicpick.com
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-[#DCDACD] dark:border-white/10 bg-white/60 dark:bg-white/[0.02] flex items-center justify-between gap-4">
          <p className="text-xs text-[#68766C] dark:text-[#A6B0A5]">
            {downloadSuccess ? 'Card downloaded!' : 'Export high-res card to share or save'}
          </p>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-full font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] shadow-soft-luxury text-xs flex items-center gap-2 transition-all"
          >
            {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-amber-300" /> : <Download className="w-4 h-4" />}
            <span>{downloading ? 'Rendering Card...' : downloadSuccess ? 'Downloaded!' : 'Download Profile Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
