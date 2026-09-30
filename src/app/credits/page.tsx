import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export const metadata = {
  title: 'Image & Data Credits · CosmicPick',
  description: 'Full attribution, licensing, and provenance for Open Beauty Facts and editorial photography used across CosmicPick.',
};

export default function CreditsPage() {
  const products = productsData as Product[];
  const productsWithImages = products.filter((p) => p.image);

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7E636E] dark:text-[#B59FA9] hover:text-[#3B1F2B] dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero Header */}
        <div className="border-b border-[#E8D3C0]/70 dark:border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4D9D6]/40 dark:bg-[#3B1F2B]/60 border border-[#E8D3C0] dark:border-white/10 text-xs font-semibold text-[#8C4A5A] dark:text-[#F4D9D6] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ethical Sourcing & Open Attribution</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#3B1F2B] dark:text-[#FAF3F0] mb-4">
            Image & Data Credits
          </h1>
          <p className="text-base sm:text-lg text-[#7E636E] dark:text-[#B59FA9] max-w-2xl leading-relaxed">
            CosmicPick is built on open standards and community contributions. We strictly adhere to real product photography, open licenses, and transparent data attribution.
          </p>
        </div>

        {/* Section 1: Open Beauty Facts Attribution */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-[#E8D3C0] dark:border-white/10 shadow-soft-luxury">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF2E8] dark:bg-[#8CA583]/20 border border-[#C9D6C3] dark:border-white/10 flex items-center justify-center flex-shrink-0 text-[#44633B] dark:text-[#A7C19E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3B1F2B] dark:text-[#FAF3F0] mb-2">
                Open Beauty Facts (world.openbeautyfacts.org)
              </h2>
              <p className="text-sm text-[#7E636E] dark:text-[#B59FA9] leading-relaxed mb-4">
                All real cosmetic product photography, barcode verification, and ingredient lists are provided by <strong>Open Beauty Facts</strong>, a collaborative, free and open database of cosmetic products from around the world.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
                <div className="p-4 rounded-xl bg-[#FBF7F4] dark:bg-white/[0.03] border border-[#E8D3C0]/60 dark:border-white/5">
                  <strong className="block text-[#3B1F2B] dark:text-[#FAF3F0] mb-1 font-semibold">
                    Product Photography License:
                  </strong>
                  <span className="text-[#7E636E] dark:text-[#B59FA9]">
                    Photos uploaded by Open Beauty Facts contributors are made available under the <strong>Creative Commons Attribution-ShareAlike (CC BY-SA 3.0 / 4.0)</strong> license.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF7F4] dark:bg-white/[0.03] border border-[#E8D3C0]/60 dark:border-white/5">
                  <strong className="block text-[#3B1F2B] dark:text-[#FAF3F0] mb-1 font-semibold">
                    Database & Ingredient Listings License:
                  </strong>
                  <span className="text-[#7E636E] dark:text-[#B59FA9]">
                    The Open Beauty Facts database is made available under the <strong>Open Database License (ODbL)</strong>.
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://world.openbeautyfacts.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#3B1F2B] text-white dark:bg-[#F4D9D6] dark:text-[#3B1F2B] hover:opacity-90 transition-opacity"
                >
                  <span>Visit Open Beauty Facts</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF5F0] dark:bg-white/10 text-[#3B1F2B] dark:text-[#FAF3F0] border border-[#E8D3C0] dark:border-white/15 hover:bg-[#F4D9D6]/30 transition-colors"
                >
                  <span>CC BY-SA 4.0 Legal Code</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Catalog Products Photography Manifest */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3B1F2B] dark:text-[#FAF3F0]">
                Catalog Products Manifest
              </h2>
              <p className="text-xs sm:text-sm text-[#7E636E] dark:text-[#B59FA9] mt-1">
                Verified against Open Beauty Facts API v2 (minimum 80% similarity threshold).
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2E8] dark:bg-[#8CA583]/20 text-[#44633B] dark:text-[#C9D6C3] border border-[#C9D6C3]">
              {productsWithImages.length} of {products.length} Photographed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsWithImages.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#E8D3C0]/80 dark:border-white/10 flex items-center gap-4 hover:border-[#8CA583] transition-colors"
              >
                <div className="relative w-20 h-20 rounded-xl bg-white border border-[#E8D3C0]/60 p-2 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={product.image!}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E636E] dark:text-[#B59FA9] block">
                    {product.brand}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#3B1F2B] dark:text-[#FAF3F0] line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="mt-1 text-[11px] text-[#7E636E] dark:text-[#B59FA9] space-y-0.5">
                    <div>Barcode: <code className="text-[#3B1F2B] dark:text-[#F4D9D6]">{product.barcode || '—'}</code></div>
                    <div>Photo: <span className="italic">{product.imageSource?.contributor || 'Open Beauty Facts contributors'}</span></div>
                    <div className="text-[10px] text-[#8CA583] font-semibold">{product.imageSource?.license || 'CC BY-SA'}</div>
                  </div>
                </div>
                {product.imageSource?.url && (
                  <a
                    href={product.imageSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7E636E] hover:text-[#3B1F2B] dark:hover:text-[#FAF3F0] p-2"
                    title="View on Open Beauty Facts"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Documentation Reference */}
        <section className="p-6 rounded-2xl bg-[#FAF5F0] dark:bg-white/[0.02] border border-[#E8D3C0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#8C4A5A] flex-shrink-0" />
            <div className="text-xs text-[#7E636E] dark:text-[#B59FA9]">
              Detailed verification logs, checklists, and mood photography sources are maintained in <code className="bg-white/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-[#3B1F2B] dark:text-[#FAF3F0]">docs/IMAGE_CREDITS.md</code>.
            </div>
          </div>
        </section>
    </div>
  );
}
