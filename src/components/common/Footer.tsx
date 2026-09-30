import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, AlertCircle, Heart } from 'lucide-react';
import { activeCategoryConfig } from '@/config/category.config';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#E8D3C0]/70 dark:border-white/10 bg-[#FBF7F4]/90 dark:bg-[#140C10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4D9D6] dark:bg-[#3B1F2B] border border-[#E8D3C0] dark:border-white/10 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-[#3B1F2B] dark:text-[#F4D9D6]" />
              </div>
              <span className="font-serif font-bold text-xl text-[#3B1F2B] dark:text-[#FAF3F0]">
                CosmicPick
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9D6C3]/40 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3] font-bold">
                {activeCategoryConfig.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] max-w-sm leading-relaxed">
              Personalized skincare recommendations tailored to your unique facial profile. 
              Private optical analysis with zero cloud image storage.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8CA583] font-semibold">
              <Shield className="w-4 h-4" />
              <span>100% On-Device Client Privacy Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
              Discover Formulations
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9]">
              <li>
                <Link href="/" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Start Your Scan
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link href="/#undertone" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Undertone Guide
                </Link>
              </li>
              <li>
                <Link href="/#ingredients" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Active Ingredients
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B1F2B] dark:text-[#FAF3F0]">
              Transparency & Ethics
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9]">
              <li>
                <Link href="/privacy" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] font-medium transition-colors">
                  Privacy Policy & Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/scan?mode=quiz" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Camera-Free 3-Question Quiz
                </Link>
              </li>
              <li>
                <Link href="/scan?debug=1" className="hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] transition-colors">
                  Optical Landmark Debug Mode
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="my-6 p-4 rounded-2xl border border-[#E8D3C0] bg-[#FAF5F0] dark:bg-white/[0.02] text-xs text-[#7E636E] dark:text-[#B59FA9] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#CE7F79]" />
          <p className="leading-relaxed">
            <strong>Cosmetic Disclaimer:</strong> CosmicPick provides algorithmic recommendations for topical cosmetic products based on optical facial analysis and user-specified criteria. CosmicPick is not a medical device and does not diagnose, treat, cure, or prevent dermatological diseases. Consult a dermatologist for medical skin conditions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E8D3C0]/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7E636E] dark:text-[#B59FA9] gap-4">
          <p>© {new Date().getFullYear()} CosmicPick. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Crafted for radiant, healthy skin</span>
            <Heart className="w-3.5 h-3.5 text-[#CE7F79] fill-[#CE7F79] inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
