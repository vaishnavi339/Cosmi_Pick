'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CosmicPick match skincare without in-person consultations?',
      a: 'CosmicPick is designed for cosmetic formulation matching and routine discovery, not medical diagnosis. Our gentle optical scan measures 478 landmark points to understand your face shape, surface light reflection (indicating hydration vs oiliness), and undertone balance. You always have full control to edit your traits before products are recommended.',
    },
    {
      q: 'Is my face photo or webcam video ever stored?',
      a: 'Never. All analysis runs directly inside your browser using temporary device memory. No photos, videos, or face maps are ever recorded, saved, or uploaded to any server. Once the scan is done, camera hardware is immediately disconnected.',
    },
    {
      q: 'Is CosmicPick completely free to use?',
      a: 'Yes! CosmicPick is 100% free with no sign-up, subscriptions, or paywalls required. You can scan, adjust requirements, and explore curated routines whenever you wish.',
    },
    {
      q: 'What if I have sensitive or allergy-prone skin?',
      a: 'You can explicitly flag ingredients you wish to avoid—such as synthetic fragrance, essential oils, drying alcohols, or parabens. Any formulation containing an ingredient on your avoid-list is immediately filtered out or flagged with a prominent warning.',
    },
    {
      q: 'What should my room lighting look like for the scan?',
      a: 'Facing a window with soft natural daylight or an evenly-lit room provides the best optical accuracy. Our live screen gives you gentle cues if the lighting is too dark or backlit.',
    },
    {
      q: 'Can I use CosmicPick without turning on my camera?',
      a: 'No. Browse catalog matches in the Ritual Studio by concern and budget without opening a camera. For a full personal match, use the private on-device scan.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-20 relative isolate overflow-clip scroll-mt-24 bg-[#F7F6F0] dark:bg-[#17201B] section-stack"
      style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EADD]/60 dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 text-xs font-bold text-[#B86A4B] dark:text-[#F7F6F0] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#213A30] dark:text-[#F7F6F0] tracking-tight">
            Everything you need to know
          </h2>
          <p className="text-sm sm:text-base text-[#68766C] dark:text-[#A6B0A5] max-w-xl mx-auto">
            Clear, honest answers about our optical formulation engine, safety, and routines.
          </p>
        </div>

        {/* Accordion items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-3xl glass-card bg-white/80 dark:bg-[#222B25]/80 border border-[#DCDACD] dark:border-white/10 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-[#213A30] dark:text-[#F7F6F0] font-serif font-bold text-base sm:text-lg hover:text-[#B86A4B] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#DCDACD] dark:border-white/10 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#E2EADD]/50 text-[#213A30]' : 'bg-[#F7F6F0] text-[#68766C]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#68766C] dark:text-[#A6B0A5] leading-relaxed border-t border-[#DCDACD]/50 dark:border-white/5 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
