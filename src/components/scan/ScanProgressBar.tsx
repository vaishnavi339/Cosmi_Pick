'use client';

import React from 'react';
import { ShieldCheck, Camera, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { num: 1, label: 'Privacy', icon: ShieldCheck },
  { num: 2, label: 'Face scan', icon: Camera },
  { num: 3, label: 'Skin profile', icon: Sparkles },
  { num: 4, label: 'Preferences', icon: Sliders },
  { num: 5, label: 'Your picks', icon: CheckCircle2 },
];

export function ScanProgressBar({ currentStep, onStepClick }: Props) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const active = steps[currentStep - 1];

  return (
    <nav aria-label="Personalized scan progress" className="mx-auto mb-7 w-full max-w-6xl px-4 sm:mb-10">
      <div className="rounded-[1.5rem] border border-[#E1E3D9] bg-white/85 px-3 py-4 shadow-[0_14px_45px_-35px_rgba(33,58,48,.42)] backdrop-blur sm:px-7 sm:py-5 dark:border-white/10 dark:bg-[#222B25]/90">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B86A4B]">Your personal edit</p>
            <p className="mt-1 font-serif text-lg text-[#213A30] dark:text-[#F7F6F0]">{active?.label}</p>
          </div>
          <span className="rounded-full border border-[#DCDACD] bg-[#F7F6F0] px-3 py-1.5 text-[10px] font-semibold text-[#68766C] dark:border-white/10 dark:bg-white/5 dark:text-[#C5CEC5]">Step {currentStep} <span className="opacity-60">/ {steps.length}</span></span>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute left-[9%] right-[9%] top-[17px] h-px bg-[#DCDACD] dark:bg-white/10" />
          <div aria-hidden="true" className="absolute left-[9%] top-[17px] h-px bg-[#71896C] transition-[width] duration-500" style={{ width: `${progress * 0.82}%` }} />
          <ol className="relative grid grid-cols-5 gap-1">
            {steps.map(({ num, label, icon: Icon }) => {
              const completed = num < currentStep;
              const current = num === currentStep;
              const canVisit = completed && Boolean(onStepClick);
              return (
                <li key={num} className="min-w-0">
                  <button type="button" aria-current={current ? 'step' : undefined} disabled={!canVisit} onClick={() => canVisit && onStepClick?.(num)} className={`group flex w-full flex-col items-center gap-2 text-center ${canVisit ? 'cursor-pointer' : 'cursor-default'}`}>
                    <span className={`relative z-10 grid h-[34px] w-[34px] place-items-center rounded-full border transition-all duration-300 sm:h-9 sm:w-9 ${current ? 'scale-105 border-[#213A30] bg-[#213A30] text-white shadow-md shadow-[#213A30]/20 ring-4 ring-[#E2EADD] dark:border-[#E2EADD] dark:bg-[#E2EADD] dark:text-[#213A30] dark:ring-[#213A30]' : completed ? 'border-[#71896C] bg-[#71896C] text-white' : 'border-[#DCDACD] bg-[#F7F6F0] text-[#879188] dark:border-white/15 dark:bg-[#17201B] dark:text-[#A6B0A5]'}`}>
                      {completed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className={`block max-w-full truncate text-[9px] font-semibold sm:text-[11px] ${current ? 'text-[#213A30] dark:text-[#F7F6F0]' : completed ? 'text-[#54715C] dark:text-[#D4E2D2]' : 'text-[#849087] dark:text-[#A6B0A5]'} ${canVisit ? 'group-hover:underline' : ''}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
