'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
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

    const sectionIds = ['how-it-works', 'featured', 'undertone', 'ingredients', 'faq'];
    
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
    { label: 'How it works', href: '/#how-it-works', id: 'how-it-works' },
    { label: 'Featured Formulations', href: '/#featured', id: 'featured' },
    { label: 'Undertone Guide', href: '/#undertone', id: 'undertone' },
    { label: 'Ingredients', href: '/#ingredients', id: 'ingredients' },
    { label: 'Privacy', href: '/privacy', id: 'privacy', icon: ShieldCheck },
    { label: 'FAQ', href: '/#faq', id: 'faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF7F4]/95 dark:bg-[#180F14]/95 backdrop-blur-md border-b border-[#E8D3C0]/70 dark:border-white/10 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#F4D9D6] dark:bg-[#3B1F2B] border border-[#E8D3C0]/70 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-[#3B1F2B] dark:text-[#F4D9D6]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#3B1F2B] dark:text-[#FAF3F0]">
              CosmicPick
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7E636E] dark:text-[#B59FA9] -mt-1">
              Custom Skincare
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-medium text-[#7E636E] dark:text-[#B59FA9]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const Icon = link.icon;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-[#3B1F2B] dark:text-[#FAF3F0] font-semibold bg-[#F4D9D6]/70 dark:bg-white/10 shadow-sm'
                    : 'hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] hover:bg-[#F4D9D6]/30 dark:hover:bg-white/5'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#3B1F2B] dark:text-[#FAF3F0]' : 'text-[#8CA583]'
                    }`}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3.5">
          <ThemeToggle />
          <Link
            id="nav-start-scan-btn"
            href="/scan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_4px_14px_0_rgba(59,31,43,0.3)] hover:shadow-[0_6px_20px_0_rgba(59,31,43,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Start Your Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full border border-[#E8D3C0] dark:border-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] bg-white/70 dark:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8D3C0] dark:border-white/10 bg-[#FBF7F4]/98 dark:bg-[#180F14]/98 backdrop-blur-xl px-5 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const Icon = link.icon;

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#3B1F2B] dark:text-[#FAF3F0] font-semibold bg-[#F4D9D6]/60 dark:bg-white/10'
                    : 'text-[#3B1F2B] dark:text-[#FAF3F0] hover:bg-[#F4D9D6]/30 dark:hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-[#8CA583]" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              id="mobile-start-scan-btn"
              href="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-[#FBF7F4] bg-[#3B1F2B] hover:bg-[#2B141F] shadow-[0_4px_14px_0_rgba(59,31,43,0.3)] text-sm transition-all"
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
