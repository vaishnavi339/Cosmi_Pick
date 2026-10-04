import React from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  RefreshCw,
  Columns,
  Share2,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      title: 'Zero-Cloud Biometric Privacy',
      description:
        'Powered by client-side WebAssembly MediaPipe. Video streams never leave your device memory, and cameras shut down the moment you exit.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/40',
    },
    {
      title: 'Explainable Match Scoring',
      description:
        'Transparent 0–100% compatibility scores calculated via modular weights, accompanied by 2–3 sentence AI justifications referencing your specific skin indicators.',
      icon: BrainCircuit,
      color: 'text-moss-400',
      borderGlow: 'hover:border-moss-500/40',
    },
    {
      title: 'Live Conversational Re-Ranking',
      description:
        'Simply type adjustments like "cheaper", "fragrance-free", or "only lightweight gels" to dynamically re-score and re-order the catalog in real time.',
      icon: RefreshCw,
      color: 'text-forest-400',
      borderGlow: 'hover:border-forest-500/40',
    },
    {
      title: 'Side-by-Side Product Comparison',
      description:
        'Select up to 3 products to compare in a synchronized comparison matrix: prices in ₹, active ingredients, texture, and targeted concerns.',
      icon: Columns,
      color: 'text-violet-400',
      borderGlow: 'hover:border-violet-500/40',
    },
    {
      title: 'CosmicPick Profile Card',
      description:
        'Export a gorgeous, shareable celestial card summarizing your face shape, tone, key concerns, and top 3 picks without revealing any face photos.',
      icon: Share2,
      color: 'text-pink-400',
      borderGlow: 'hover:border-pink-500/40',
    },
    {
      title: 'Universal Device Support',
      description:
        'Optimized for mobile viewports (360px) to ultra-wide displays (1536px), with touch gestures, high contrast WCAG AA, and reduced motion modes.',
      icon: Smartphone,
      color: 'text-amber-400',
      borderGlow: 'hover:border-amber-500/40',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-forest-600 dark:text-moss-400 uppercase">
            Platform Capabilities
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Designed for Precision, Built for Trust
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Engineered with the transparency of clinical dermatology and the elegance of deep-space astrophysics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`rounded-2xl glass-card p-6 border border-slate-200 dark:border-white/10 ${feature.borderGlow} transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center text-xs font-medium text-slate-400 group-hover:text-moss-400 transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
