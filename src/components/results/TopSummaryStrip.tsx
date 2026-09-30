'use client';

import React from 'react';
import {
  Sparkles,
  Edit3,
  Sliders,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  RefreshCw,
  FileText,
  User,
  Info,
  Calendar,
} from 'lucide-react';
import { ExtractedFaceTraits, UserRequirements } from '@/types';

interface Props {
  traits: ExtractedFaceTraits;
  requirements: UserRequirements;
  onEditTraits?: () => void;
  onEditRequirements?: () => void;
  onOpenProfileCard?: () => void;
  onOpenRoutineBuilder?: () => void;
  onRestart?: () => void;
}

export function TopSummaryStrip({
  traits,
  requirements,
  onEditTraits,
  onEditRequirements,
  onOpenProfileCard,
  onOpenRoutineBuilder,
  onRestart,
}: Props) {
  const rawUndertone =
    traits.skinUndertone?.value || (traits as any).undertone?.value || 'neutral';
  const undertoneLabel =
    rawUndertone.charAt(0).toUpperCase() + rawUndertone.slice(1);
  const rawTone = traits.skinTone?.value || 'medium';
  const toneLabel =
    rawTone.charAt(0).toUpperCase() + rawTone.slice(1);
  const rawShape = traits.faceShape?.value || 'oval';
  const shapeLabel =
    rawShape.charAt(0).toUpperCase() + rawShape.slice(1);

  return (
    <div className="rounded-3xl glass-card bg-white/80 dark:bg-[#20151C]/80 border border-[#E8D3C0] dark:border-white/10 p-6 sm:p-8 shadow-soft-luxury relative overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#F4D9D6]/40 via-[#FAF5F0]/20 to-transparent rounded-full pointer-events-none -mr-16 -mt-16" />

      {/* Top Meta Bar: Status, Demo Badge, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E8D3C0]/60 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4D9D6]/60 dark:bg-[#3B1F2B]/50 border border-[#E8D3C0] dark:border-white/10 text-xs font-bold tracking-wide text-[#3B1F2B] dark:text-[#F4D9D6]">
            <Sparkles className="w-3.5 h-3.5 text-[#CE7F79]" />
            <span>Personalized Dermal Profile</span>
          </div>

          {/* Demo Data Label */}
          <span
            id="demo-data-badge"
            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF5F0] dark:bg-white/5 text-[#7E636E] dark:text-[#B59FA9] font-medium border border-[#E8D3C0] dark:border-white/10"
          >
            <Info className="w-3 h-3 text-[#CE7F79]" />
            Demo data
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenRoutineBuilder && (
            <button
              id="open-routine-builder-btn"
              type="button"
              onClick={onOpenRoutineBuilder}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] dark:hover:bg-[#E9BDB9] shadow-soft-luxury transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Build my AM/PM routine</span>
            </button>
          )}

          {onOpenProfileCard && (
            <button
              id="view-profile-card-btn"
              type="button"
              onClick={onOpenProfileCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] bg-white/70 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 hover:bg-[#F4D9D6]/30 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#CE7F79]" />
              <span className="hidden sm:inline">Profile Card</span>
            </button>
          )}

          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9] bg-white/50 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 hover:text-[#3B1F2B] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Scan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Strip: Traits & Requirements */}
      <div className="pt-5 space-y-4">
        {/* Row 1: Detected Traits */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#CE7F79]" />
              Detected Facial Profile:
            </span>
          </div>

          {onEditTraits && (
            <button
              id="edit-traits-btn"
              type="button"
              onClick={onEditTraits}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#CE7F79] hover:underline self-start sm:self-auto transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Traits</span>
            </button>
          )}
        </div>

        {/* Trait Chips Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Face Shape */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-medium text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8CA583]" />
            <span className="text-[#7E636E] dark:text-[#B59FA9] font-normal">Shape:</span>
            <span className="font-bold">{shapeLabel}</span>
          </div>

          {/* Skin Tone */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-medium text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10"
              style={{
                backgroundColor:
                  (traits.skinTone as any).hex ||
                  (traits.skinTone?.value === 'fair'
                    ? '#FCE5D8'
                    : traits.skinTone?.value === 'light'
                    ? '#F3C5A8'
                    : traits.skinTone?.value === 'medium'
                    ? '#D49D78'
                    : traits.skinTone?.value === 'tan'
                    ? '#A66B44'
                    : '#5E3823'),
              }}
            />
            <span className="text-[#7E636E] dark:text-[#B59FA9] font-normal">Tone:</span>
            <span className="font-bold">{toneLabel}</span>
          </div>

          {/* Undertone */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-xs font-medium text-[#3B1F2B] dark:text-[#FAF3F0] shadow-sm">
            <span className="text-[#7E636E] dark:text-[#B59FA9] font-normal">Undertone:</span>
            <span className="font-bold">{undertoneLabel}</span>
          </div>

          {/* Detected Concerns */}
          {traits.visibleConcerns.map((c) => {
            const isElevated = c.level === 'high' || c.level === 'moderate';
            return (
              <div
                key={c.concern}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-medium shadow-sm ${
                  isElevated
                    ? 'bg-[#F4D9D6]/40 dark:bg-[#3B1F2B]/40 border-[#E8D3C0] text-[#3B1F2B] dark:text-[#FAF3F0]'
                    : 'bg-white/80 dark:bg-white/5 border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.level === 'high'
                      ? 'bg-[#CE7F79]'
                      : c.level === 'moderate'
                      ? 'bg-amber-400'
                      : 'bg-[#8CA583]'
                  }`}
                />
                <span className="capitalize">{c.concern.replace('_', ' ')}</span>
                <span className="text-[10px] opacity-75 font-semibold">({c.level})</span>
              </div>
            );
          })}
        </div>

        {/* Row 2: Requirements Strip */}
        <div className="pt-3 border-t border-[#E8D3C0]/60 dark:border-white/5 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#8CA583]" />
              Your Rules & Constraints:
            </span>

            {onEditRequirements && (
              <button
                id="edit-requirements-btn"
                type="button"
                onClick={onEditRequirements}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#CE7F79] hover:underline self-start sm:self-auto transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Goals & Budget</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Budget Chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#C9D6C3]/40 border border-[#C9D6C3] text-[#44633B] dark:text-[#C9D6C3] text-xs font-bold">
              <Wallet className="w-3 h-3" />
              <span>Max ₹{requirements.budgetMax.toLocaleString('en-IN')}</span>
            </div>

            {/* Targeted Goals */}
            {requirements.targetedConcerns?.map((concern) => (
              <div
                key={concern}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] text-xs font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-[#8CA583]" />
                <span className="capitalize">{concern.replace('_', ' ')}</span>
              </div>
            ))}

            {/* Avoid Ingredients */}
            {requirements.avoidIngredients?.map((avoid) => (
              <div
                key={avoid}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F4D9D6]/50 border border-[#CE7F79]/40 text-[#8A4D71] dark:text-[#F4D9D6] text-xs font-bold"
              >
                <ShieldAlert className="w-3 h-3 text-[#CE7F79]" />
                <span>Avoid: {avoid}</span>
              </div>
            ))}

            {/* Desired Formats */}
            {requirements.productTypes?.map((pType) => (
              <div
                key={pType}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[#7E636E] dark:text-[#B59FA9] text-xs font-medium capitalize"
              >
                <span>{pType}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
