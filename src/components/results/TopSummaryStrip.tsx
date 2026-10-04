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
    <div className="rounded-[1.75rem] glass-card bg-white/95 dark:bg-[#23342B] border border-[#DCDACD] dark:border-[#41554A] p-5 sm:p-7 shadow-[0_20px_65px_-42px_rgba(33,58,48,.42)] relative overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient corner glow */}
      <div aria-hidden="true" className="absolute top-0 right-0 h-56 w-56 bg-gradient-to-bl from-[#E2EADD]/35 via-[#F7F6F0]/10 to-transparent rounded-full pointer-events-none -mr-24 -mt-32 dark:from-[#71896C]/15 dark:via-transparent" />

      {/* Top Meta Bar: Status, Demo Badge, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#DCDACD]/60 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2EADD]/75 dark:bg-[#31493B] border border-[#DCDACD] dark:border-[#536A5A] text-xs font-bold tracking-wide text-[#213A30] dark:text-[#F1F4EE]">
            <Sparkles className="w-3.5 h-3.5 text-[#B86A4B]" />
            <span>Personalized Dermal Profile</span>
          </div>

          {/* Demo Data Label */}
          <span
            id="demo-data-badge"
            className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-[#F7F6F0] dark:bg-[#1C2A22] text-[#55655A] dark:text-[#D3DCD3] font-medium border border-[#DCDACD] dark:border-[#41554A]"
          >
            <Info className="w-3 h-3 text-[#B86A4B]" />
            Demo data (prices & ratings) • Suggestions, not medical advice
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenRoutineBuilder && (
            <button
              id="open-routine-builder-btn"
              type="button"
              onClick={onOpenRoutineBuilder}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] dark:hover:bg-[#CAD8C8] shadow-soft-luxury transition-all"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#213A30] dark:text-[#F7F6F0] bg-white/70 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 hover:bg-[#E2EADD]/30 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#B86A4B]" />
              <span className="hidden sm:inline">Profile Card</span>
            </button>
          )}

          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#68766C] dark:text-[#A6B0A5] bg-white/50 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 hover:text-[#213A30] transition-colors"
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B86A4B]" />
              Detected Facial Profile:
            </span>
          </div>

          {onEditTraits && (
            <button
              id="edit-traits-btn"
              type="button"
              onClick={onEditTraits}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#B86A4B] hover:underline self-start sm:self-auto transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Traits</span>
            </button>
          )}
        </div>

        {/* Trait Chips Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Face Shape */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-medium text-[#213A30] dark:text-[#F7F6F0] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#71896C]" />
            <span className="text-[#68766C] dark:text-[#A6B0A5] font-normal">Shape:</span>
            <span className="font-bold">{shapeLabel}</span>
          </div>

          {/* Skin Tone */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-medium text-[#213A30] dark:text-[#F7F6F0] shadow-sm">
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
            <span className="text-[#68766C] dark:text-[#A6B0A5] font-normal">Tone:</span>
            <span className="font-bold">{toneLabel}</span>
          </div>

          {/* Undertone */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-medium text-[#213A30] dark:text-[#F7F6F0] shadow-sm">
            <span className="text-[#68766C] dark:text-[#A6B0A5] font-normal">Undertone:</span>
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
                    ? 'bg-[#E2EADD]/40 dark:bg-[#213A30]/40 border-[#DCDACD] text-[#213A30] dark:text-[#F7F6F0]'
                    : 'bg-white/80 dark:bg-white/5 border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.level === 'high'
                      ? 'bg-[#B86A4B]'
                      : c.level === 'moderate'
                      ? 'bg-amber-400'
                      : 'bg-[#71896C]'
                  }`}
                />
                <span className="capitalize">{c.concern.replace('_', ' ')}</span>
                <span className="text-[10px] opacity-75 font-semibold">({c.level})</span>
              </div>
            );
          })}
        </div>

        {/* Row 2: Requirements Strip */}
        <div className="pt-3 border-t border-[#DCDACD]/60 dark:border-white/5 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68766C] dark:text-[#A6B0A5] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#71896C]" />
              Your Rules & Constraints:
            </span>

            {onEditRequirements && (
              <button
                id="edit-requirements-btn"
                type="button"
                onClick={onEditRequirements}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#B86A4B] hover:underline self-start sm:self-auto transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Goals & Budget</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Budget Chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D4E2D2]/40 border border-[#D4E2D2] text-[#405C45] dark:text-[#D4E2D2] text-xs font-bold">
              <Wallet className="w-3 h-3" />
              <span>Max ₹{requirements.budgetMax.toLocaleString('en-IN')}</span>
            </div>

            {/* Targeted Goals */}
            {requirements.targetedConcerns?.map((concern) => (
              <div
                key={concern}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[#213A30] dark:text-[#F7F6F0] text-xs font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-[#71896C]" />
                <span className="capitalize">{concern.replace('_', ' ')}</span>
              </div>
            ))}

            {/* Avoid Ingredients */}
            {requirements.avoidIngredients?.map((avoid) => (
              <div
                key={avoid}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E2EADD]/50 border border-[#B86A4B]/40 text-[#54715C] dark:text-[#E2EADD] text-xs font-bold"
              >
                <ShieldAlert className="w-3 h-3 text-[#B86A4B]" />
                <span>Avoid: {avoid}</span>
              </div>
            ))}

            {/* Desired Formats */}
            {requirements.productTypes?.map((pType) => (
              <div
                key={pType}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-[#68766C] dark:text-[#A6B0A5] text-xs font-medium capitalize"
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
