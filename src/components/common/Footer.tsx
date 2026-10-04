import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Heart, Shield, Sparkles } from 'lucide-react';
import { activeCategoryConfig } from '@/config/category.config';

const discoverLinks = [
  { label: 'How it works', href: '/#ritual-method' },
  { label: 'Ritual Studio', href: '/#ritual-studio' },
  { label: 'Product shelf', href: '/#shop' },
  { label: 'Our approach', href: '/#our-approach' },
  { label: 'Frequently asked questions', href: '/#faq' },
];

const trustLinks = [
  { label: 'Privacy & on-device analysis', href: '/privacy' },
  { label: 'Image & data credits', href: '/credits' },
  { label: 'Start your personal scan', href: '/scan' },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[#1F3028] text-[#F7F6F0]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_8%_0%,rgba(184,106,75,0.18),transparent_38%),radial-gradient(ellipse_at_95%_90%,rgba(113,137,108,0.13),transparent_35%)]" />
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-12 pt-14 sm:pt-20 pb-7">
        <div className="group relative mb-14 overflow-hidden rounded-[1.75rem] border border-white/50 bg-[#DCE8D8] px-6 py-7 text-[#213A30] shadow-[0_24px_60px_-40px_rgba(0,0,0,.5)] sm:px-9 sm:py-8">
          <div aria-hidden="true" className="absolute -right-10 -top-24 h-64 w-64 rounded-full border border-[#213A30]/10 transition-transform duration-700 group-hover:scale-110" />
          <div aria-hidden="true" className="absolute -right-1 top-[-4.5rem] h-52 w-52 rounded-full border border-[#213A30]/10" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#54715C]">A little more you, in every step</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Your skin deserves a thoughtful start.</h2>
              <p className="mt-2 text-sm leading-6 text-[#526257]">Build a personal edit with your concerns, preferences, and budget in mind.</p>
            </div>
            <Link href="/scan" className="group/link inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#213A30] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#365443]">Start your scan <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-12 sm:pb-16">
          <div className="md:col-span-5 lg:col-span-6 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="w-11 h-11 rounded-2xl bg-[#E2EADD] text-[#213A30] flex items-center justify-center shadow-lg shadow-black/10 group-hover:-rotate-6 transition-transform">
                <Sparkles className="w-5 h-5" />
              </span>
              <span>
                <span className="font-serif text-2xl font-semibold tracking-tight block">CosmicPick</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4E2D2]">Personal skincare, considered</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-[#D4E2D2]">
              Thoughtful skincare picks, shaped around your skin and your priorities. A private, on-device scan helps you shop with more clarity and less guesswork.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[11px] font-medium text-[#E8ECE4]">
              <Shield className="w-3.5 h-3.5 text-[#D4E2D2]" />
              Your scan stays on your device
            </div>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A77A] mb-5">Explore</h2>
            <ul className="space-y-3.5">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#E8ECE4] hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A77A] mb-5">Trust & transparency</h2>
            <ul className="space-y-3.5">
              {trustLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm text-[#E8ECE4] hover:text-white transition-colors">
                    {link.label}<ArrowUpRight className="w-3.5 h-3.5 opacity-55" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 sm:px-5 flex items-start gap-3 text-xs leading-6 text-[#CBD5CC]">
          <span className="mt-0.5 text-[#C7A77A]">{activeCategoryConfig.name}</span>
          <p><strong className="text-[#F7F6F0]">Cosmetic disclaimer:</strong> CosmicPick provides product suggestions based on optical analysis and your preferences. It is not a medical device and does not diagnose or treat skin conditions. Consult a dermatologist for medical concerns.</p>
        </div>

        <div className="mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#AEBBB0]">
          <p>{String.fromCharCode(0x00a9)} {new Date().getFullYear()} CosmicPick. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">Made with care for your skin <Heart className="w-3 h-3 text-[#B86A4B] fill-[#B86A4B]" /></p>
        </div>
      </div>
    </footer>
  );
}
