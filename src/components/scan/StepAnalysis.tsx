'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { ExtractedFaceTraits, FaceShape, SkinTone, SkinUndertone, VisibleConcern } from '@/types';
import { activeCategoryConfig } from '@/config/category.config';

interface Props {
  traits: ExtractedFaceTraits;
  onTraitsConfirmed: (traits: ExtractedFaceTraits) => void;
  onRescan: () => void;
}

export function StepAnalysis({ traits: initialTraits, onTraitsConfirmed, onRescan }: Props) {
  const [analyzing, setAnalyzing] = useState(true);
  const [traits, setTraits] = useState<ExtractedFaceTraits>(initialTraits);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const config = activeCategoryConfig;

  // Handlers for manual override
  const handleShapeChange = (shape: FaceShape) => {
    setTraits({
      ...traits,
      faceShape: {
        value: shape,
        confidence: 100,
        label: config.traitLabels.faceShapes[shape].label,
      },
    });
  };

  const handleToneChange = (tone: SkinTone) => {
    setTraits({
      ...traits,
      skinTone: {
        value: tone,
        confidence: 100,
        label: config.traitLabels.skinTones[tone].label,
      },
    });
  };

  const handleUndertoneChange = (undertone: SkinUndertone) => {
    setTraits({
      ...traits,
      skinUndertone: {
        value: undertone,
        confidence: 100,
        label: config.traitLabels.skinUndertones[undertone].label,
      },
    });
  };

  const handleConcernLevelChange = (concern: VisibleConcern, level: 'low' | 'moderate' | 'high') => {
    const updated = traits.visibleConcerns.map((c) => {
      if (c.concern === concern) {
        return { ...c, level, confidence: 100 };
      }
      return c;
    });
    setTraits({ ...traits, visibleConcerns: updated });
  };

  if (analyzing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#F4D9D6] border-t-[#3B1F2B] animate-spin" />
          <div className="w-16 h-16 rounded-full bg-[#FAF5F0] dark:bg-white/5 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#CE7F79] animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-2xl text-[#3B1F2B] dark:text-[#FAF3F0]">
            Reading Your Skin Profile...
          </h3>
          <p className="text-sm text-[#7E636E] dark:text-[#B59FA9]">
            Evaluating skin tone, undertone balance, and visible hydration needs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[#E8D3C0] dark:border-white/10 shadow-soft-luxury space-y-8 bg-white/90 dark:bg-[#20151C]/90">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5F0] dark:bg-white/5 border border-[#E8D3C0] dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] mb-1">
              <Sparkles className="w-3 h-3 text-[#CE7F79]" />
              <span>Step 3 of 5 • Skin Profile Review</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1F2B] dark:text-[#FAF3F0]">
              Your Detected Skin Profile
            </h2>
            <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] mt-1">
              Here is what we noticed. Feel free to adjust anything that doesn&apos;t feel quite right.
            </p>
          </div>

          <button
            id="toggle-trait-edit-btn"
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#3B1F2B] dark:text-[#FAF3F0] border border-[#E8D3C0] dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-[#F4D9D6]/30 transition-colors self-start sm:self-auto shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#CE7F79]" />
            <span>{isEditing ? 'Done Editing' : 'Edit Traits'}</span>
          </button>
        </div>

        {/* Lighting Alert if Fair/Poor */}
        {traits.lightingQuality === 'poor' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Lighting was a bit dim:</strong> For the most precise reading, consider retaking in natural light or adjust your traits below.
              </span>
            </div>
            <button
              type="button"
              onClick={onRescan}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 underline flex-shrink-0"
            >
              Rescan
            </button>
          </div>
        )}

        {/* Primary Traits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Face Shape */}
          <div className="p-4 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7E636E] dark:text-[#B59FA9]">
              <span className="font-semibold uppercase tracking-wider">Face Shape</span>
              <span className="font-mono text-[#CE7F79] font-bold">{traits.faceShape.confidence}%</span>
            </div>

            {isEditing ? (
              <select
                id="edit-face-shape"
                value={traits.faceShape.value}
                onChange={(e) => handleShapeChange(e.target.value as FaceShape)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white dark:bg-[#180F14] border border-[#E8D3C0] dark:border-white/20 text-[#3B1F2B] dark:text-white"
              >
                {(['oval', 'round', 'square', 'heart', 'oblong'] as FaceShape[]).map((shape) => (
                  <option key={shape} value={shape}>
                    {config.traitLabels.faceShapes[shape].label}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <p className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0] capitalize">
                  {traits.faceShape.label}
                </p>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] mt-0.5">
                  {config.traitLabels.faceShapes[traits.faceShape.value]?.description}
                </p>
              </div>
            )}
          </div>

          {/* 2. Skin Tone */}
          <div className="p-4 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7E636E] dark:text-[#B59FA9]">
              <span className="font-semibold uppercase tracking-wider">Skin Tone</span>
              <span className="font-mono text-[#CE7F79] font-bold">{traits.skinTone.confidence}%</span>
            </div>

            {isEditing ? (
              <select
                id="edit-skin-tone"
                value={traits.skinTone.value}
                onChange={(e) => handleToneChange(e.target.value as SkinTone)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white dark:bg-[#180F14] border border-[#E8D3C0] dark:border-white/20 text-[#3B1F2B] dark:text-white"
              >
                {(['fair', 'light', 'medium', 'tan', 'deep'] as SkinTone[]).map((tone) => (
                  <option key={tone} value={tone}>
                    {config.traitLabels.skinTones[tone].label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: config.traitLabels.skinTones[traits.skinTone.value]?.hexSample,
                  }}
                />
                <div>
                  <p className="font-serif font-bold text-base text-[#3B1F2B] dark:text-[#FAF3F0] capitalize">
                    {traits.skinTone.label}
                  </p>
                  <p className="text-xs text-[#7E636E] dark:text-[#B59FA9]">Surface Tone</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Skin Undertone */}
          <div className="p-4 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7E636E] dark:text-[#B59FA9]">
              <span className="font-semibold uppercase tracking-wider">Undertone</span>
              <span className="font-mono text-[#CE7F79] font-bold">{traits.skinUndertone.confidence}%</span>
            </div>

            {isEditing ? (
              <select
                id="edit-skin-undertone"
                value={traits.skinUndertone.value}
                onChange={(e) => handleUndertoneChange(e.target.value as SkinUndertone)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white dark:bg-[#180F14] border border-[#E8D3C0] dark:border-white/20 text-[#3B1F2B] dark:text-white"
              >
                {(['warm', 'cool', 'neutral'] as SkinUndertone[]).map((ut) => (
                  <option key={ut} value={ut}>
                    {config.traitLabels.skinUndertones[ut].label}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <p className="font-serif font-bold text-lg text-[#3B1F2B] dark:text-[#FAF3F0] capitalize">
                  {traits.skinUndertone.label}
                </p>
                <p className="text-xs text-[#7E636E] dark:text-[#B59FA9] mt-0.5">
                  {config.traitLabels.skinUndertones[traits.skinUndertone.value]?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Visible Concerns Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9]">
            Detected Skin Focus Areas
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {traits.visibleConcerns.map((vc) => {
              const badgeColors = {
                high: 'bg-[#F4D9D6] text-[#8A4D71] border-[#CE7F79]',
                moderate: 'bg-amber-100 text-amber-800 border-amber-300',
                low: 'bg-[#C9D6C3]/40 text-[#44633B] border-[#8CA583]',
              };

              return (
                <div
                  key={vc.concern}
                  className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E8D3C0] dark:border-white/10 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#3B1F2B] dark:text-[#FAF3F0]">{vc.label}</p>
                    <span className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
                      Confidence: {vc.confidence}%
                    </span>
                  </div>

                  {isEditing ? (
                    <select
                      value={vc.level}
                      onChange={(e) =>
                        handleConcernLevelChange(
                          vc.concern,
                          e.target.value as 'low' | 'moderate' | 'high'
                        )
                      }
                      className="text-xs font-semibold p-2 rounded-lg bg-[#FAF5F0] dark:bg-[#180F14] border border-[#E8D3C0] dark:border-white/20 text-[#3B1F2B] dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">Elevated</option>
                    </select>
                  ) : (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                        badgeColors[vc.level]
                      }`}
                    >
                      {vc.level}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#E8D3C0]/60 dark:border-white/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onRescan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E8D3C0] dark:border-white/15 text-xs font-semibold text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Scan</span>
          </button>

          <button
            id="confirm-traits-btn"
            type="button"
            onClick={() => onTraitsConfirmed(traits)}
            className="px-6 py-3.5 rounded-full font-bold text-white bg-[#3B1F2B] hover:bg-[#2B141F] dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-soft-luxury text-sm flex items-center gap-2 transition-all"
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
