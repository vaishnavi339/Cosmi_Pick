'use client';

import React from 'react';
import { ShieldCheck, Camera, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

interface Props {
  currentStep: number; // 1 to 5
  onStepClick?: (step: number) => void;
}

export function ScanProgressBar({ currentStep, onStepClick }: Props) {
  const steps = [
    { num: 1, label: 'Privacy', icon: ShieldCheck },
    { num: 2, label: 'Face Scan', icon: Camera },
    { num: 3, label: 'Skin Traits', icon: Sparkles },
    { num: 4, label: 'Preferences', icon: Sliders },
    { num: 5, label: 'Picks', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Step Indicators */}
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#E8D3C0] dark:bg-white/10 -z-0" />
        {/* Active Line Fill */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#3B1F2B] dark:bg-[#F4D9D6] transition-all duration-500 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;
          const Icon = step.icon;

          return (
            <button
              key={step.num}
              type="button"
              disabled={step.num > currentStep}
              onClick={() => onStepClick && isCompleted && onStepClick(step.num)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                step.num > currentStep ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#3B1F2B] text-white dark:bg-[#F4D9D6] dark:text-[#3B1F2B] shadow-soft-luxury scale-110 ring-4 ring-[#F4D9D6] dark:ring-[#3B1F2B]/50'
                    : isCompleted
                    ? 'bg-[#8CA583] text-white shadow-sm'
                    : 'bg-[#FAF5F0] dark:bg-[#20151C] text-[#7E636E] dark:text-[#B59FA9] border border-[#E8D3C0] dark:border-white/10'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs mt-2 font-medium tracking-tight hidden sm:block ${
                  isCurrent
                    ? 'text-[#3B1F2B] dark:text-[#FAF3F0] font-bold'
                    : isCompleted
                    ? 'text-[#8CA583] dark:text-[#C9D6C3]'
                    : 'text-[#7E636E] dark:text-[#B59FA9]'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
