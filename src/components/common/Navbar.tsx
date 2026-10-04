'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname();

  // Handle scroll shadow/background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section when on home page
  useEffect(() => {
    if (pathname === '/privacy') {
      setActiveSection('privacy');
      return;
    }

    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['ritual-method', 'ritual-studio', 'shop', 'our-approach', 'faq'];
    
    // Check initial hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      if (sectionIds.includes(hashId)) {
        setActiveSection(hashId);
      }
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting entry from top to bottom
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // trigger when section is in top-middle of screen
      threshold: 0.1,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const navLinks = [
    { label: 'How it works', href: '/#ritual-method', id: 'ritual-method' },
    { label: 'Ritual Studio', href: '/#ritual-studio', id: 'ritual-studio' },
    { label: 'Shop', href: '/#shop', id: 'shop' },
    { label: 'About', href: '/#our-approach', id: 'our-approach' },
    { label: 'FAQ', href: '/#faq', id: 'faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled ? 'site-header shadow-[0_8px_30px_-22px_rgba(23,32,27,0.4)]' : 'bg-[#F7F6F0]/80 dark:bg-[#17201B]/75 backdrop-blur-xl border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-10 h-[72px] flex items-center justify-between gap-5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#E2EADD] dark:bg-[#213A30] border border-[#DCDACD]/70 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-[#213A30] dark:text-[#E2EADD]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-semibold text-[21px] tracking-tight text-[#213A30] dark:text-[#F7F6F0] leading-none">
              CosmicPick
            </span>
            <span className="text-[9px] tracking-[0.19em] uppercase font-semibold text-[#68766C] dark:text-[#A6B0A5] mt-1">
              Custom Skincare
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full border border-[#DCDACD]/75 bg-white/55 p-1 text-[13px] font-medium text-[#68766C] shadow-sm shadow-[#213A30]/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-[#A6B0A5]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-[#213A30] dark:text-[#F7F6F0] font-semibold bg-[#E2EADD]/90 dark:bg-white/10 shadow-sm'
                    : 'hover:text-[#213A30] dark:hover:text-[#F7F6F0] hover:bg-[#E2EADD]/30 dark:hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            id="nav-start-scan-btn"
            href="/scan"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-[#F7F6F0] bg-[#213A30] hover:bg-[#14271F] shadow-[0_6px_18px_-5px_rgba(59,31,43,0.4)] hover:shadow-[0_9px_24px_-5px_rgba(59,31,43,0.48)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Start Your Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full border border-[#DCDACD] dark:border-white/10 text-[#213A30] dark:text-[#F7F6F0] bg-white/70 dark:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#DCDACD] dark:border-white/10 bg-[#F7F6F0]/98 dark:bg-[#17201B]/98 backdrop-blur-xl px-5 pt-3 pb-6 space-y-2 shadow-xl shadow-[#213A30]/5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#213A30] dark:text-[#F7F6F0] font-semibold bg-[#E2EADD]/60 dark:bg-white/10'
                    : 'text-[#213A30] dark:text-[#F7F6F0] hover:bg-[#E2EADD]/30 dark:hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              id="mobile-start-scan-btn"
              href="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-[#F7F6F0] bg-[#213A30] hover:bg-[#14271F] shadow-[0_4px_14px_0_rgba(59,31,43,0.3)] text-sm transition-all"
            >
              <span>Start Your Scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
