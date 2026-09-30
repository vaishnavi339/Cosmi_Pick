'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Droplets } from 'lucide-react';

export function TextureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax shift for texture image
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1.08, 1.02]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden my-12"
    >
      {/* Parallax Background Photo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : y,
            scale: shouldReduceMotion ? 1 : scale,
          }}
          className="relative w-full h-[120%] -top-[10%]"
        >
          <Image
            src="/images/mood/texture-closeup.webp"
            alt="Velvety cosmetic cream texture swatch in warm natural light"
            fill
            quality={90}
            sizes="100vw"
            className="object-cover object-center select-none brightness-[0.92] dark:brightness-[0.65]"
          />
        </motion.div>

        {/* Ambient Overlay for High Legibility */}
        <div className="absolute inset-0 bg-[#3B1F2B]/40 dark:bg-[#180F14]/55 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF7F4] via-transparent to-[#FBF7F4] dark:from-[#120B0F] dark:to-[#120B0F]" />
      </div>

      {/* Editorial Copy */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16 z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold tracking-wider uppercase text-[#FBF7F4]"
        >
          <Droplets className="w-3.5 h-3.5 text-[#F4D9D6]" />
          <span>Dermal Bio-Compatibility</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-[#FBF7F4] tracking-tight leading-[1.15]"
        >
          Formulations chosen for how they feel, work, and sink into your skin.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-lg text-[#F4D9D6] max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm"
        >
          Zero artificial silicones or heavy occlusive films. Only lightweight, bio-mimetic barrier lipids designed to melt into your epidermis without residue.
        </motion.p>
      </div>
    </section>
  );
}
